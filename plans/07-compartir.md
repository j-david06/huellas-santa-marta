# Plan: Compartir Reporte en Redes Sociales

## 1. Dominio (Backend)

### Entidades
```
Comparticion (Aggregate Root)
├── id: UUID
├── reporteId: UUID
├── usuarioId: UUID (nullable, anónimo si no está loggeado)
├── canal: CanalComparticion (WHATSAPP, FACEBOOK, TWITTER, COPIAR_ENLACE, WEB_SHARE)
├── createdAt: LocalDateTime
└── metadata: JSON (contexto: dispositivo, etc)

MetaDatos OG (Open Graph)
├── titulo: String
├── descripcion: String
├── imagen: URL
├── url: URL
└── hashtags: List<String>
```

### Value Objects
```
CanalComparticion (Enum)
├── WHATSAPP
├── FACEBOOK
├── TWITTER
├── COPIAR_ENLACE
└── WEB_SHARE

TemplateComparticion
├── generar(reporte: Reporte, canal: CanalComparticion): String
├── generarUrl(reporte: Reporte, canal: CanalComparticion): String
└── generarOG(reporte: Reporte): OGMetaTags
```

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases)

#### ComparticionPort
```
generarLinkCompartible(reporteId: ReporteId): LinkCompartible
generarUrlPorCanal(reporteId: ReporteId, canal: CanalComparticion): String
registrarComparticion(reporteId: ReporteId, canal: CanalComparticion, usuarioId?: UserId): void
obtenerEstadisticasComparticion(reporteId: ReporteId): EstadisticasComparticion
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioComparticion (JPA)
```
save(comparticion: Comparticion): Comparticion
findByReporteId(reporteId: ReporteId): List<Comparticion>
findByCanalGroupByReporte(reporteId: ReporteId): Map<CanalComparticion, Integer>
countByCanal(reporteId: ReporteId, canal: CanalComparticion): Integer
```

#### RepositorioReporte (JPA)
```
findById(reporteId: ReporteId): Optional<Reporte>
```

#### GeneradorTemplate
```
generarTemplateWhatsApp(reporte: Reporte): String
generarTemplateTwitter(reporte: Reporte): String
generarTemplateFacebook(reporte: Reporte): String
generarOGMetaTags(reporte: Reporte): OGMetaTags
```

### Adaptadores (Input)
- `ComparticionController` (REST)

### Adaptadores (Output)
- `RepositorioComparticionJPA` (Spring Data)
- `GeneradorTemplateImpl`
- `GeneradorOGTagsImpl`

---

## 3. Endpoints REST

### Generar Link Compartible
```
GET /api/v1/reportes/{reporteId}/compartir

Response 200:
{
  "url": "https://huellas.app/reportes/550e8400-e29b-41d4-a716-446655440000",
  "canales": {
    "whatsapp": "https://wa.me/?text=Perdido%20-%20Bruno%20(Perro)%20en%20Centro%20Histórico...",
    "facebook": "https://www.facebook.com/sharer/sharer.php?u=https://huellas.app/reportes/...",
    "twitter": "https://twitter.com/intent/tweet?text=🆘%20Perdido%20-%20Bruno...",
    "copiar": "https://huellas.app/reportes/550e8400-e29b-41d4-a716-446655440000"
  },
  "metadata": {
    "titulo": "PERDIDO - Bruno (Perro)",
    "descripcion": "Buscamos a Bruno en Centro Histórico. Perro criollo, color negro",
    "imagen": "https://s3.amazonaws.com/huellas/...",
    "hashtags": ["#HuellasSantaMarta", "#PerroPerdido", "#SantaMarta"]
  }
}

Response 404: Reporte no encontrado
```

### Registrar Compartición
```
POST /api/v1/reportes/{reporteId}/comparticiones

Headers:
  (opcional) Authorization: Bearer {token}

Body:
{
  "canal": "WHATSAPP"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "reporteId": "...",
  "canal": "WHATSAPP",
  "createdAt": "2024-08-07T14:30:00Z"
}

Response 400: Canal inválido
Response 404: Reporte no encontrado
```

### Obtener Estadísticas de Compartición
```
GET /api/v1/reportes/{reporteId}/comparticiones/estadisticas

Response 200:
{
  "reporteId": "...",
  "totalComparticiones": 5,
  "porCanal": {
    "WHATSAPP": 2,
    "FACEBOOK": 1,
    "TWITTER": 1,
    "COPIAR_ENLACE": 1
  }
}
```

### Obtener Página Pública del Reporte (Open Graph)
```
GET /reportes/{reporteId}

Headers:
  (sin autenticación requerida)

Response 200: HTML con Open Graph meta tags
  og:title: "PERDIDO - Bruno (Perro)"
  og:description: "Buscamos a Bruno en Centro Histórico..."
  og:image: "https://s3.amazonaws.com/huellas/..."
  og:url: "https://huellas.app/reportes/..."
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── app/
│   ├── reportes/
│   │   └── [id]/
│   │       └── page.tsx                (Página pública del reporte)
│
├── components/
│   ├── compartir/
│   │   ├── BotonCompartir.tsx          (Botón principal)
│   │   ├── MenuComparticion.tsx        (Menú con opciones)
│   │   ├── BotonRedSocial.tsx          (Botón por canal)
│   │   └── ToastCompartida.tsx         (Confirmación)
│
├── hooks/
│   └── useCompartir.ts                 (Generar y compartir)
│
├── services/
│   └── compartirService.ts             (API calls)
│
└── types/
    └── compartir.ts                    (tipos compartición)
```

### Componentes Principales

#### BotonCompartir.tsx
```typescript
Props:
  - reporteId: string
  - nombreMascota: string
  - estado: 'PERDIDO' | 'ENCONTRADO'

State:
  - isOpen: boolean (modal/bottom sheet)
  - isSharing: boolean

Behavior:
  - Click → abre MenuComparticion
  - Registra compartición en backend

Styling:
  - Color: gris/secundario
  - Icono: share
  - Posicionado: junto a WhatsApp
```

#### MenuComparticion.tsx
```typescript
Props:
  - reporteId: string
  - nombreMascota: string
  - isOpen: boolean
  - onClose: () => void
  - urls: URLsComparticion

Renders:
  - BotonRedSocial para cada canal
  - Icono + nombre del canal
  - Orden: WhatsApp, Facebook, Twitter, Copiar, (Web Share)

Styling:
  - Mobile: bottom sheet
  - Desktop: modal centrado
  - Botones grandes para tocar
```

#### BotonRedSocial.tsx
```typescript
Props:
  - canal: CanalComparticion
  - url: string
  - onCompartir: () => void

Behavior:
  - Click → abre URL en nueva pestaña
  - Registra compartición (analytics)
  - Muestra toast de confirmación

Styling:
  - Color nativo de red social
  - Icono oficial
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear Migration Flyway**
   - `V9__create_comparticiones_table.sql`
   - Campos: id, reporte_id, usuario_id (nullable), canal, created_at, metadata (JSON)
   - Índices: reporte_id, canal, created_at

2. **Crear Dominio**
   - Entidad `Comparticion`
   - Value Objects: `CanalComparticion`, `TemplateComparticion`

3. **Crear GeneradorTemplate**
   - `generarTemplateWhatsApp(reporte)`: Mensaje prellenado
   - `generarTemplateTwitter(reporte)`: Tweet prellenado
   - `generarTemplateFacebook(reporte)`: Post prellenado
   - URL-encodar correctamente

4. **Crear GeneradorOGTags**
   - `generarOGMetaTags(reporte)`: Open Graph meta tags
   - Título, descripción, imagen, URL
   - Hashtags dinámicos

5. **Crear RepositorioComparticion**
   - JPA con métodos de búsqueda y estadísticas

6. **Crear ComparticionUseCase**
   - `GenerarLinkCompartibleUseCase`
   - `GenerarUrlPorCanalUseCase`
   - `RegistrarComparticionUseCase`
   - `ObtenerEstadisticasUseCase`

7. **Crear ComparticionController**
   - Endpoints GET, POST
   - Endpoint público para página de reporte

8. **Crear DTO**
   - `LinkCompartibleResponse` (url, canales, metadata)
   - `URLsComparticion` (whatsapp, facebook, twitter, copiarEnlace)
   - `EstadisticasComparticionResponse`

9. **Configurar Open Graph**
   - Server-side rendering (SSR) o SSG para meta tags
   - Usar Next.js `generateMetadata()` en `[id]/page.tsx`

### Frontend (Next.js)

10. **Crear tipos TypeScript**
    - `Comparticion`, `CanalComparticion`, `URLsComparticion`

11. **Crear servicio de compartición**
    - `compartirService.ts`:
      - `generarLink(reporteId): Promise<LinkCompartibleResponse>`
      - `registrarComparticion(reporteId, canal): Promise<void>`
      - `obtenerEstadisticas(reporteId): Promise<EstadisticasComparticion>`

12. **Crear hook useCompartir**
    - Estado: isOpen, isSharing
    - Funciones: generarYAbrir(canal), registrar()

13. **Crear componentes**
    - `BotonCompartir` - botón principal
    - `MenuComparticion` - menú con opciones
    - `BotonRedSocial` - botón por canal
    - `ToastCompartida` - confirmación

14. **Integración en ReportDetail**
    - Mostrar `BotonCompartir` en sección de acciones
    - Junto a WhatsApp y otro botón

15. **Crear página pública /reportes/[id]**
    - Mostrar reporte sin necesidad de estar loggeado
    - Renderizar Open Graph meta tags
    - Usar `generateMetadata()` de Next.js
    - SSG con revalidation cada 1 hora

16. **URLs de Redes Sociales**
    - WhatsApp: `https://wa.me/?text=[encodeURIComponent(mensaje)]`
    - Facebook: `https://www.facebook.com/sharer/sharer.php?u=[URL]`
    - Twitter: `https://twitter.com/intent/tweet?text=[texto]&url=[URL]`
    - Web Share API: `navigator.share()` (si disponible)

17. **Fallbacks y Errores**
    - Si red social no disponible, fallback a copiar enlace
    - Error handling en cada canal

18. **Analytics**
    - Registrar cada compartición (timestamp, canal, user)
    - Dashboard con estadísticas de comparticiones

19. **Pruebas**
    - Test generación de URLs
    - Test registro de comparticiones
    - Test Open Graph meta tags
    - Test página pública (SSG/ISR)
    - Test E2E: compartir en redes

---

## Notas Técnicas Importantes

- **URLs de Redes Sociales**:
  ```
  WhatsApp:
  https://wa.me/?text=[encodeURIComponent(mensaje)]
  
  Facebook:
  https://www.facebook.com/sharer/sharer.php?u=[URL]&quote=[cita]
  
  Twitter:
  https://twitter.com/intent/tweet?text=[texto]&url=[URL]&hashtags=[tags]
  
  Copiar enlace:
  navigator.clipboard.writeText(URL)
  ```

- **Open Graph Meta Tags**:
  ```html
  <meta property="og:title" content="PERDIDO - Bruno (Perro)">
  <meta property="og:description" content="...">
  <meta property="og:image" content="https://...">
  <meta property="og:url" content="https://huellas.app/reportes/...">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  ```

- **Next.js SSG/ISR**:
  ```typescript
  export const generateMetadata = ({ params }) => ({
    title: `${reporte.estado} - ${reporte.nombre}`,
    description: reporte.descripcion,
    openGraph: {
      images: [reporte.fotos[0].url],
    }
  })
  
  export const revalidate = 3600 // 1 hora ISR
  ```

- **Mensaje Prellenado** (Máx 300 caracteres):
  ```
  [ESTADO] - [NOMBRE] ([TIPO])
  Ubicación: [BARRIO]
  [Características: color, raza, sexo]
  
  Link: [URL]
  
  #HuellasSantaMarta #[ESTADO]
  ```

- **Performance**:
  - Caché de URLs compartibles (Redis, TTL 1 día)
  - SSG para página pública con ISR

- **Privacy**:
  - No mostrar número de teléfono en URLs públicas
  - Solo datos públicos en Open Graph

- **Analytics**:
  - Registrar: timestamp, canal, reporte_id, usuario_id (nullable)
  - Dashboard: top reportes compartidos, canal más usado
  - A/B testing de mensajes
