# Plan: Sistema de Reportes de Mascotas Perdidas y Encontradas

## 1. Dominio (Backend)

### Entidades
```
Reporte (Aggregate Root)
├── id: UUID
├── tipoAnimal: AnimalType (PERRO, GATO)
├── estado: ReportStatus (PERDIDO, ENCONTRADO)
├── reportStatus: ReportLifecycleStatus (ACTIVO, RESUELTO, ARCHIVADO)
├── fotos: List<Foto>
├── ubicacion: Ubicacion
├── color: String
├── raza: String (optional)
├── tamaño: Size (PEQUEÑO, MEDIANO, GRANDE)
├── sexo: Sex (MACHO, HEMBRA, DESCONOCIDO)
├── señasParticulares: String
├── descripcion: String
├── fechaAvistamiento: LocalDateTime
├── publicador: DatosContacto
├── fechaCreacion: LocalDateTime
├── ultimaActualizacion: LocalDateTime
├── cantidadComentarios: Integer
├── cantidadCoincidencias: Integer
```

### Value Objects
```
Ubicacion
├── latitud: Double
├── longitud: Double
├── direccion: String
└── barrio: String

Foto
├── url: String
├── orden: Integer
└── uploadedAt: LocalDateTime

DatosContacto
├── nombre: String
├── telefono: String (formato E.164)
├── email: String (optional)
└── usuarioId: UUID (optional)

AnimalType: PERRO, GATO

ReportStatus: PERDIDO, ENCONTRADO

ReportLifecycleStatus: ACTIVO, RESUELTO, ARCHIVADO

Size: PEQUEÑO, MEDIANO, GRANDE

Sex: MACHO, HEMBRA, DESCONOCIDO
```

### Excepciones de Dominio
- `ReporteNoEncontradoException`
- `FotoInvalidaException`
- `UbicacionInvalidaException`
- `UsuarioNoAutorizadoException`
- `ReporteNoActivoException`

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases / Servicios de Aplicación)

#### ReporteCreationPort
```
crearReporte(comando: CrearReporteCommand): ReporteId
- ValidarDatos()
- GuardarFotos()
- GuardarReporte()
- CalcularCoincidencias()
- EnviarNotificaciones()
```

#### ReporteQueryPort
```
obtenerReportePorId(id: ReporteId): Reporte
listarReportesActivos(filtros: FiltrosReporte): Page<Reporte>
buscarPorTexto(query: String, filtros: FiltrosReporte): Page<Reporte>
obtenerReportesPorUbicacion(lat: Double, lng: Double, radiusKm: Integer): List<Reporte>
```

#### ReporteUpdatePort
```
actualizarReporte(comando: ActualizarReporteCommand): Reporte
marcarComoResuelto(id: ReporteId, comentario: String): Reporte
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioReporte (JPA)
```
save(reporte: Reporte): Reporte
findById(id: ReporteId): Optional<Reporte>
findAllActivos(pageable: Pageable): Page<Reporte>
findByLocation(lat: Double, lng: Double, radiusKm: Integer): List<Reporte>
delete(id: ReporteId): void
```

#### ServicioAlmacenamiento (Foto)
```
guardarFoto(archivo: MultipartFile): String (URL)
eliminarFoto(url: String): void
```

#### ServicioGeocoding
```
geocodificar(direccion: String): Ubicacion
geocodificarInversa(lat: Double, lng: Double): String (direccion)
```

#### ServicioNotificaciones
```
notificarNuevoReporte(reporte: Reporte): void
notificarCoincidencia(reporteA: Reporte, reporteB: Reporte): void
```

### Adaptadores (Input)
- `ReporteController` (REST)
- `ReporteRequest` DTO

### Adaptadores (Output)
- `RepositorioReporteJPA` (Spring Data JPA)
- `AdaptadorS3Almacenamiento` (AWS S3)
- `AdaptadorGoogleGeocoding`
- `AdaptadorNotificacionesFirebase`

---

## 3. Endpoints REST

### Crear Reporte
```
POST /api/v1/reportes
Content-Type: multipart/form-data

Headers:
  Authorization: Bearer {token}

Body:
  tipoAnimal: PERRO
  estado: PERDIDO
  fotos: [archivo1.jpg, archivo2.jpg]
  latitud: 11.2456
  longitud: -74.1988
  direccion: "Centro Histórico"
  color: "Negro"
  raza: "Labrador"
  tamaño: MEDIANO
  sexo: MACHO
  señasParticulares: "Collar azul"
  descripcion: "Perdido hace 2 horas"
  fechaAvistamiento: "2024-08-07T10:30:00"
  nombreContacto: "Juan"
  telefonoContacto: "+573101234567"
  emailContacto: "juan@example.com"

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tipoAnimal": "PERRO",
  "estado": "PERDIDO",
  "reportStatus": "ACTIVO",
  "color": "Negro",
  "raza": "Labrador",
  "tamaño": "MEDIANO",
  "sexo": "MACHO",
  "fotos": [
    {
      "url": "https://s3.amazonaws.com/huellas/...",
      "orden": 1
    }
  ],
  "ubicacion": {
    "latitud": 11.2456,
    "longitud": -74.1988,
    "direccion": "Centro Histórico",
    "barrio": "Centro Histórico"
  },
  "publicador": {
    "nombre": "Juan",
    "telefono": "+573101234567"
  },
  "fechaCreacion": "2024-08-07T10:45:00Z",
  "cantidadComentarios": 0,
  "cantidadCoincidencias": 0
}

Response 400: Validación fallida
Response 401: No autorizado
Response 413: Archivo muy grande
```

### Obtener Reporte por ID
```
GET /api/v1/reportes/{id}

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tipoAnimal": "PERRO",
  "estado": "PERDIDO",
  "reportStatus": "ACTIVO",
  ...
}

Response 404: Reporte no encontrado
```

### Listar Reportes Activos
```
GET /api/v1/reportes?estado=PERDIDO&tipo=PERRO&color=Negro&barrio=Centro&page=0&size=10

Response 200:
{
  "content": [...],
  "pageable": { ... },
  "totalElements": 25,
  "totalPages": 3,
  "size": 10,
  "number": 0
}
```

### Buscar por Texto
```
GET /api/v1/reportes/search?q=Labrador&page=0&size=10

Response 200: (como listar)
```

### Obtener Reportes por Ubicación
```
GET /api/v1/reportes/ubicacion?latitud=11.2456&longitud=-74.1988&radiusKm=5

Response 200:
[
  { reporte1 },
  { reporte2 },
  ...
]
```

### Actualizar Reporte
```
PATCH /api/v1/reportes/{id}
Content-Type: application/json

Headers:
  Authorization: Bearer {token}

Body:
{
  "descripcion": "Nueva descripción",
  "señasParticulares": "Cicatriz en la oreja",
  "fotos": [{ "url": "...", "orden": 1 }]
}

Response 200: { reporte actualizado }
Response 403: No es propietario
```

### Marcar como Resuelto
```
POST /api/v1/reportes/{id}/resolver
Content-Type: application/json

Headers:
  Authorization: Bearer {token}

Body:
{
  "comentario": "¡Se encontró!"
}

Response 200:
{
  "id": "...",
  "reportStatus": "RESUELTO",
  ...
}

Response 403: No es propietario
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── app/
│   ├── reportes/
│   │   ├── page.tsx                    (Feed principal)
│   │   ├── [id]/
│   │   │   └── page.tsx                (Detalle del reporte)
│   │   ├── crear/
│   │   │   └── page.tsx                (Formulario crear reporte)
│   │   └── editar/
│   │       └── [id]/
│   │           └── page.tsx            (Formulario editar)
│
├── components/
│   ├── reportes/
│   │   ├── ReportCard.tsx              (Tarjeta de reporte)
│   │   ├── ReportForm.tsx              (Formulario multi-paso)
│   │   ├── ReportDetail.tsx            (Vista detalle)
│   │   ├── ReportMap.tsx               (Mapa interactivo)
│   │   ├── PhotoUpload.tsx             (Carga de fotos)
│   │   ├── LocationPicker.tsx          (Selector de ubicación)
│   │   └── ReportFilters.tsx           (Panel de filtros)
│
├── hooks/
│   ├── useReportes.ts                  (Fetch reportes)
│   ├── useReporteForm.ts               (Validación formulario)
│   └── useMapInteraction.ts            (Interacción mapa)
│
├── services/
│   └── reporteService.ts               (API calls)
│
├── types/
│   └── reporte.ts                      (TypeScript types)
│
└── utils/
    ├── validation.ts                   (Validaciones)
    ├── formatting.ts                   (Formateo de datos)
    └── location.ts                     (Geolocalización)
```

### Componentes Principales

#### ReportForm.tsx (Componente Multi-Paso)
```typescript
Props:
  - isEditing: boolean
  - reporteId?: string
  - onSuccess: (reporte: Reporte) => void

State:
  - currentStep: 1-5
  - formData: ReporteFormData
  - photos: File[]
  - errors: Record<string, string>
  - isLoading: boolean

Steps:
  1. Seleccionar estado (Perdido/Encontrado)
  2. Cargar fotos
  3. Seleccionar ubicación en mapa
  4. Detalles del animal
  5. Descripción + contacto
```

#### ReportCard.tsx
```typescript
Props:
  - reporte: Reporte
  - onClick: (id: string) => void

Renders:
  - Foto principal
  - Badge de estado
  - Nombre
  - Ubicación
  - Tiempo desde creación
```

#### ReportDetail.tsx
```typescript
Props:
  - reporteId: string

Renders:
  - Galería de fotos
  - Información del animal
  - Ubicación (mapa)
  - Datos de contacto (botón WhatsApp)
  - Comentarios
  - Alerta de coincidencia (si aplica)
```

#### ReportMap.tsx (Mapa Interactivo)
```typescript
Props:
  - centro?: { lat: number; lng: number }
  - markers: ReporteMarker[]
  - onMarkerClick: (reporteId: string) => void
  - onMapClick: (lat: number, lng: number) => void
  - zoomLevel?: number

Deps:
  - google-maps-react o leaflet
  - clustering
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear Migration Flyway**
   - `V1__create_reportes_table.sql`
   - Campos: id, tipo_animal, estado, report_status, color, raza, tamaño, sexo, señas_particulares, descripcion, fecha_avistamiento, fecha_creacion, ultima_actualizacion, cantidad_comentarios, cantidad_coincidencias, usuario_id
   - `V2__create_fotos_table.sql`
   - `V3__create_ubicacion_table.sql`
   - `V4__create_datos_contacto_table.sql`

2. **Crear Dominio**
   - Entidades: `Reporte`, `Foto`, `Ubicacion`, `DatosContacto`
   - Value Objects: `AnimalType`, `ReportStatus`, `ReportLifecycleStatus`, `Size`, `Sex`
   - Excepciones de dominio

3. **Crear Puertos (Interfaces)**
   - `ReporteCreationPort`
   - `ReporteQueryPort`
   - `ReporteUpdatePort`
   - `RepositorioReporte` (interface)
   - `ServicioAlmacenamiento`
   - `ServicioGeocoding`
   - `ServicioNotificaciones`

4. **Crear Adaptadores (Input)**
   - `ReporteController` con endpoints CRUD
   - `ReporteRequest`, `ReporteResponse` DTOs

5. **Crear Adaptadores (Output - JPA)**
   - `RepositorioReporteJPA` (Spring Data)
   - `ReporteEntity`
   - Especificaciones/Predicados para búsquedas avanzadas

6. **Crear Adaptadores (Output - Externos)**
   - `AdaptadorS3Almacenamiento` (implementar `ServicioAlmacenamiento`)
   - `AdaptadorGoogleGeocoding` (implementar `ServicioGeocoding`)
   - `AdaptadorNotificacionesFirebase` (stub inicialmente)

7. **Crear Servicios de Aplicación**
   - `CrearReporteUseCase`
   - `ObtenerReporteUseCase`
   - `ListarReportesUseCase`
   - `BuscarReportesUseCase`
   - `ActualizarReporteUseCase`
   - `MarcarReporteResueltoUseCase`

8. **Configuración y Validación**
   - Configurar Spring Data JPA
   - Configurar properties (S3, Google API keys, etc.)
   - Validadores de entrada en Controller

### Frontend (Next.js)

9. **Crear tipos TypeScript**
   - `Reporte`, `Foto`, `Ubicacion`, `DatosContacto`, `ReporteFormData`

10. **Crear servicio API**
    - `reporteService.ts` con funciones:
      - `crearReporte(formData: FormData): Promise<Reporte>`
      - `obtenerReporte(id: string): Promise<Reporte>`
      - `listarReportes(filtros): Promise<Page<Reporte>>`
      - `buscarReportes(query): Promise<Page<Reporte>>`
      - `actualizarReporte(id, datos): Promise<Reporte>`
      - `marcarResuelto(id, comentario): Promise<Reporte>`

11. **Crear hook custom**
    - `useReportes` - encapsula lógica de fetch/caché
    - `useReporteForm` - maneja estado del formulario

12. **Crear componentes**
    - `PhotoUpload` - carga de archivos con preview
    - `LocationPicker` - selector de mapa
    - `ReportForm` - formulario multi-paso
    - `ReportCard` - tarjeta en feed
    - `ReportDetail` - vista completa
    - `ReportFilters` - panel de filtros

13. **Crear páginas**
    - `/reportes` - Feed
    - `/reportes/[id]` - Detalle
    - `/reportes/crear` - Crear
    - `/reportes/editar/[id]` - Editar

14. **Integración de Mapa**
    - Instalar librería (Google Maps / Mapbox / Leaflet)
    - Crear componente `ReportMap`
    - Sincronizar marcadores con estado

15. **Pruebas e Integración**
    - Test unitarios de servicios
    - Test E2E del formulario
    - Validar upload de fotos
    - Validar geolocalización

---

## Notas Técnicas Importantes

- **Fotos**: Usar multipart/form-data. Comprimir antes de guardar en S3 usando `ImageMagick` o `LibreCompress`
- **Validación**: Validar coordenadas dentro de buffer de 5km de Santa Marta (11.2456, -74.1988)
- **Teléfono**: Almacenar en formato E.164 (+573101234567)
- **Búsqueda**: Implementar Full-Text Search o usar LIKE con índices
- **Paginación**: Spring Data proporciona Page, Pageable
- **Cache**: Considerar Redis para reportes recientes (TTL 5 min)
