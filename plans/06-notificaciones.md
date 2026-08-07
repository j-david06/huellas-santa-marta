# Plan: Centro de Notificaciones y Alertas

## 1. Dominio (Backend)

### Entidades
```
Notificacion (Aggregate Root)
├── id: UUID
├── usuarioDestinoId: UUID
├── tipo: NotificationType (COINCIDENCIA, REPORTE_EN_ZONA, COMENTARIO, REPORTE_RESUELTO, ALERTA_PERSONALIZADA)
├── titulo: String
├── descripcion: String
├── urlAccion: String
├── imagenUrl: String (optional)
├── leida: Boolean
├── createdAt: LocalDateTime
├── readAt: LocalDateTime (nullable)
├── expiresAt: LocalDateTime
└── metadata: JSON (contexto extra)

PreferenciasNotificacion (Aggregate Root)
├── id: UUID
├── usuarioId: UUID
├── activas: Boolean
├── coincidencias: Boolean
├── comentarios: Boolean
├── zonaReportes: Boolean
├── reportesResueltos: Boolean
├── zonaInteres: Coordenada (lat, lng, radio_km)
├── horarioSilencio: HorarioSilencio
└── updatedAt: LocalDateTime

HorarioSilencio
├── activo: Boolean
├── desde: LocalTime (ej: 22:00)
└── hasta: LocalTime (ej: 08:00)
```

### Value Objects
```
NotificationType
├── COINCIDENCIA_ENCONTRADA
├── REPORTE_EN_ZONA
├── COMENTARIO_EN_REPORTE
├── REPORTE_RESUELTO
└── ALERTA_PERSONALIZADA

Coordenada
├── latitud: Double
├── longitud: Double
└── radioKm: Integer

EstadoNotificacion
├── ENVIADA
├── LEIDA
├── ARCHIVADA
└── ELIMINADA
```

### Excepciones de Dominio
- `NotificacionNoEncontradaException`
- `PreferenciaNoEncontradaException`
- `UsuarioNoAutorizadoException`

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases)

#### NotificacionPort
```
crearNotificacion(comando: CrearNotificacionCommand): NotificacionId
obtenerNotificacionesDelUsuario(usuarioId: UserId, paginable: Pageable): Page<Notificacion>
marcarComoLeida(notificacionId: NotificacionId): Notificacion
marcarTodasComoLeidas(usuarioId: UserId): void
obtenerNoLeidas(usuarioId: UserId): Integer
eliminarNotificacion(notificacionId: NotificacionId): void
```

#### PreferenciaPort
```
obtenerPreferencias(usuarioId: UserId): PreferenciasNotificacion
actualizarPreferencias(usuarioId: UserId, comando: ActualizarPrefCommand): PreferenciasNotificacion
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioNotificacion (JPA)
```
save(notificacion: Notificacion): Notificacion
findById(id: NotificacionId): Optional<Notificacion>
findByUsuarioId(usuarioId: UserId, pageable: Pageable): Page<Notificacion>
findUnreadByUsuarioId(usuarioId: UserId): Integer
deleteLogical(id: NotificacionId): void
deleteByExpiresAtBefore(fecha: LocalDateTime): Integer (cleanup job)
```

#### RepositorioPreferencias (JPA)
```
save(preferencias: PreferenciasNotificacion): PreferenciasNotificacion
findByUsuarioId(usuarioId: UserId): Optional<PreferenciasNotificacion>
```

#### RepositorioUsuario (JPA)
```
findById(usuarioId: UserId): Optional<Usuario>
```

#### ServicioPushNotification
```
enviarNotificacion(usuarioId: UserId, notificacion: Notificacion): void
enviarALotes(usuariosIds: List<UserId>, notificacion: Notificacion): void
```

#### ServicioGeolocalizacion
```
estaEnZona(usuarioLat: Double, usuarioLng: Double, zonaLat: Double, zonaLng: Double, radioKm: Integer): Boolean
```

#### ServicioPlanificacion
```
eliminarNotificacionesAntiguas(): void (scheduled)
```

### Adaptadores (Input)
- `NotificacionController` (REST)
- `PreferenciaController` (REST)

### Adaptadores (Output)
- `RepositorioNotificacionJPA` (Spring Data)
- `RepositorioPreferenciasJPA` (Spring Data)
- `AdaptadorFirebaseCloudMessaging` (FCM)
- `AdaptadorApplePushNotification` (APN, opcional)
- `ScheduledCleanupJob` (Quartz/Scheduler)
- `WebSocketNotificationHandler` (SSE, opcional)

---

## 3. Endpoints REST

### Obtener Notificaciones del Usuario
```
GET /api/v1/notificaciones?page=0&size=20

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "tipo": "COINCIDENCIA_ENCONTRADA",
      "titulo": "¡Posible coincidencia encontrada para tu reporte!",
      "descripcion": "Revisa la información, alguien pudo haber encontrado a tu mascota.",
      "urlAccion": "/reportes/...",
      "imagenUrl": "https://...",
      "leida": false,
      "createdAt": "2024-08-07T14:00:00Z",
      "readAt": null
    }
  ],
  "totalElements": 15,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### Obtener Contador de No Leídas
```
GET /api/v1/notificaciones/sin-leer/cantidad

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "cantidad": 3
}
```

### Marcar como Leída
```
POST /api/v1/notificaciones/{notificacionId}/marcar-leida

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "id": "...",
  "leida": true,
  "readAt": "2024-08-07T14:05:00Z"
}
```

### Marcar Todas como Leídas
```
POST /api/v1/notificaciones/marcar-todas-leidas

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "actualizadas": 3
}
```

### Eliminar Notificación
```
DELETE /api/v1/notificaciones/{notificacionId}

Headers:
  Authorization: Bearer {token}

Response 204: (sin contenido)
```

### Obtener Preferencias
```
GET /api/v1/preferencias-notificacion

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "id": "...",
  "activas": true,
  "coincidencias": true,
  "comentarios": true,
  "zonaReportes": true,
  "reportesResueltos": true,
  "zonaInteres": {
    "latitud": 11.2456,
    "longitud": -74.1988,
    "radioKm": 5
  },
  "horarioSilencio": {
    "activo": true,
    "desde": "22:00",
    "hasta": "08:00"
  }
}
```

### Actualizar Preferencias
```
PATCH /api/v1/preferencias-notificacion

Headers:
  Authorization: Bearer {token}

Body:
{
  "activas": true,
  "coincidencias": true,
  "comentarios": false,
  "zonaReportes": true,
  "reportesResueltos": true,
  "zonaInteres": {
    "latitud": 11.2700,
    "longitud": -74.2000,
    "radioKm": 3
  },
  "horarioSilencio": {
    "activo": true,
    "desde": "22:00",
    "hasta": "08:00"
  }
}

Response 200: (preferencias actualizadas)
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── app/
│   ├── notificaciones/
│   │   └── page.tsx                    (Centro de notificaciones)
│
├── components/
│   ├── notificaciones/
│   │   ├── NotificacionesList.tsx      (Lista principal)
│   │   ├── NotificacionCard.tsx        (Tarjeta individual)
│   │   ├── NotificacionBadge.tsx       (Badge en campana)
│   │   ├── PreferenciasPanel.tsx       (Panel de configuración)
│   │   └── ZonaInteresMap.tsx          (Mapa selector zona)
│
├── hooks/
│   ├── useNotificaciones.ts            (Fetch notificaciones)
│   ├── usePreferencias.ts              (Fetch/actualizar preferencias)
│   └── useNotificacionesRealtime.ts    (Actualizaciones en tiempo real)
│
├── services/
│   └── notificacionService.ts          (API calls)
│
└── types/
    └── notificacion.ts                 (tipos notificación)
```

### Componentes Principales

#### NotificacionesList.tsx
```typescript
Props:
  - (usa hook useNotificaciones)

State:
  - notificaciones: Notificacion[]
  - isLoading: boolean
  - page: number
  - hasMore: boolean

Renders:
  - Lista de NotificacionCard
  - Botón "Marcar todas como leídas"
  - Botón "Cargar más"
  - Mensaje vacío si no hay

Behavior:
  - Al abrir página, marcar todas como leídas
  - Paginación infinita
  - Actualización real-time (WebSocket o polling)
```

#### NotificacionCard.tsx
```typescript
Props:
  - notificacion: Notificacion
  - onDelete: (id: string) => void
  - onClick: () => void

Renders:
  - Icono según tipo (check, warning, chat)
  - Título + descripción
  - Timestamp relativo
  - Badge "nuevo" si no leída
  - Borde izquierdo coloreado
  - Botón eliminar (•••)

Styling:
  - Fondo blanco si no leída
  - Fondo gris si leída
  - Borde izquierdo: teal (coincidencia), rojo (alerta), etc.
```

#### NotificacionBadge.tsx
```typescript
Props:
  - cantidad: number

Renders:
  - Badge rojo en icono de campana
  - Número de notificaciones no leídas
  - Desaparece si cantidad = 0
```

#### PreferenciasPanel.tsx
```typescript
Props:
  - preferencias: PreferenciasNotificacion
  - onActualizar: (nuevas: PreferenciasNotificacion) => void

Renders:
  - Sección: Notificaciones globales (toggle)
  - Sección: Por tipo (checkboxes)
  - Sección: Zona de interés (mapa)
  - Sección: Horario de silencio (inputs de hora)
  - Botón "Guardar cambios" (auto-save)

Behavior:
  - Cambios se guardan automáticamente
  - Toast de confirmación
```

#### ZonaInteresMap.tsx
```typescript
Props:
  - coordenada: { lat: number; lng: number }
  - radio: number
  - onChange: (nuevaCoordenada, nuevoRadio) => void

Behavior:
  - Mapa interactivo
  - Click para marcar punto
  - Círculo de radio ajustable
  - Input de búsqueda de dirección
  - Slider para ajustar radio (1-50 km)
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear Migration Flyway**
   - `V7__create_notificaciones_table.sql`
   - Campos: id, usuario_id, tipo, titulo, descripcion, url_accion, imagen_url, leida, created_at, read_at, expires_at, metadata (JSON)
   - Índices: usuario_id, leida, created_at
   - `V8__create_preferencias_notificacion_table.sql`
   - Campos: id, usuario_id, activas, coincidencias, comentarios, zona_reportes, reportes_resueltos, zona_lat, zona_lng, zona_radio_km, horario_silencio_desde, horario_silencio_hasta, updated_at
   - Índice único en usuario_id

2. **Crear Dominio**
   - Entidad `Notificacion`
   - Entidad `PreferenciasNotificacion`
   - Value Objects: `NotificationType`, `Coordenada`, `HorarioSilencio`
   - Excepciones

3. **Crear RepositorioNotificacion**
   - JPA con búsquedas por usuario, estado leída, expiración

4. **Crear RepositorioPreferencias**
   - JPA con findByUsuarioId

5. **Crear NotificacionUseCase**
   - `CrearNotificacionUseCase`
   - `ObtenerNotificacionesUseCase`
   - `MarcarComoLeidaUseCase`
   - `MarcarTodasComoLeidasUseCase`
   - `EliminarNotificacionUseCase`
   - `ObtenerNoLeidasUseCase`

6. **Crear PreferenciaUseCase**
   - `ObtenerPreferenciasUseCase`
   - `ActualizarPreferenciasUseCase`
   - Crear preferencias default al registrar usuario

7. **Crear ServicioPushNotification**
   - Integrar Firebase Cloud Messaging (FCM)
   - Manejo de tokens dispositivos
   - Envío de push notifications

8. **Crear Background Job**
   - `ScheduledCleanupJob`: eliminar notificaciones con expires_at < ahora, cada 24h

9. **Crear Controllers**
   - `NotificacionController`
   - `PreferenciaController`

10. **Crear DTOs**
    - `NotificacionResponse`, `NotificacionListResponse`
    - `PreferenciasResponse`, `PreferenciasUpdateRequest`

11. **Integración de Notificaciones**
    - Llamadas desde otros módulos:
      - `CrearReporteUseCase` → notificar en zona de interés
      - `MatchingUseCase` → notificar coincidencia
      - `ComentarioUseCase` → notificar comentario
      - `ReporteResueltoUseCase` → notificar quienes comentaron

### Frontend (Next.js)

12. **Crear tipos TypeScript**
    - `Notificacion`, `PreferenciasNotificacion`, `NotificationType`

13. **Crear servicio de notificaciones**
    - `notificacionService.ts`:
      - `obtenerNotificaciones(page): Promise<Page<Notificacion>>`
      - `marcarComoLeida(id): Promise<void>`
      - `marcarTodasComoLeidas(): Promise<void>`
      - `eliminarNotificacion(id): Promise<void>`
      - `obtenerNoLeidas(): Promise<number>`
      - `obtenerPreferencias(): Promise<PreferenciasNotificacion>`
      - `actualizarPreferencias(prefs): Promise<PreferenciasNotificacion>`

14. **Crear hooks**
    - `useNotificaciones` - fetch + paginación
    - `usePreferencias` - fetch preferencias
    - `useNotificacionesRealtime` - WebSocket o polling

15. **Crear componentes**
    - `NotificacionesList` - página principal
    - `NotificacionCard` - tarjeta individual
    - `NotificacionBadge` - badge en campana
    - `PreferenciasPanel` - panel de configuración
    - `ZonaInteresMap` - selector de zona

16. **Crear página /notificaciones**
    - Layout: header + contenido
    - Tabs: Notificaciones | Preferencias
    - Sincronizar badge con contador

17. **Integración de Badge en Navegación**
    - Mostrar `NotificacionBadge` en icono de campana
    - Actualizar en tiempo real

18. **Push Notifications Frontend**
    - Registrar service worker para FCM
    - Pedir permisos al usuario
    - Abrir app cuando hace clic en push

19. **Notificaciones en Tiempo Real**
    - WebSocket o Server-Sent Events (SSE)
    - Actualizar lista sin recargar
    - Actualizar badge

20. **Pruebas**
    - Test CRUD notificaciones
    - Test preferencias
    - Test filtrado por tipo
    - Test cleanup automático
    - Test push notifications

---

## Notas Técnicas Importantes

- **Firebase Cloud Messaging (FCM)**:
  - Registrar tokens de dispositivos
  - Envío de push con payload
  - Manejo de tokens expirados

- **Horario de Silencio**:
  - Validar en backend antes de enviar push
  - Guardar notificación igual, pero no enviar push
  - Usar zona horaria del usuario

- **Zona de Interés**:
  - Usar Haversine distance para validar
  - Default: 5 km desde ubicación actual

- **TTL de Notificaciones**:
  - Guardar 30 días (configurable)
  - Background job elimina diariamente

- **Performance**:
  - Índices en: usuario_id, leida, created_at
  - Paginación de 20 notificaciones
  - Caché de preferencias en Redis

- **Seguridad**:
  - Validar autorización (solo ver propias)
  - Sanitizar URLs
  - Validar geolocalizaciones

- **Analytics**:
  - Registrar tasa de lectura
  - Registrar clicks en notificaciones
  - Usar para mejorar tipos de alertas
