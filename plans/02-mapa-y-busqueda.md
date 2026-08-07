# Plan: Mapa Interactivo y Sistema de Búsqueda

## 1. Dominio (Backend)

### Entidades
```
BúsquedaGuardada (opcional para v1)
├── id: UUID
├── usuarioId: UUID
├── tipoAnimal: AnimalType (optional)
├── estado: ReportStatus (optional)
├── color: String (optional)
├── barrio: String (optional)
├── rangoFechas: RangoFechas (optional)
├── radio: Integer (km)
├── nombúsqueda: String
└── fechaCreacion: LocalDateTime

RangoFechas
├── inicio: LocalDateTime
└── fin: LocalDateTime

FiltrosReporte
├── tipoAnimal: AnimalType (optional)
├── estado: ReportStatus (optional)
├── color: String (optional)
├── barrio: String (optional)
├── rangoFechas: RangoFechas (optional)
├── latitud: Double (optional)
├── longitud: Double (optional)
├── radioKm: Integer (optional)
└── textoBusqueda: String (optional)
```

### Value Objects
```
Coordenada
├── latitud: Double
├── longitud: Double
└── radioKm: Integer

ZonasPreDefinidas (Enum)
├── CENTRO_HISTORICO (11.2480, -74.2024)
├── EL_RODADERO (11.2800, -74.2150)
├── MINCA (11.3300, -74.2600)
├── TAGANGA (11.3900, -74.1800)
└── BAHIA_CONCHA (11.3600, -74.1400)
```

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases)

#### BúsquedaPort
```
buscarPorTexto(query: String, filtros: FiltrosReporte, paginacion: Pageable): Page<Reporte>
filtrarReportes(filtros: FiltrosReporte, paginacion: Pageable): Page<Reporte>
obtenerReportesNuevos(desdeTimestamp: LocalDateTime): List<Reporte>
obtenerReportesEnZona(zona: Coordenada): List<Reporte>
```

#### MapaPort
```
obtenerReportesParaMapa(filtros: FiltrosReporte): List<ReporteParaMapa>
obtenerClusteres(filtros: FiltrosReporte, zoom: Integer): List<Cluster>
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioBúsqueda (JPA)
```
buscarPorTexto(query: String, pageable: Pageable): Page<Reporte>
filtrarPorCriterios(filtros: FiltrosReporte, pageable: Pageable): Page<Reporte>
findByLocationWithin(lat: Double, lng: Double, radiusKm: Integer): List<Reporte>
findCreatedAfter(timestamp: LocalDateTime): List<Reporte>
```

#### RepositorioZonas (In-Memory o DB)
```
obtenerZonas(): List<Zona>
obtenerZonaPorNombre(nombre: String): Zona
```

### Adaptadores (Input)
- `BúsquedaController` (REST)

### Adaptadores (Output)
- `RepositorioBúsquedaJPA` (Spring Data)
- `EspecificacionesReporte` (Criteria API para filtros complejos)

---

## 3. Endpoints REST

### Búsqueda por Texto
```
GET /api/v1/reportes/search?q=labrador&page=0&size=20

Query Params:
  q: String (texto libre)
  estado: PERDIDO|ENCONTRADO (optional)
  tipo: PERRO|GATO (optional)
  barrio: String (optional)
  page: Integer
  size: Integer

Response 200:
{
  "content": [
    {
      "id": "...",
      "nombre": "Bruno",
      "tipo": "PERRO",
      "raza": "Labrador",
      "foto": "https://...",
      "ubicacion": { "direccion": "Centro Histórico", "latitud": 11.2456, "longitud": -74.1988 },
      "estado": "PERDIDO",
      "tiempoTranscurrido": "Hace 2 horas"
    }
  ],
  "totalElements": 45,
  "totalPages": 3,
  "size": 20,
  "number": 0,
  "hasNext": true
}
```

### Filtrar Reportes (Advanced)
```
GET /api/v1/reportes?estado=PERDIDO&tipo=PERRO&color=Negro&barrio=Centro%20Histórico&desde=2024-08-01&hasta=2024-08-07&page=0&size=20

Query Params:
  estado: PERDIDO|ENCONTRADO (optional)
  tipo: PERRO|GATO (optional)
  color: String (optional)
  barrio: CENTRO_HISTORICO|EL_RODADERO|MINCA|TAGANGA (optional)
  desde: ISO 8601 date (optional)
  hasta: ISO 8601 date (optional)
  latitud: Double (optional)
  longitud: Double (optional)
  radioKm: Integer (optional)
  page: Integer
  size: Integer

Response 200: (como búsqueda por texto)
```

### Obtener Reportes en Zona
```
GET /api/v1/reportes/ubicacion?latitud=11.2456&longitud=-74.1988&radioKm=5

Query Params:
  latitud: Double
  longitud: Double
  radioKm: Integer (default: 5)

Response 200:
{
  "reportes": [
    {
      "id": "...",
      "nombre": "Bruno",
      "tipo": "PERRO",
      "estado": "PERDIDO",
      "foto": "https://...",
      "ubicacion": { "latitud": 11.2456, "longitud": -74.1988 },
      "tiempoTranscurrido": "Hace 2 horas"
    }
  ],
  "cantidad": 3
}
```

### Obtener Nuevos Reportes (Polling o SSE)
```
GET /api/v1/reportes/nuevos?desde=2024-08-07T10:00:00Z&filtros=...

Query Params:
  desde: ISO 8601 timestamp (último refresco)
  estado: PERDIDO|ENCONTRADO (optional)
  tipo: PERRO|GATO (optional)

Response 200:
{
  "nuevosReportes": [
    { ... }
  ],
  "cantidad": 2
}
```

### Obtener Zonas Predefinidas
```
GET /api/v1/zonas

Response 200:
[
  {
    "id": "CENTRO_HISTORICO",
    "nombre": "Centro Histórico",
    "latitud": 11.2480,
    "longitud": -74.2024,
    "radioDefault": 2
  },
  {
    "id": "EL_RODADERO",
    "nombre": "El Rodadero",
    "latitud": 11.2800,
    "longitud": -74.2150,
    "radioDefault": 2
  },
  ...
]
```

### Obtener Reportes para Mapa (DTO Optimizado)
```
GET /api/v1/reportes/mapa?estado=PERDIDO&tipo=PERRO&zoom=13

Response 200:
{
  "marcadores": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "latitud": 11.2456,
      "longitud": -74.1988,
      "tipoAnimal": "PERRO",
      "estado": "PERDIDO",
      "fotoUrl": "https://...",
      "tiempoTranscurrido": "Hace 2 horas"
    }
  ],
  "clusteres": [
    {
      "latitud": 11.2500,
      "longitud": -74.2000,
      "cantidad": 5,
      "zoom": 13
    }
  ]
}
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── app/
│   ├── inicio/
│   │   └── page.tsx                    (Feed + Mapa)
│
├── components/
│   ├── busqueda/
│   │   ├── SearchBar.tsx               (Input de búsqueda)
│   │   ├── FilterPanel.tsx             (Panel de filtros)
│   │   ├── FilterChips.tsx             (Chips de filtros activos)
│   │   ├── DateRangePicker.tsx         (Selector rango de fechas)
│   │   ├── ZoneSelector.tsx            (Selector de zonas)
│   │   ├── DistanceSlider.tsx          (Slider de distancia)
│   │   └── ResultadosBusqueda.tsx      (Lista de resultados)
│   │
│   ├── mapa/
│   │   ├── MapContainer.tsx            (Contenedor principal del mapa)
│   │   ├── MapMarker.tsx               (Marcador individual)
│   │   ├── MapCluster.tsx              (Grupo de marcadores)
│   │   ├── MapPopup.tsx                (Popup al hacer click)
│   │   └── MapControls.tsx             (Botones de control)
│   │
│   └── feed/
│       ├── ReportList.tsx              (Lista de tarjetas)
│       └── LoadMoreButton.tsx          (Botón "cargar más")
│
├── hooks/
│   ├── useBusqueda.ts                  (Lógica de búsqueda/filtros)
│   ├── useMapState.ts                  (Estado del mapa)
│   ├── useLocationTracking.ts          (Geolocalización)
│   └── useRealtimeUpdates.ts           (Actualizaciones en tiempo real)
│
├── services/
│   ├── busquedaService.ts              (API calls)
│   ├── mapaService.ts                  (API calls específicas mapa)
│   └── pollingService.ts               (Polling para nuevos reportes)
│
├── types/
│   ├── busqueda.ts                     (tipos de búsqueda/filtros)
│   └── mapa.ts                         (tipos de mapa)
│
└── utils/
    ├── filtroUtils.ts                  (utilidades de filtros)
    ├── geoUtils.ts                     (cálculos geoespaciales)
    └── timeUtils.ts                    (formateo de tiempos)
```

### Componentes Principales

#### SearchBar.tsx
```typescript
Props:
  - placeholder: string
  - onSearch: (query: string) => void
  - debounceTime?: number (default: 300ms)
  - onClear?: () => void

State:
  - query: string
  - isSearching: boolean

Behavior:
  - Debounce de 300ms
  - Botón X para limpiar
  - Icon de búsqueda
```

#### FilterPanel.tsx
```typescript
Props:
  - filtros: FiltrosReporte
  - onFiltrosChange: (filtros: FiltrosReporte) => void
  - zonas: Zona[]

Renders:
  - Toggle: Tipo Animal (Perro/Gato)
  - Toggle: Estado (Perdido/Encontrado)
  - Dropdown: Color
  - Dropdown: Barrio (o ZoneSelector)
  - Buttons: Rango de fechas (24h, 1w, 1m, all)
  - Slider: Distancia (1-50 km)

Behavior:
  - Aplica filtros inmediatamente (sin botón Submit)
  - Se visualiza como "chips" removibles
```

#### MapContainer.tsx
```typescript
Props:
  - centro: { lat: number; lng: number }
  - marcadores: ReporteParaMapa[]
  - filtros: FiltrosReporte
  - onMarkerClick: (reporteId: string) => void
  - onMapClick: (lat: number, lng: number) => void

Deps:
  - google-maps-react o leaflet
  - @react-google-maps/api

Features:
  - Zoom/Pan
  - Marcadores con colores (Perdido=terra, Encontrado=teal)
  - Pulso en marcadores < 1h
  - Clustering automático
  - Popups al hacer click
```

#### ResultadosBusqueda.tsx
```typescript
Props:
  - reportes: Reporte[]
  - isLoading: boolean
  - hasMore: boolean
  - onLoadMore: () => void
  - onReporteClick: (id: string) => void

Renders:
  - Lista de ReportCard
  - Mensaje "Sin resultados"
  - Botón "Cargar más"
  - Loading skeleton
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear especificaciones/criterios de búsqueda**
   - `EspecificacionesReporte` usando Criteria API o QueryDSL
   - Métodos para filtrar por: estado, tipo, color, barrio, fecha, ubicación

2. **Extender RepositorioReporte**
   - `findByTexto(query, pageable)` - Full-text search
   - `findByFiltros(especificacion, pageable)`
   - `findWithinRadius(lat, lng, radiusKm)` - Geoespacial
   - `findCreatedSince(timestamp)` - Reportes recientes
   - Índices en: estado, tipo_animal, fecha_creacion, ubicacion

3. **Crear DTOs para Mapa**
   - `ReporteParaMapaDTO` (lightweight: id, lat, lng, tipo, estado, foto, tiempo)

4. **Crear BúsquedaController**
   - Endpoint `/search` - texto libre
   - Endpoint `/filter` - filtros avanzados
   - Endpoint `/ubicacion` - geoespacial
   - Endpoint `/nuevos` - últimos reportes
   - Endpoint `/zonas` - zonas predefinidas
   - Endpoint `/mapa` - DTO para mapa

5. **Crear BúsquedaUseCase**
   - `BuscarPorTextoUseCase`
   - `FiltrarReportesUseCase`
   - `ObtenerReportesEnZonaUseCase`

6. **Optimizaciones DB**
   - Crear índices (BTREE en estado, tipo, fecha; GiST/BRIN en ubicacion)
   - Considerar proyecciones JPA para DTOs ligeros
   - Paginar resultados (máx 50 por defecto)

### Frontend (Next.js)

7. **Crear tipos TypeScript**
   - `FiltrosReporte`, `RangoFechas`, `Zona`, `ReporteParaMapa`

8. **Crear servicio de búsqueda**
   - `busquedaService.ts` con funciones:
     - `buscarTexto(query, filtros, pageable)`
     - `filtrar(filtros, pageable)`
     - `obtenerPorUbicacion(lat, lng, radio)`
     - `obtenerNuevos(desde, filtros)`
     - `obtenerZonas()`
     - `obtenerParaMapa(filtros)`

9. **Crear hooks**
   - `useBusqueda` - encapsula lógica de búsqueda con debounce
   - `useMapState` - estado del mapa (centro, zoom, marcadores)
   - `useLocationTracking` - geolocalización del usuario
   - `useRealtimeUpdates` - polling cada 30s para nuevos reportes

10. **Crear componentes de búsqueda**
    - `SearchBar` - input con debounce
    - `FilterPanel` - panel de filtros
    - `FilterChips` - chips removibles
    - `DateRangePicker` - selector de rango
    - `ZoneSelector` - selector de zonas
    - `ResultadosBusqueda` - lista de resultados

11. **Integración de Mapa**
    - Instalar librería (Google Maps API con react-google-maps)
    - `MapContainer` - contenedor principal
    - `MapMarker` - marcadores individuales
    - `MapCluster` - agrupación (MarkerClusterer)
    - `MapPopup` - popup al click
    - Sincronizar con filtros

12. **Crear página Inicio**
    - Layout: Arriba header, abajo navBar móvil
    - Desktop: Header + Contenido principal
    - Móvil: Tab SearchBar arriba, luego Feed/Mapa tabs
    - Feed: Lista de reportes (ReportList)
    - Mapa: MapContainer con sincronización a Feed

13. **Actualización en Tiempo Real**
    - Polling cada 30s a `/api/v1/reportes/nuevos`
    - Agregar marcadores nuevos sin recargar
    - Atenuar/eliminar reportes RESUELTOS

14. **Performance**
    - Lazy load de imágenes en lista (IntersectionObserver)
    - Virtualización de lista (react-window)
    - Caché de búsquedas (React Query)
    - Memoización de componentes

15. **Pruebas**
    - Test unitarios de hooks
    - Test de filtros y búsqueda
    - Test E2E del flujo búsqueda-detalle

---

## Notas Técnicas Importantes

- **Full-Text Search**: PostgreSQL FULL TEXT SEARCH o usar Elasticsearch (v2)
- **Geoespacial**: PostGIS en PostgreSQL para distancias; o usar librería Haversine en Java
- **Clustering**: MarkerClusterer (Google) o Leaflet.markercluster
- **Polling**: Considerar WebSocket (Socket.IO) en v2 para mayor performance
- **Caché**: Redis para zonas y filtros frecuentes
- **Índices DB**: Crucial para búsquedas rápidas con muchos reportes
