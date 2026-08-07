# Spec: Centro de Notificaciones y Alertas

## Descripción Funcional

El módulo de Notificaciones mantiene a los usuarios informados sobre eventos relevantes en la plataforma: coincidencias de mascotas encontradas, nuevos reportes en zonas de interés, comentarios en sus reportes, y más. 

Los usuarios pueden recibir notificaciones push en tiempo real, además de visualizarlas en el Centro de Notificaciones (página/panel dedicada). Cada notificación es contextualizada, accionable, y permite al usuario navegaro directamente al elemento relevante.

---

## Entidades Involucradas

### Notificación
- **ID**: UUID
- **Usuario Destino**: UUID (quién recibe la notificación)
- **Tipo**: Enum (COINCIDENCIA_ENCONTRADA, REPORTE_EN_ZONA, COMENTARIO_EN_REPORTE, REPORTE_RESUELTO, ALERTA_PERSONALIZADA)
- **Título**: Texto breve (máx 100 caracteres)
- **Descripción**: Texto descriptivo (máx 300 caracteres)
- **URL de Acción**: Link a navegar (ej: `/reportes/[id]`)
- **Imagen Miniatura**: URL de foto relacionada (opcional)
- **Leído**: Boolean
- **Timestamp de Creación**: Fecha y hora
- **Timestamp de Lectura**: Cuándo el usuario vio la notificación (NULL si no leída)
- **Expiración**: TTL (notificaciones antiguas se pueden archivar)

### Preferencias de Notificación del Usuario
- **ID**: UUID
- **Usuario**: UUID
- **Notificaciones Activas**: Boolean
- **Coincidencias**: Boolean
- **Comentarios**: Boolean
- **Nuevos Reportes en Zona**: Boolean
- **Reportes Resueltos**: Boolean
- **Zona de Interés**: Coordenadas (lat/lng) + Radio (km)
- **Horario de Silencio**: Hora inicio y hora fin (ej: 22:00 a 08:00)

---

## Reglas de Negocio

1. **Tipos de Notificaciones**:
   - **Coincidencia Encontrada**: Se dispara cuando se detecta match entre PERDIDO y ENCONTRADO (Score >= 60)
   - **Reporte en Zona de Interés**: Se dispara cuando se publica un reporte cerca de la zona seleccionada por el usuario
   - **Comentario en Mi Reporte**: Se dispara cuando alguien comenta en un reporte del usuario
   - **Reporte Resuelto**: Se dispara cuando el usuario marca su reporte como resuelto (notifica a quienes comentaron)
   - **Alerta Personalizada**: Basada en búsquedas guardadas o características personalizadas

2. **Entrega de Notificaciones**:
   - Se envían vía Push Notification (Firebase Cloud Messaging, Apple Push Notification Service)
   - También se guardan en el Centro de Notificaciones (base de datos)
   - Si el usuario ha habilitado horario de silencio, las notificaciones se guardan pero no se envían push
   - Se respetan las preferencias del usuario (puede desabilitar ciertos tipos)

3. **Zonificación**:
   - El usuario puede marcar una zona de interés (círculo en mapa o dirección)
   - Se almacena como latitud, longitud y radio en km
   - Notificaciones se disparan para reportes dentro de ese radio
   - Por defecto, el radio es 5 km desde la ubicación actual del usuario

4. **Privacidad y Configuración**:
   - Usuario tiene control total sobre qué notificaciones recibe
   - Puede deshabilitar globalmente o por tipo
   - Puede salirse de notificaciones de zonas específicas
   - Un desuscribir debe ser fácil y rápido (sin pasos múltiples)

5. **Retención de Datos**:
   - Las notificaciones se guardan durante 30 días
   - Después de 30 días, se archivan o eliminan
   - El usuario puede eliminar manualmente las notificaciones

6. **Badge en UI**:
   - El ícono de campana en la navegación muestra un badge rojo con el contador de notificaciones no leídas
   - Al abrir el Centro de Notificaciones, se marcan todas como leídas
   - El badge desaparece cuando no hay notificaciones no leídas

---

## Criterios de Aceptación

### CA1: Centro de Notificaciones - Vista General
- [ ] Página accesible desde navegación (ícono de campana)
- [ ] Título: "Centro de Notificaciones"
- [ ] Subtitle: "Mantente al tanto de lo que sucede en tu comunidad"
- [ ] Lista de notificaciones ordenada: más recientes primero
- [ ] Cada notificación muestra:
  - Icono de tipo (check para coincidencia, warning para alerta, chat para comentario)
  - Título de notificación
  - Descripción breve
  - Timestamp relativo (Hace 5 min, Hace 1 hora, Ayer)
  - Indicador de lectura (notificaciones no leídas en bold o destacadas)

### CA2: Tipos de Notificación - Coincidencia Encontrada
- [ ] Icono: Círculo con check (o spark)
- [ ] Título: "¡Posible coincidencia encontrada para tu reporte!"
- [ ] Descripción: "Revisa la información, alguien pudo haber encontrado a tu mascota."
- [ ] Color de borde: Teal/Secundario (success)
- [ ] Al hacer clic, navega al reporte sugerido

### CA3: Tipos de Notificación - Nuevo Reporte en Zona
- [ ] Icono: Warning o exclamación
- [ ] Título: "Nuevo reporte de [tipo] [estado] en tu zona"
- [ ] Descripción: "[Barrio]. Mantén los ojos abiertos."
- [ ] Color de borde: Rojo/Error (urgencia)
- [ ] Al hacer clic, navega al reporte

### CA4: Tipos de Notificación - Comentario en Reporte
- [ ] Icono: Chat bubble
- [ ] Título: "Alguien comentó en tu reporte"
- [ ] Descripción: "[Nombre del usuario]: '[Preview del comentario (50 caracteres)]'"
- [ ] Al hacer clic, navega al reporte con scroll a sección de comentarios

### CA5: Badge de Notificaciones
- [ ] El ícono de campana en navegación muestra un badge rojo
- [ ] El badge contiene el número de notificaciones no leídas
- [ ] El badge desaparece si no hay notificaciones sin leer
- [ ] Se actualiza en tiempo real (cuando llega una nueva notificación)

### CA6: Marcar como Leída
- [ ] Al hacer clic en una notificación, se marca como leída
- [ ] El badge se actualiza
- [ ] El timestamp de lectura se registra
- [ ] La notificación cambia de color/estilo (menos destacada)

### CA7: Eliminar Notificación
- [ ] Cada notificación tiene un ícono de eliminar (X) o menú de opciones
- [ ] Al hacer clic, se elimina la notificación
- [ ] El usuario debe confirmar: "¿Eliminar esta notificación?"
- [ ] La notificación se elimina del Centro inmediatamente

### CA8: Zona de Interés
- [ ] En Configuración, usuario puede establecer zona de interés
- [ ] Muestra un mapa con selector (click para marcar punto, o búsqueda de dirección)
- [ ] Una vez seleccionada, se muestra: "Recibirás alertas de reportes dentro de [X km]"
- [ ] Usuario puede cambiar la zona en cualquier momento
- [ ] Usuario puede deshabilitar temporalmente: checkbox "Desabilitar alertas de zona"

### CA9: Horario de Silencio
- [ ] En Configuración, usuario puede establecer horario de silencio
- [ ] Inputs de hora: "Desde [HH:MM] hasta [HH:MM]"
- [ ] Ejemplo: "Desde 22:00 hasta 08:00"
- [ ] Durante ese horario, las notificaciones se guardan pero NO se envían push
- [ ] Usuario puede deshabilitar: checkbox "No molestar"

### CA10: Preferencias Granulares
- [ ] Checkboxes para cada tipo de notificación:
  - [ ] Coincidencias encontradas
  - [ ] Nuevo reporte en zona
  - [ ] Comentarios en mis reportes
  - [ ] Reportes resueltos
- [ ] Usuario puede activar/desactivar cada uno independientemente
- [ ] Los cambios se guardan automáticamente (sin botón Save)

### CA11: Notificación Push en Tiempo Real
- [ ] Cuando un evento ocurre, se envía notificación push al dispositivo (si la app está minimizada/cerrada)
- [ ] La notificación es informativa, breve y tiene CTA
- [ ] Al hacer clic en la notificación push, abre la app en la página relevante

### CA12: Sin Notificaciones
- [ ] Si el usuario no tiene notificaciones, muestra:
  - Icono de campana vacía
  - Texto: "Sin notificaciones. ¡Disfruta!"

### CA13: Responsividad
- [ ] En mobile, el Centro ocupa toda la pantalla
- [ ] Las notificaciones se adaptan al ancho
- [ ] El badge de campana es visible en navegación móvil

### CA14: Performance
- [ ] El Centro carga las notificaciones en < 2 segundos
- [ ] Paginación / lazy loading si hay más de 20 notificaciones
- [ ] Las actualizaciones en tiempo real no causan lag

---

## Notas Técnicas

- Tabla `notificaciones`: id, usuario_id, tipo, titulo, descripcion, url_accion, imagen_url, leida, created_at, read_at, expires_at
- Tabla `preferencias_notificacion`: usuario_id, activas, coincidencias, comentarios, zona_reportes, reportes_resueltos, zona_interes_lat, zona_interes_lng, zona_radio_km, horario_silencio_inicio, horario_silencio_fin
- Usar Firebase Cloud Messaging (FCM) para push notifications
- Usar índices en: usuario_id, leida, created_at para búsquedas rápidas
- Implementar WebSocket o SSE para actualizar badge en tiempo real
- TTL automático: eliminar notificaciones con más de 30 días vía background job
