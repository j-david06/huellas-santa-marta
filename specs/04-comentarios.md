# Spec: Sistema de Comentarios y Pistas de la Comunidad

## Descripción Funcional

El módulo de Comentarios permite a la comunidad compartir información, pistas y observaciones sobre los reportes de mascotas. Cada reporte tiene una sección "Pistas de la Comunidad" donde usuarios registrados pueden comentar con información potencialmente útil para el publicador (ej: "Vi un perro similar en el parque hace 2 horas").

Los comentarios son públicos, cronológicamente ordenados (más recientes primero) y permiten que el publicador del reporte responda directamente.

---

## Entidades Involucradas

### Comentario
- **ID**: UUID (identificador único)
- **ID del Reporte**: UUID (referencia al reporte)
- **Autor**: Usuario (nombre, avatar iniciales, ID)
- **Contenido**: Texto (máx 500 caracteres)
- **Timestamp**: Fecha y hora de creación
- **Likes/Votos Útiles**: Contador (opcional en fase inicial)
- **Es Respuesta del Publicador**: Boolean (si el autor es el publicador del reporte)

### Usuario
- **ID**: UUID
- **Nombre**: Texto (visible públicamente)
- **Avatar**: Color y iniciales (generado desde nombre)
- **Email**: Privado (no visible en comentarios)
- **Teléfono**: Privado (no visible en comentarios)

---

## Reglas de Negocio

1. **Permiso para Comentar**:
   - Solo usuarios autenticados pueden comentar
   - Un usuario no puede comentar en su propio reporte (previene spam)
   - Se puede comentar en reportes ACTIVOS y RESUELTOS

2. **Moderación de Contenido**:
   - Los comentarios se publican inmediatamente (sin moderación previa)
   - Sistema de reportes de contenido inapropiado (flag) que notifica a admins
   - Los comentarios que contengan números de teléfono se censorean (reemplazo automático por *)
   - Se filtra automaticamente lenguaje ofensivo (lista de palabras prohibidas)

3. **Visibilidad**:
   - Todos los comentarios son públicos
   - Se ordenan por fecha: más recientes primero
   - Se muestran máximo 5 comentarios iniciales (load more / paginación)
   - Los comentarios del publicador se destacan visualmente (ej: background diferente, ícono de autor)

4. **Notificaciones**:
   - El publicador del reporte recibe notificación push cuando alguien comenta
   - Los que comentaron reciben notificación si el publicador responde
   - Las notificaciones incluyen preview del comentario (primeros 50 caracteres)

5. **Edición y Eliminación**:
   - Un usuario puede editar su comentario dentro de 1 hora de haber sido publicado
   - Un usuario puede eliminar su comentario en cualquier momento
   - Un admin puede eliminar comentarios que violen políticas
   - Al eliminar, se reemplaza con "[Comentario eliminado por el autor]"

6. **Privacidad de Datos**:
   - Los comentarios no incluyen email ni teléfono del usuario
   - Solo se muestra nombre y avatar
   - El publicador del reporte no puede ver el email/teléfono de quien comenta

---

## Criterios de Aceptación

### CA1: Visualizar Sección de Comentarios
- [ ] La sección "Pistas de la Comunidad" es visible en la vista de detalle del reporte
- [ ] Se muestra un ícono de chat/comentario y título
- [ ] Está posicionada en la parte inferior del reporte (o en columna derecha en desktop)

### CA2: Input de Comentario
- [ ] Campo de texto con placeholder: "¿Tienes información?"
- [ ] Botón "Enviar" (ícono de avión o check) al lado del input
- [ ] El botón está deshabilitado si el campo está vacío
- [ ] Max 500 caracteres (contador visible)
- [ ] Si el usuario no está autenticado, muestra: "Inicia sesión para comentar"

### CA3: Enviar Comentario
- [ ] Usuario escribe un comentario y hace clic en "Enviar"
- [ ] Se valida que no esté vacío
- [ ] Se valida que el usuario no sea el publicador del reporte
- [ ] Comentario se publica inmediatamente (optimistic UI)
- [ ] Aparece en la lista con avatar, nombre del usuario, timestamp "Justo ahora"
- [ ] Input se limpia y está listo para otro comentario

### CA4: Listar Comentarios
- [ ] Se muestran los comentarios ordenados: más recientes primero
- [ ] Cada comentario muestra:
  - Avatar (iniciales del usuario en color pastel)
  - Nombre del usuario
  - Timestamp en formato relativo (Hace 5 min, Hace 1 hora, Ayer, etc)
  - Contenido del comentario (texto)
- [ ] Max 5 comentarios inicialmente visibles
- [ ] Botón o enlace "Cargar más comentarios" para ver el resto
- [ ] Si hay 0 comentarios, muestra: "Sin pistas aún. ¡Sé el primero en compartir!"

### CA5: Comentario del Publicador
- [ ] Si el autor es el publicador del reporte, se destaca visualmente (ej: background leve, ícono de check)
- [ ] Texto o badge: "Propietario del reporte" o similar
- [ ] El comentario del publicador tiene prioridad visual (más prominente)

### CA6: Editar Comentario
- [ ] Usuario hace clic en menú de opciones (•••) en su comentario
- [ ] Opción "Editar" disponible solo para el autor
- [ ] Se abre inline editor con el texto actual
- [ ] Usuario edita y hace clic en "Guardar"
- [ ] El comentario se actualiza
- [ ] Se muestra "(editado)" al lado del timestamp
- [ ] Edición solo es posible dentro de 1 hora

### CA7: Eliminar Comentario
- [ ] Usuario hace clic en menú de opciones en su comentario
- [ ] Opción "Eliminar" muestra confirmación: "¿Eliminar este comentario?"
- [ ] Al confirmar, se reemplaza el contenido con "[Comentario eliminado por el autor]"
- [ ] El avatar y nombre permanecen visibles

### CA8: Notificaciones
- [ ] El publicador recibe notificación push cuando alguien comenta (en tiempo real)
- [ ] La notificación incluye: nombre del usuario, preview del comentario
- [ ] El publicador puede deshabilitar notificaciones de comentarios en configuración

### CA9: Validación de Contenido
- [ ] Si el comentario contiene un patrón de teléfono (ej: 310 123 4567), se censura automáticamente
- [ ] Si contiene lenguaje ofensivo, se muestra popup: "Por favor, usa un lenguaje respetuoso"
- [ ] Números de teléfono se reemplazan con: "###-###-####"

### CA10: Responsividad
- [ ] En mobile, el input está pegado en la parte inferior (fixed)
- [ ] Los comentarios se adaptan al ancho de pantalla
- [ ] Avatares y text se escalan correctamente

---

## Notas Técnicas

- Usar autenticación JWT o sesión para validar que usuario está loggeado
- Guardar comentarios en tabla: `comentarios` con campos: id, reporte_id, usuario_id, contenido, created_at, updated_at, deleted_at
- Implementar soft delete (usar deleted_at para marcar como eliminado)
- Usar índices en: reporte_id, usuario_id para búsquedas rápidas
- Implementar WebSocket o Server-Sent Events (SSE) para notificaciones en tiempo real
- Usar librería como `DOMPurify` para sanitizar HTML y prevenir XSS
- Regex para detectar teléfonos: `\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b` o similar
