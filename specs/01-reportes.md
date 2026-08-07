# Spec: Sistema de Reportes de Mascotas Perdidas y Encontradas

## Descripción Funcional

El módulo de Reportes permite a los usuarios crear un reporte de una mascota (perro o gato) que está perdida o que fue encontrada. El proceso es guiado paso a paso en un formulario con 5 etapas, asegurando que se recopilen todos los datos necesarios para facilitar el reencuentro entre mascota y dueño.

Cada reporte se publica en el feed de la aplicación y es visible para toda la comunidad. El reporte contiene información clara y accesible sobre la mascota, su ubicación, y los datos de contacto del publicador.

---

## Entidades Involucradas

### Reporte
- **ID** (UUID): Identificador único
- **Tipo de Animal**: Enum (PERRO, GATO)
- **Estado**: Enum (PERDIDO, ENCONTRADO)
- **Fotos**: Array de URLs (mín. 1, máx. 5 imágenes, máx 5MB cada una)
- **Ubicación**:
  - Latitud (decimal)
  - Longitud (decimal)
  - Dirección (texto libre)
  - Barrio/Zona (referencial, extraído de coordenadas o ingresado manualmente)
- **Color**: Texto descriptivo (ej: "Negro", "Blanco con manchas marrones")
- **Raza**: Texto opcional (ej: "Labrador", "Criollo")
- **Tamaño**: Enum (PEQUEÑO, MEDIANO, GRANDE)
- **Sexo**: Enum (MACHO, HEMBRA, DESCONOCIDO)
- **Señas Particulares**: Texto (ej: "Collar rojo, cicatriz en la oreja izquierda")
- **Descripción Adicional**: Texto largo (máx 1000 caracteres)
- **Fecha del Avistamiento**: Datetime (cuándo fue visto por última vez / encontrado)
- **Datos de Contacto del Publicador**:
  - Nombre (texto)
  - Teléfono (número, incluyendo código de país para WhatsApp)
  - Email (opcional)
  - Perfil de usuario (si existe)
- **Fecha de Creación**: Timestamp
- **Estado del Reporte**: Enum (ACTIVO, RESUELTO, ARCHIVADO)
- **Cantidad de Comentarios**: Contador
- **Cantidad de Coincidencias Sugeridas**: Contador

---

## Reglas de Negocio

1. **Validación de Foto**:
   - Obligatoria al menos 1 foto
   - Máximo 5 fotos por reporte
   - Cada foto no debe exceder 5MB
   - Formatos permitidos: JPG, PNG, WebP
   - Las fotos se comprimen automáticamente antes de almacenar

2. **Ubicación**:
   - Obligatoria latitud y longitud (deben ser coordenadas válidas dentro de Santa Marta)
   - La dirección es opcional pero recomendada (texto descriptivo)
   - El sistema puede geocodificar la dirección si es proporcionada
   - Se valida que las coordenadas estén dentro de un rango geográfico permitido (Santa Marta + buffer de 5km)

3. **Datos Requeridos por Tipo de Reporte**:
   - **Siempre obligatorios**: Tipo animal, estado, foto, ubicación (lat/lng), color, sexo, tamaño, descripción
   - **Opcionales**: Raza, email

4. **Ciclo de Vida del Reporte**:
   - Se crea en estado ACTIVO
   - El publicador puede marcar como RESUELTO (mascota encontrada/reencontrada)
   - Un reporte RESUELTO permanece visible pero con indicador visual diferente
   - Los reportes ARCHIVADOS no aparecen en búsquedas por defecto (pero pueden consultarse)

5. **Cambios de Estado**:
   - Solo el publicador del reporte puede cambiar su estado
   - Al resolver un reporte, se puede agregar un comentario final (ej: "¡Se reunió con su dueño!")

---

## Criterios de Aceptación

### CA1: Crear un Reporte Nuevo
- [ ] El usuario accede al formulario "Crear Reporte"
- [ ] El formulario presenta 5 pasos claramente diferenciados
- [ ] **Paso 1**: Usuario selecciona "Perdido" o "Encontrado" (botones grandes, visibles)
- [ ] **Paso 2**: Usuario carga mínimo 1 foto y máximo 5
  - Se valida tamaño (máx 5MB)
  - Se muestra preview de foto(s) antes de enviar
- [ ] **Paso 3**: Usuario ingresa ubicación
  - Se puede seleccionar en mapa interactivo (click en mapa)
  - Se puede buscar dirección (geocodificación)
  - Debe mostrar pin de ubicación confirmada
- [ ] **Paso 4**: Usuario completa detalles del animal
  - Tipo (dropdown: Perro, Gato)
  - Color (campo texto)
  - Raza (campo texto, opcional)
  - Sexo (dropdown o radio buttons)
  - Tamaño (dropdown: Pequeño, Mediano, Grande)
  - Señas particulares (campo texto)
- [ ] **Paso 5**: Usuario completa descripción libre
  - Descripción adicional (textarea)
  - Datos de contacto: Nombre (obligatorio), teléfono (obligatorio con código de país), email (opcional)
- [ ] Usuario hace clic en "Publicar Reporte"
- [ ] Sistema valida todos los datos
- [ ] Si hay errores, se muestran mensajes claros en rojo
- [ ] Si es válido, se crea el reporte y se muestra confirmación
- [ ] Usuario es redirigido al detalle del reporte o al feed

### CA2: Visibilidad del Reporte Recién Creado
- [ ] El reporte aparece en el feed dentro de 5 segundos
- [ ] Se muestra en el mapa (pin con color según estado)
- [ ] El nombre del publicador es visible pero el teléfono es privado (solo visible en detalle)

### CA3: Edición de Reporte
- [ ] Solo el publicador puede editar su reporte
- [ ] Puede cambiar: descripción, señas, foto(s), marcar como resuelto
- [ ] No puede cambiar: tipo de animal, estado (perdido/encontrado), ubicación (protección contra spam)
- [ ] Al editar, se registra un timestamp de "Última actualización"

### CA4: Cambiar Estado a Resuelto
- [ ] El publicador puede marcar el reporte como "RESUELTO"
- [ ] Se muestra un modal pidiendo confirmación
- [ ] Opcionalmente, puede dejar un comentario de resolución (ej: "¡Encontrado!")
- [ ] El reporte se sigue mostrando en el feed pero con indicador visual (ej: badge "Resuelto")
- [ ] Se envía notificación a todos los usuarios que comentaron el reporte

### CA5: Validación de Datos
- [ ] Foto: validar MIME type, tamaño, formato
- [ ] Ubicación: validar que lat/lng estén en rango válido (Santa Marta)
- [ ] Teléfono: validar formato internacional (ej: +57 310 1234567)
- [ ] Email: validar formato si se proporciona
- [ ] Descripción: máx 1000 caracteres
- [ ] Campos vacíos: mostrar errores específicos

---

## Notas Técnicas

- Las fotos deben comprimirse antes de almacenar (ej: usar LibreCompress, TinyPNG API o similar)
- Se recomienda usar Flyway para crear la tabla de reportes
- Los reportes deben indexarse por estado, fecha_creación, ubicación para búsquedas rápidas
- El teléfono debe almacenarse en formato E.164 (ej: +573101234567) para garantizar compatibilidad con WhatsApp
