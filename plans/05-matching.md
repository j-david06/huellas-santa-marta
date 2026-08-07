# Plan: Sistema de Matching Automático - Coincidencias Sugeridas

## 1. Dominio (Backend)

### Entidades
```
Match (Aggregate Root)
├── id: UUID
├── reporteAId: UUID
├── reporteBId: UUID
├── score: Integer (0-100)
├── factoresCoincidentes: List<String>
├── estado: MatchStatus (PENDING, VIEWED, ACCEPTED, REJECTED, RESOLVED)
├── generatedAt: LocalDateTime
├── notificadoAt: LocalDateTime (nullable)
└── resolvedAt: LocalDateTime (nullable)

MatchScore
├── puntosTipo: Integer (0-50)
├── puntosColor: Integer (0-50)
├── puntosZona: Integer (0-50)
├── puntosFecha: Integer (0-50)
├── calculoTotal(): Integer
└── cumpleThreshold(threshold: Integer): Boolean
```

### Value Objects
```
SimilitudAnimal
├── esIgual(tipo1: AnimalType, tipo2: AnimalType): Boolean
└── esIgual(sexo1: Sex, sexo2: Sex): Boolean

SimilitudColor
├── calcularSimilitud(color1: String, color2: String): Integer
    (0 = diferente, 25 = similar, 50 = igual)

SimilitudZona
├── calcularDistancia(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Double
├── mismaBanda(lat1: Double, lat2: Double): Boolean

SimilitudFecha
├── diasEntre(fecha1: LocalDateTime, fecha2: LocalDateTime): Integer
├── esReciente(fecha: LocalDateTime, dias: Integer): Boolean

FactoresCoincidentes
├── tipo_animal
├── color
├── zona_geografica
└── rango_fechas
```

### Excepciones de Dominio
- `MatchNoEncontradoException`
- `ReportesNoValidosException`
- `ScoreBajoException`

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases)

#### MatchingPort
```
calcularCoincidencias(reporteId: ReporteId): List<Match>
obtenerMatch(id: MatchId): Match
calcularYNotificarMatches(reporteId: ReporteId): void
marcarViewMatch(matchId: MatchId, usuarioId: UserId): void
aceptarMatch(matchId: MatchId, usuarioId: UserId): void
rechazarMatch(matchId: MatchId, usuarioId: UserId): void
recalcularTodosMatches(): void (background job)
```

#### MotorMatchingPort
```
calcularScore(reporteA: Reporte, reporteB: Reporte): MatchScore
obtenerFactoresCoincidentes(reporteA: Reporte, reporteB: Reporte): List<String>
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioMatch (JPA)
```
save(match: Match): Match
findById(id: MatchId): Optional<Match>
findByReporteA(reporteAId: ReporteId): List<Match>
findByReporteB(reporteBId: ReporteId): List<Match>
findActiveMatches(reporteId: ReporteId): List<Match>
findScoreGreaterThan(score: Integer): List<Match>
delete(id: MatchId): void
```

#### RepositorioReporte (JPA)
```
findById(id: ReporteId): Optional<Reporte>
findAllActivos(): List<Reporte>
```

#### ServicioNotificaciones
```
notificarCoincidencia(match: Match, usuarioId: UserId): void
```

#### ServicioAlgoritmo
```
calcularDistancia(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Double
calcularSimilitudTexto(texto1: String, texto2: String): Integer (0-100)
```

### Adaptadores (Input)
- `MatchingController` (REST, solo queries)

### Adaptadores (Output)
- `RepositorioMatchJPA` (Spring Data)
- `MotorMatchingImpl` (algoritmo scoring)
- `ServicioAlgoritmoImpl` (cálculos geoespaciales)
- `ScheduledMatchingJob` (background job - Quartz/Scheduler)
- `AdaptadorNotificacionesMatching`

---

## 3. Endpoints REST

### Obtener Coincidencias de un Reporte
```
GET /api/v1/reportes/{reporteId}/matches

Headers:
  (opcional) Authorization: Bearer {token}

Response 200:
{
  "matches": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "reporteOpuesto": {
        "id": "...",
        "nombre": "Rex",
        "tipo": "PERRO",
        "estado": "ENCONTRADO",
        "fotoUrl": "https://...",
        "ubicacion": "El Rodadero",
        "tiempoTranscurrido": "Hace 2 horas"
      },
      "score": 85,
      "factoresCoincidentes": ["tipo_animal", "color", "zona_geografica"],
      "estado": "PENDING",
      "generatedAt": "2024-08-07T12:00:00Z"
    }
  ],
  "cantidad": 1
}

Response 404: Reporte no encontrado
```

### Marcar Match como Visto
```
POST /api/v1/matches/{matchId}/view

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "id": "...",
  "estado": "VIEWED",
  "viewedAt": "2024-08-07T14:00:00Z"
}

Response 403: No autorizado
Response 404: Match no encontrado
```

### Aceptar Match
```
POST /api/v1/matches/{matchId}/accept

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "id": "...",
  "estado": "ACCEPTED",
  "acceptedAt": "2024-08-07T14:05:00Z"
}

Response 403: No autorizado
Response 404: Match no encontrado
```

### Rechazar Match
```
POST /api/v1/matches/{matchId}/reject

Headers:
  Authorization: Bearer {token}

Response 200:
{
  "id": "...",
  "estado": "REJECTED",
  "rejectedAt": "2024-08-07T14:05:00Z"
}

Response 403: No autorizado
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── components/
│   ├── matching/
│   │   ├── MatchAlert.tsx              (Alerta de coincidencia)
│   │   ├── MatchCard.tsx               (Tarjeta del match)
│   │   ├── MatchInfo.tsx               (Información completa)
│   │   └── MatchActions.tsx            (Botones de acción)
│
├── hooks/
│   └── useMatches.ts                   (Fetch matches)
│
├── services/
│   └── matchingService.ts              (API calls)
│
└── types/
    └── matching.ts                     (tipos matching)
```

### Componentes Principales

#### MatchAlert.tsx
```typescript
Props:
  - matches: Match[]
  - reporteId: string
  - onViewMatch: (matchId: string) => void

Renders:
  - Alert destacada (background tertiary-fixed)
  - Icono spark / auto_awesome
  - Título: "Posible Coincidencia Detectada"
  - Subtitle: descripción del match más probable
  - Botón: "Ver reporte sugerido"
  - Si hay múltiples: link a "Ver todas las coincidencias"

Styling:
  - Color: dorado/terciario
  - Icono especial
  - Posicionado: debajo de acciones principales
```

#### MatchCard.tsx
```typescript
Props:
  - match: Match
  - onNavegar: (reporteId: string) => void

Renders:
  - Foto miniatura del reporte opuesto
  - Nombre / "Sin nombre"
  - Tipo + Raza
  - Ubicación
  - Tiempo transcurrido
  - Score/Porcentaje (opcional v1)
  - Factores coincidentes (badges)
  - Botón "Ver detalle"
```

#### MatchInfo.tsx
```typescript
Props:
  - match: Match
  - reporteActual: Reporte
  - reporteOpuesto: Reporte

Renders:
  - Comparación lado a lado
  - Factores coincidentes detallados
  - Score desglosado (tipo, color, zona, fecha)
  - Acciones: Aceptar, Rechazar, Ver reporte completo
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear Migration Flyway**
   - `V6__create_matches_table.sql`
   - Campos: id, reporte_a_id, reporte_b_id, score, factores_coincidentes (JSON), estado, generated_at, notificado_at, resolved_at
   - Índices: reporte_a_id, reporte_b_id, score, estado

2. **Crear Dominio**
   - Entidad `Match`
   - Value Objects: `MatchScore`, `SimilitudAnimal`, `SimilitudColor`, `SimilitudZona`, `SimilitudFecha`
   - Excepciones

3. **Crear MotorMatching**
   - Implementar algoritmo de scoring
   - Funciones de similitud (tipo, color, zona, fecha)
   - Threshold y pesos configurables

4. **Crear ServicioAlgoritmo**
   - Haversine distance para coordenadas
   - Levenshtein distance para colores
   - Date diff en días

5. **Crear RepositorioMatch**
   - JPA con métodos de búsqueda

6. **Crear MatchingUseCase**
   - `CalcularCoincidenciasUseCase`
   - `ObtenerMatchUseCase`
   - `MarcarViewMatchUseCase`
   - `AceptarMatchUseCase`
   - `RechazarMatchUseCase`
   - `RecalcularTodosMatchesUseCase`

7. **Crear MatchingController**
   - Endpoints GET, POST

8. **Crear Background Job**
   - `ScheduledMatchingJob` que corre cada 24h
   - Recalcula matches de todos los reportes ACTIVOS
   - Usa `@Scheduled` o Quartz

9. **Crear DTOs**
   - `MatchResponse`, `MatchListResponse`, `ScoreBreakdown`

10. **Integrar Notificaciones**
    - Llamar a `ServicioNotificaciones` al generar match

### Frontend (Next.js)

11. **Crear tipos TypeScript**
    - `Match`, `MatchScore`, `FactoresCoincidentes`

12. **Crear servicio de matching**
    - `matchingService.ts`:
      - `obtenerMatches(reporteId: string): Promise<Match[]>`
      - `marcarComoVisto(matchId: string): Promise<void>`
      - `aceptarMatch(matchId: string): Promise<void>`
      - `rechazarMatch(matchId: string): Promise<void>`

13. **Crear hook useMatches**
    - Fetch matches del reporte
    - Estado de carga

14. **Crear componentes**
    - `MatchAlert` - alerta en detalle
    - `MatchCard` - tarjeta individual
    - `MatchInfo` - información completa
    - `MatchActions` - botones

15. **Integración en ReportDetail**
    - Mostrar `MatchAlert` si hay matches
    - Posicionar: debajo de acciones (WhatsApp, Compartir)
    - Link a página de "Coincidencias" (opcional)

16. **Página de Coincidencias (opcional)**
    - Mostrar todos los matches de un reporte
    - Ordenar por score
    - Ver detalles lado a lado

17. **Notificación en Tiempo Real**
    - Al resolver reporte, marcar matches como RESOLVED
    - Analytics de éxito

18. **Pruebas**
    - Test scoring algorithm
    - Test endpoint matches
    - Test componentes
    - Test E2E: crear reporte → ver coincidencias

---

## Notas Técnicas Importantes

- **Algoritmo de Scoring**:
  ```
  Score = (tipo*0.4) + (color*0.3) + (zona*0.2) + (fecha*0.1)
  
  - Tipo: 50 si igual, 0 si diferente
  - Color: 50 igual, 25 similar, 0 diferente (usar Levenshtein)
  - Zona: 50 misma, 25 < 1km, 0 > 1km
  - Fecha: 50 < 24h, 25 < 72h, 0 > 72h
  
  Threshold: >= 60 para sugerir
  ```

- **Cálculo de Distancia**: Haversine formula
  ```java
  double dLat = Math.toRadians(lat2 - lat1);
  double dLng = Math.toRadians(lng2 - lng1);
  double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
             Math.sin(dLng/2) * Math.sin(dLng/2);
  double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return 6371 * c; // km
  ```

- **Performance**:
  - Cache de matches en Redis (TTL 1 día)
  - Batch processing del background job
  - Índices en DB

- **Background Job**:
  - Corre cada 24h (configurable)
  - Procesa reportes ACTIVOS de últimos 30 días
  - Batch de 100-500 reportes
  - Registra tiempo de ejecución

- **Notificaciones**:
  - Ambos publicadores reciben notificación
  - Incluye link al reporte coincidente

- **Analytics**:
  - Registrar matches sugeridos
  - Registrar clicks en "Ver sugerencia"
  - Registrar aceptaciones (éxito)
  - Usar para mejorar pesos del algoritmo
