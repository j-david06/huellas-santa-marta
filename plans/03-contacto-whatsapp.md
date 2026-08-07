# Plan: Contacto Directo por WhatsApp

## 1. Dominio (Backend)

### Entidades
```
ContactoWhatsApp (Value Object)
├── numeroTelefono: String (E.164)
├── nombreMascota: String
├── tipoReporte: ReportStatus (PERDIDO, ENCONTRADO)
├── ubicacion: String
├── tipoAnimal: AnimalType
└── generarMensajePrellenado(): String
```

### Value Objects
```
TemplateWhatsApp
├── generar(reporte: Reporte, solicitante: String): TemplateResult
└── TemplateResult
    ├── numeroDestino: String
    ├── mensaje: String
    └── urlGenerada: String
```

---

## 2. Puertos & Adaptadores

### Puertos (Input - Use Cases)

#### ContactoPort
```
generarLinkWhatsApp(reporteId: ReporteId, usuarioId?: UserId): LinkWhatsApp
validarNumeroTelefono(numero: String): Boolean
```

### Puertos (Output - Adaptadores Secundarios)

#### RepositorioContacto (JPA)
```
obtenerDatosContacto(reporteId: ReporteId): DatosContacto
```

#### GeneradorURL
```
generarUrlWhatsApp(numero: String, mensaje: String): String
```

### Adaptadores (Input)
- `ContactoController` (REST)

### Adaptadores (Output)
- `GeneradorURLWhatsAppImpl`
- `ValidadorTelefonoImpl`

---

## 3. Endpoints REST

### Generar Link WhatsApp
```
POST /api/v1/reportes/{id}/whatsapp-link

Headers:
  (opcional) Authorization: Bearer {token}

Body:
{
  "nombreSolicitante": "María" (opcional, para personalizar)
}

Response 200:
{
  "url": "https://wa.me/573101234567?text=Hola%2C%20estoy%20interesado%20en%20tu%20reporte%20sobre%20Bruno...",
  "numeroTelefono": "+573101234567",
  "mensaje": "Hola, estoy interesado en tu reporte sobre Bruno (Perro - Perdido) en Centro Histórico. ¿Podemos hablar?"
}

Response 400: Reporte sin teléfono válido
Response 404: Reporte no encontrado
```

### Validar Número Telefónico (opcional)
```
GET /api/v1/validar-telefono?numero=%2B573101234567

Response 200:
{
  "valido": true,
  "formato": "E.164",
  "pais": "CO",
  "operador": "Movistar"
}

Response 200:
{
  "valido": false,
  "razon": "Formato inválido"
}
```

---

## 4. Componentes Next.js

### Estructura de Carpetas
```
src/
├── components/
│   ├── contacto/
│   │   ├── BotonWhatsApp.tsx           (Botón principal)
│   │   ├── ModalPreviewMensaje.tsx     (Preview del mensaje)
│   │   └── FallbackCopiarNumero.tsx    (Fallback si no hay WhatsApp)
│
├── hooks/
│   └── useWhatsAppLink.ts              (Generar y manejar link)
│
├── services/
│   └── contactoService.ts              (API calls)
│
└── types/
    └── contacto.ts                     (tipos de contacto)
```

### Componentes Principales

#### BotonWhatsApp.tsx
```typescript
Props:
  - reporteId: string
  - nombreMascota: string
  - estado: 'PERDIDO' | 'ENCONTRADO'
  - ubicacion: string
  - tipoAnimal: 'PERRO' | 'GATO'
  - esPublicador?: boolean (si es verdad, no mostrar botón)

State:
  - isGenerating: boolean
  - error?: string

Behavior:
  - Hacer click → genera link
  - Abre WhatsApp (app o web)
  - Si error → muestra fallback "Copiar Número"
  - Registra analytics

Styling:
  - Color: #25D366 (verde WhatsApp)
  - Icono: chat o WhatsApp
  - Tamaño: flex-1 en mobile, auto en desktop
```

#### ModalPreviewMensaje.tsx (opcional para v1)
```typescript
Props:
  - isOpen: boolean
  - mensaje: string
  - numeroDestino: string
  - onConfirm: () => void
  - onCancel: () => void

Renders:
  - Preview del mensaje prellenado
  - Botón "Abrir WhatsApp"
  - Botón "Cancelar"
```

#### FallbackCopiarNumero.tsx
```typescript
Props:
  - numeroTelefono: string

Behavior:
  - Click → copia al portapapeles
  - Muestra toast: "Número copiado"
  - Fallback si no hay acceso a WhatsApp
```

---

## 5. Orden de Tareas

### Backend (Spring Boot)

1. **Crear Value Object**
   - `ContactoWhatsApp`
   - Métodos de validación de número E.164

2. **Crear GeneradorURLWhatsApp**
   - Implementar `GeneradorURL` interface
   - Método: `generarUrlWhatsApp(numero: String, mensaje: String): String`
   - URL-encodar mensaje correctamente
   - Validar formato del número

3. **Crear ValidadorTelefono**
   - Validar formato E.164: `^\+[1-9]\d{1,14}$`
   - Validar longitud (mín 9, máx 15 dígitos)
   - Validar código de país (preferentemente +57 para Colombia)

4. **Crear ContactoUseCase**
   - `GenerarLinkWhatsAppUseCase`:
     - Obtener datos del reporte
     - Validar número de contacto
     - Generar mensaje prellenado
     - Generar URL wa.me/
     - Registrar en analytics

5. **Crear ContactoController**
   - Endpoint `POST /api/v1/reportes/{id}/whatsapp-link`
   - Endpoint `GET /api/v1/validar-telefono` (opcional)

6. **Crear DTO**
   - `WhatsAppLinkResponse` (url, numeroTelefono, mensaje)
   - `ValidarTelefonoRequest/Response`

7. **Extender Reporte**
   - Asegurar que `DatosContacto.telefono` está siempre en formato E.164

### Frontend (Next.js)

8. **Crear tipos TypeScript**
   - `ContactoWhatsApp`, `WhatsAppLinkResponse`

9. **Crear servicio de contacto**
   - `contactoService.ts`:
     - `generarLinkWhatsApp(reporteId: string): Promise<WhatsAppLinkResponse>`
     - `validarTelefono(numero: string): Promise<ValidarTelefonoResult>` (opcional)

10. **Crear hook useWhatsAppLink**
    - Estado: isGenerating, error, link
    - Función: generarYAbrir()
    - Manejo de errores

11. **Crear componente BotonWhatsApp**
    - Props: reporteId, nombreMascota, estado, ubicacion, tipoAnimal
    - Comportamiento: generar link + abrir WhatsApp
    - Fallback: "Copiar Número" si hay error

12. **Integración en ReportDetail**
    - Mostrar botón en sección de acciones (al lado del botón Compartir)
    - Color verde #25D366
    - Desabilitar si es publicador del reporte
    - Mostrar tooltip si el número no es válido

13. **Analytics**
    - Registrar cada click en "Contactar por WhatsApp"
    - Registrar fallbacks
    - Registrar errores

14. **Pruebas**
    - Test generación de URL
    - Test validación de números
    - Test click y apertura de WhatsApp
    - Test fallback en dispositivos sin WhatsApp

---

## Notas Técnicas Importantes

- **Formato E.164**: Obligatorio para compatibilidad WhatsApp
  - Ejemplo: +573101234567 (país + operador + número)
  - Regex: `^\+[1-9]\d{1,14}$`

- **Generación de URL**:
  ```
  https://wa.me/[número_sin_+]?text=[mensaje_urlencodeado]
  Ejemplo:
  https://wa.me/573101234567?text=Hola%2C%20estoy%20interesado...
  ```

- **URL-Encoding**: Usar `encodeURIComponent()` en JavaScript
  - Espacios → %20
  - Comas → %2C
  - Paréntesis → %28 y %29

- **Mensaje Prellenado**: Máx 300 caracteres para garantizar entrega completa

- **Privacidad**: 
  - Nunca loguear números de teléfono en consola
  - No mostrar número completo en UI (mostrar solo los últimos 4 dígitos si es necesario)

- **Fallback**: Si no hay WhatsApp o hay error:
  - Mostrar botón "Copiar Número"
  - Toast: "Número copiado. Abre WhatsApp y pégalo."

- **Testing**: Usar números de prueba válidos en formato E.164
  - Ejemplo: +573001234567

- **Tracking**: Registrar:
  - Timestamp del click
  - Reporte ID
  - Usuario ID (si logged in)
  - Dispositivo (mobile/web)
  - Success/error
