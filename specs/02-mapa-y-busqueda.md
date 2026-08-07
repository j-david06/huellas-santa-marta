# Spec: Mapa Interactivo y Sistema de Búsqueda

## Descripción Funcional

El módulo de Mapa y Búsqueda proporciona una forma intuitiva para que los usuarios descubran reportes de mascotas perdidas y encontradas cerca de su ubicación o en zonas de interés. Incluye un mapa interactivo de Santa Marta con marcadores de reportes, así como herramientas de búsqueda por texto y filtros avanzados.

El feed (lista de reportes en tarjetas) puede alternarse con la vista de mapa, permitiendo al usuario cambiar entre una experiencia enfocada en descubrimiento visual (mapa) y una lista legible (feed).

---

## Entidades Involucradas

### Mapa
- **Centro inicial**: Coordenadas de Santa Marta (11.2456° N, 74.1988° O)
- **Zoom inicial**: 13 (escala que muestra la ciudad completa)
- **Zoom máximo**: 18
- **Zoom mínimo**: 11

### Marcador (Pin)
- **Ubicación**: Latitud, Longitud del reporte
- **Color**: 
  - Tierra-cota (primario) si estado = PERDIDO
  - Azul teal (secundario) si estado = ENCONTRADO
- **Icono**: Ícono de mascota (perro o gato según tipo)
- **Estado Activo**: Pulsa (animación de expansión/contracción) si el reporte es < 1 hora antiguo
- **Al hacer clic**: Abre popup con resumen del reporte (nombre, ubicación, tiempo, CTA a detalle)

### Búsqueda
- **Tipo**: Búsqueda de texto libre (debounce de 300ms)
- **Campos indexados**: Raza, Color, Barrio/Zona, Nombre de mascota, Descripción

### Filtros
- **Tipo de Animal**: Perro, Gato (checkbox o toggle)
- **Estado**: Perdido, Encontrado (checkbox o toggle)
- **Color**: Dropdown con colores comunes (Negro, Blanco, Marrón, Gris, Mixto, Otro)
- **Zona/Barrio**: Dropdown o selector multi-opción (Centro Histórico, El Rodadero, Minca, Taganga, etc.)
- **Rango de Fechas**: Últimas 24h, Última semana, Último mes, Cualquier tiempo (preset buttons)
- **Distancia**: Slider: "Mostrar dentro de X km" (rango 1-50 km desde ubicación actual)

---

## Reglas de Negocio

1. **Carga Inicial de Mapa**:
   - Se cargan reportes ACTIVOS de los últimos 30 días
   - Se cargan máximo 100 marcadores en pantalla (si hay más, se agrupa con cluster)
   - Si el usuario tiene ubicación permitida, el mapa se centra en su posición actual

2. **Actualización en Tiempo Real**:
   - El mapa se actualiza cada 30 segundos con nuevos reportes (sin recargar la página)
   - Los marcadores que resuelven desaparecen del mapa automáticamente (o se atenúan si pasan a RESUELTO)

3. **Búsqueda**:
   - La búsqueda es case-insensitive y tolerante con acentos
   - Busca en: nombre de mascota, raza, color, barrio, descripción
   - Los resultados se filtran en el mapa y en el feed simultáneamente
   - Si hay más de 50 resultados, muestra "Refina tu búsqueda"

4. **Filtros**:
   - Todos los filtros son acumulativos (AND lógico)
   - Los filtros se aplican instantáneamente (sin botón "Buscar")
   - Los filtros activos se visualizan como "chips" removibles en la UI

5. **Visibilidad de Reportes**:
   - Se muestran reportes ACTIVOS y RESUELTOS
   - Los reportes ARCHIVADOS no aparecen (a menos que el usuario sea el publicador)
   - Se ordena por defecto: fecha más reciente primero

---

## Criterios de Aceptación

### CA1: Visualizar Mapa Interactivo
- [ ] El mapa carga centrado en Santa Marta (lat 11.2456, lng -74.1988)
- [ ] El nivel de zoom inicial permite ver toda la ciudad
- [ ] Los marcadores de reportes son visibles con los colores correctos (Perdido = tierra-cota, Encontrado = teal)
- [ ] Los marcadores < 1 hora tienen animación de pulso
- [ ] El usuario puede hacer zoom in/out con scroll o botones
- [ ] El usuario puede arrastrar/desplazar el mapa

### CA2: Interacción con Marcadores
- [ ] Al hacer clic en un marcador, se abre un popup con:
  - Foto miniatura de la mascota (si está disponible)
  - Nombre y tipo (Perro/Gato)
  - Ubicación exacta
  - "Hace X minutos/horas"
  - Botón "Ver Detalle" que lleva al reporte completo
- [ ] El popup se cierra al hacer clic fuera de él
- [ ] El usuario puede ver múltiples popups si hace clic en varios marcadores

### CA3: Búsqueda por Texto
- [ ] Campo de búsqueda visible en la parte superior del feed (mobile) o en header (desktop)
- [ ] Mientras escribe, los resultados se filtran en tiempo real (debounce 300ms)
- [ ] La búsqueda es case-insensitive
- [ ] Los caracteres acentuados (é, á, ñ) se ignoran en la búsqueda
- [ ] Si escribe "labrador", encuentra reportes con raza "Labrador"
- [ ] Si escribe "rodadero", encuentra reportes en El Rodadero
- [ ] Si no hay resultados, muestra "No se encontraron mascotas"
- [ ] El usuario puede limpiar la búsqueda con un botón X

### CA4: Filtros Básicos
- [ ] **Tipo de Animal**: Selecciona "Perro" y solo muestra reportes de perros
- [ ] **Estado**: Selecciona "Perdido" y solo muestra reportes perdidos
- [ ] Los filtros se pueden combinar (ej: Perro + Encontrado)
- [ ] Los filtros se visualizan como "chips" removibles

### CA5: Filtro Avanzado - Zona
- [ ] Abre dropdown con opciones: Centro Histórico, El Rodadero, Minca, Taganga, etc.
- [ ] Al seleccionar una zona, se filtra por barrio
- [ ] Se puede seleccionar múltiples zonas (chip separado para cada una)

### CA6: Filtro Avanzado - Rango de Fechas
- [ ] Botones preset: "Última 24h", "Última semana", "Último mes", "Cualquier tiempo"
- [ ] Al seleccionar, se filtran reportes dentro del rango
- [ ] Solo muestra reportes ACTIVOS dentro del rango

### CA7: Filtro Avanzado - Distancia
- [ ] Slider: "Mostrar reportes dentro de X km"
- [ ] Rango: 1 a 50 km (desde la ubicación actual del usuario, si tiene permiso)
- [ ] Se requiere permiso de ubicación del navegador
- [ ] Si no tiene permiso, se muestra checkbox para otorgarlo o usar ubicación manual

### CA8: Sincronización Mapa-Feed
- [ ] Al aplicar filtros, el mapa y el feed se actualizan al mismo tiempo
- [ ] Al búsqueda en el feed, el mapa resalta los marcadores que coinciden
- [ ] Al hacer clic en un marcador en el mapa, el feed se desplaza al reporte correspondiente (en mobile, opcional)

### CA9: Actualización en Tiempo Real
- [ ] Cada 30 segundos, el sistema busca nuevos reportes
- [ ] Los nuevos marcadores se agregan al mapa sin recargar la página
- [ ] Los reportes resueltos se atenúan o desaparecen
- [ ] No hay parpadeo en los marcadores existentes

### CA10: Performance
- [ ] El mapa carga en < 2 segundos
- [ ] Filtros se aplican sin delay perceptible (< 500ms)
- [ ] La búsqueda no bloquea la UI

---

## Notas Técnicas

- **Librería de Mapas**: Google Maps API, Mapbox, o Leaflet (con tiles gratuitas)
- **Clustering**: Usar librería como Marker Cluster (Leaflet) o Google Maps Clustering para agrupar marcadores cuando hay muchos
- **Geocodificación Inversa**: Al mostrar ubicación en popup, obtener nombre de calle/barrio usando Google Geocoding API
- **Debounce**: Implementar debounce de 300ms en campo de búsqueda para evitar consultas excesivas
- **Índices Base de Datos**: Crear índices en: ubicación (geoespacial), estado, tipo_animal, fecha_creación, for optimizar búsquedas
