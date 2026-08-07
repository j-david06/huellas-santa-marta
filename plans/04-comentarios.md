# Plan: Sistema de Comentarios y Pistas de la Comunidad

## 1. Dominio (Backend)

### Entidades
```
Comentario (Aggregate Root)
├── id: UUID
├── reporteId: UUID
├── autorId: UUID
├── contenido: String (máx 500 caracteres)
├── createdAt: LocalDateTime
├── updatedAt: LocalDateTime
├── deletedAt: LocalDateTime (soft delete)
├── esPublicador: Boolean
└── cantidadLikes: Integer (opcional v2)

Usuario
├── id: UUID
├── nombre: String
├── avatar: String
└── email: String (privado)
```

### Value Objects
```
ContenidoComentario
├── texto: String (máx 500)
├── sanitizar(): String
├── validar(): Boolean
└── censorearTelefonos(): String

FechaRelativa
├── ahora: LocalDateTime
└── calcular(): String
    (ej: "Hace 5 min", "Ayer", etc)
```

### Excepciones de Dominio
- `ComentarioNoEncontradoException`
- `ReporteNoEncontradoException`
- `UsuarioNoAutorizadoException`
- `ContenidoInvalidoException`
- `NoSePuedeComentarPropio ReporteException`

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases)

#### ComentarioPort
```
crearComentario(reporteId: ReporteId, usuarioId: UserId, contenido: String): ComentarioId
obtenerComentariosDelReporte(reporteId: ReporteId, pageable: Pageable): Page<Comentario>
editarComentario(id: ComentarioId, usuarioId: UserId, contenido: String): Comentario
eliminarComentario(id: ComentarioId, usuarioId: UserId): void
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioComentario (JPA)
```
save(comentario: Comentario): Comentario
findById(id: ComentarioId): Optional<Comentario>
findByReporteId(reporteId: ReporteId, pageable: Pageable): Page<Comentario>
findByUsuarioId(usuarioId: UserId): List<Comentario>
deleteLogical(id: ComentarioId): void
```

#### RepositorioUsuario (JPA)
```
findById(usuarioId: UserId): Optional<Usuario>
```

#### ServicioNotificaciones
```
notificarNuevoComentario(comentario: Comentario, publicadorId: UserId): void
notificarRespuestaDelPublicador(comentario: Comentario, usuarioQueComentoId: UserId): void
```

#### ServicioModeración
```
validarContenido(texto: String): Boolean
sanitizar(texto: String): String
censorearTelefonos(texto: String): String
```

### Adaptadores (Input)
- `ComentarioController` (REST)

### Adaptadores (Output)
- `RepositorioComentarioJPA` (Spring Data)
- `ServicioModeraciónImpl` (DOMPurify en backend o librería similar)
- `AdaptadorNotificacionesComentarios`

---

## 3. Endpoints REST

### Crear Comentario
```
POST /api/v1/reportes/{reporteId}/comentarios

Headers:
  Authorization: Bearer {token}

Body:
{
  "contenido": "Vi un perro similar en el parque hace 2 horas"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "reporteId": "...",
  "autor": {
    "id": "...",
    "nombre": "María G.",
    "avatar": "M"
  },
  "contenido": "Vi un perro similar en el parque hace 2 horas",
  "createdAt": "2024-08-07T14:30:00Z",
  "updatedAt": "2024-08-07T14:30:00Z",
  "esPublicador": false,
  "cantidadLikes": 0
}

Response 400: Contenido inválido o vacío
Response 401: No autorizado
Response 403: No puede comentar su propio reporte
Response 404: Reporte no encontrado
```

### Obtener Comentarios del Reporte
```
GET /api/v1/reportes/{reporteId}/comentarios?page=0&size=5

Response 200:
{
  "content": [
    {
      "id": "...",
      "autor": { "nombre": "María G.", "avatar": "M" },
      "contenido": "Vi un perro similar...",
      "createdAt": "2024-08-07T14:30:00Z",
      "esPublicador": false,
      "cantidadLikes": 2
    }
  ],
  "totalElements": 8,
  "totalPages": 2,
  "size": 5,
  "number": 0,
  "hasNext": true
}
```

### Editar Comentario
```
PATCH /api/v1/reportes/{reporteId}/comentarios/{comentarioId}

Headers:
  Authorization: Bearer {token}

Body:
{
  "contenido": "Vi un perro similar en el parque, es de color negro"
}

Response 200:
{
  "id": "...",
  "contenido": "Vi un perro similar en el parque, es de color negro",
  "createdAt": "2024-08-07T14:30:00Z",
  "updatedAt": "2024-08-07T14:35:00Z",
  "editado": true
}

Response 403: No es autor
Response 410: Pasó más de 1 hora desde creación
```

### Eliminar Comentario
```
DELETE /api/v1/reportes/{reporteId}/comentarios/{comentarioId}

Headers:
  Authorization: Bearer {token}

Response 204: (sin contenido)
Response 403: No es autor
Response 404: Comentario no encontrado
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── components/
│   ├── comentarios/
│   │   ├── ComentariosSection.tsx      (Sección completa)
│   │   ├── ComentarioForm.tsx          (Input + botón enviar)
│   │   ├── ComentarioCard.tsx          (Tarjeta de comentario)
│   │   ├── ComentarioList.tsx          (Lista paginada)
│   │   ├── ComentarioMenu.tsx          (Menú de opciones)
│   │   └── ComentarioPreview.tsx       (Preview con sanitización)
│
├── hooks/
│   ├── useComentarios.ts               (Fetch/crear comentarios)
│   └── useComentarioForm.ts            (Validación de forma)
│
├── services/
│   └── comentarioService.ts            (API calls)
│
├── types/
│   └── comentario.ts                   (tipos comentario)
│
└── utils/
    ├── sanitization.ts                 (sanitizar HTML)
    └── validation.ts                   (validar contenido)
```

### Componentes Principales

#### ComentariosSection.tsx
```typescript
Props:
  - reporteId: string
  - publicadorReporteId: string

State:
  - comentarios: Comentario[]
  - isLoadingMore: boolean
  - hasMore: boolean

Renders:
  - ComentarioForm (si user está loggeado)
  - ComentarioList con paginación
  - Botón "Cargar más"
```

#### ComentarioForm.tsx
```typescript
Props:
  - reporteId: string
  - onComentarioCreado: (comentario: Comentario) => void
  - isLoading?: boolean

State:
  - contenido: string
  - errors: string[]
  - charCount: number (max 500)

Behavior:
  - Input textarea con contador de caracteres
  - Botón "Enviar" (deshabilitado si vacío o > 500)
  - Enter + Ctrl/Cmd = enviar
  - Limpiar input después de enviar
  - Mostrar errores de validación
```

#### ComentarioCard.tsx
```typescript
Props:
  - comentario: Comentario
  - esDelUsuario: boolean
  - esPublicador: boolean
  - onEditar?: (nuevoContenido: string) => void
  - onEliminar?: () => void

Renders:
  - Avatar (iniciales)
  - Nombre del autor
  - Timestamp relativo
  - Badge "Propietario" si es publicador
  - Contenido (sanitizado)
  - Botón Like (opcional v2)
  - Menú de opciones (•••) si es del usuario
```

#### ComentarioList.tsx
```typescript
Props:
  - reporteId: string
  - publicadorReporteId: string

State:
  - comentarios: Comentario[]
  - page: number
  - isLoadingMore: boolean
  - hasMore: boolean

Behavior:
  - Mostrar máx 5 inicialmente
  - "Cargar más" → +5
  - Virtual scrolling si hay muchos
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear Migration Flyway**
   - `V5__create_comentarios_table.sql`
   - Campos: id, reporte_id, usuario_id, contenido, created_at, updated_at, deleted_at, es_publicador
   - Índices: reporte_id, usuario_id, created_at

2. **Crear Dominio**
   - Entidad `Comentario`
   - Value Object `ContenidoComentario`
   - Excepciones de dominio

3. **Crear ServicioModeración**
   - Validar contenido (no vacío, <= 500 caracteres)
   - Sanitizar HTML (DOMPurify o OWASP)
   - Censorear teléfonos (regex pattern)
   - Filtrar lenguaje ofensivo (lista de palabras prohibidas)

4. **Crear RepositorioComentario**
   - JPA con métodos: save, findById, findByReporteId (paginado), soft delete
   - Índices en: reporte_id, usuario_id

5. **Crear ComentarioUseCase**
   - `CrearComentarioUseCase`
   - `ObtenerComentariosUseCase`
   - `EditarComentarioUseCase`
   - `EliminarComentarioUseCase`
   - Validaciones: no comentar propio reporte, tiempo de edición < 1h, ownership

6. **Crear ComentarioController**
   - Endpoints: POST, GET (paginado), PATCH, DELETE

7. **Crear DTOs**
   - `ComentarioRequest`, `ComentarioResponse`, `ComentarioListResponse`

8. **Integrar Notificaciones**
   - Llamar a `ServicioNotificaciones` al crear/responder comentario

### Frontend (Next.js)

9. **Crear tipos TypeScript**
   - `Comentario`, `ComentarioFormData`, `ComentarioResponse`

10. **Crear servicio de comentarios**
    - `comentarioService.ts`:
      - `crearComentario(reporteId, contenido)`
      - `obtenerComentarios(reporteId, page)`
      - `editarComentario(reporteId, comentarioId, contenido)`
      - `eliminarComentario(reporteId, comentarioId)`

11. **Crear hooks**
    - `useComentarios` - fetch/paginación
    - `useComentarioForm` - validación, estado

12. **Crear componentes**
    - `ComentariosSection` - contenedor
    - `ComentarioForm` - input
    - `ComentarioCard` - visualización
    - `ComentarioList` - lista paginada
    - `ComentarioMenu` - opciones (editar/eliminar)

13. **Integración en ReportDetail**
    - Mostrar `ComentariosSection` al final
    - Sincronizar cantidad de comentarios en header

14. **Sanitización en Frontend**
    - Usar `DOMPurify` para renderizar contenido seguro
    - No confiar en backend (Defense in Depth)

15. **Notificaciones en Tiempo Real**
    - Polling o WebSocket para nuevos comentarios
    - Actualizar lista sin recargar página

16. **Pruebas**
    - Test validación de comentarios
    - Test edición (< 1h)
    - Test eliminación
    - Test paginación
    - Test sanitización

---

## Notas Técnicas Importantes

- **Soft Delete**: Usar campo `deleted_at` para mantener integridad referencial
- **Validación**: Lado cliente y servidor
  - No vacío
  - Máx 500 caracteres
  - Sin HTML (sanitizar)
  - Sin números de teléfono (censorear)
- **Edición**: Solo dentro de 1 hora
- **Eliminación**: Reemplazar con "[Comentario eliminado por el autor]" visualmente
- **Moderación**: Sistema de reportes de contenido inapropiado (v2)
- **Performance**:
  - Paginación de 5-10 comentarios
  - Virtual scrolling si hay muchos
  - Índices en DB
- **Sanitización**:
  - Backend: usar OWASP HTMLCleaner o similar
  - Frontend: usar DOMPurify
- **Notificaciones**: Usar WebSocket o polling cada 10s
