# Spec: Compartir Reporte en Redes Sociales

## Descripción Funcional

El módulo de Compartir permite a los usuarios difundir rápidamente un reporte de mascota perdida o encontrada en redes sociales y otros canales de comunicación. Un botón "Compartir" genera un link compartible que abre el reporte con foto, descripción y datos contextuales, facilitando que la información llegue a más personas y aumentando las probabilidades de éxito en el reencuentro.

El sistema soporta múltiples canales: WhatsApp, Facebook, Twitter/X, LinkedIn, copiar enlace, y web share APIs nativas del navegador.

---

## Entidades Involucradas

### Elemento Compartible
- **Tipo**: Reporte de mascota
- **Contenido a Compartir**:
  - Foto principal (primera imagen del reporte)
  - Título: "[ESTADO] - [NOMBRE/SIN NOMBRE] ([TIPO])"
  - Descripción: Resumen de 150-200 caracteres con ubicación y características
  - URL Compartible: Link generado para el reporte (ej: `https://huellas.app/reportes/[UUID]`)
  - Hashtags: #HuellasSantaMarta #PerroPerdido o #GatEncontrado

### Plantillas de Mensaje
Se generan dinámicamente según el canal

---

## Reglas de Negocio

1. **Link Compartible**:
   - URL canónica: `https://huellas.app/reportes/[REPORTE_ID]`
   - Es público (no requiere autenticación)
   - Redirige a la vista de detalle del reporte
   - Si el reporte está archivado, muestra: "Este reporte ya no está disponible"
   - Open Graph meta tags (og:title, og:description, og:image) para vista previa en redes

2. **Contenido por Canal**:
   - **WhatsApp**: Mensaje corto + link (máx 300 caracteres texto)
   - **Facebook**: Post con foto, descripción y hashtags
   - **Twitter/X**: Tweet con foto, descripción, hashtags (máx 280 caracteres)
   - **Copiar Enlace**: Solo copia URL al portapapeles
   - **Web Share API**: Usa compartidor nativo del SO (si disponible)

3. **Foto Compartida**:
   - Se envía la primera foto del reporte
   - La foto se comprime si es necesario (máx 2MB para redes)
   - Incluye Open Graph image meta tag

4. **Hashtags Dinámicos**:
   - #HuellasSantaMarta (siempre)
   - #PerroPerdido o #PerroEncontrado (según estado)
   - #GatoPerdido o #GatoEncontrado (según estado)
   - #SantaMarta

5. **Privacidad**:
   - El número de teléfono del publicador NO aparece en el link compartible
   - El usuario que comparte aparece como "Compartido por [usuario]" o solo como enlace anónimo
   - La información de contacto solo se revela en la vista de detalle del reporte

6. **Rastreo (Analytics)**:
   - Se registra cuántas veces se comparte cada reporte
   - Se registra por canal (WhatsApp, Facebook, etc)
   - Se usa para mejorar matching y sugerencias

---

## Criterios de Aceptación

### CA1: Botón "Compartir"
- [ ] Botón visible en la vista de detalle del reporte
- [ ] Posicionado arriba de las características (al lado del botón de WhatsApp)
- [ ] Icono de compartición (share, arrow outbound, etc)
- [ ] Texto: "Compartir"
- [ ] Color: Gris/secundario (menos destacado que WhatsApp)
- [ ] El botón abre un modal o menú desplegable con opciones

### CA2: Menú de Opciones de Compartición
- [ ] Al hacer clic en "Compartir", se abre un modal o bottom sheet (mobile) con opciones:
  - [ ] WhatsApp
  - [ ] Facebook
  - [ ] Twitter
  - [ ] Copiar Enlace
  - [ ] (opcional) Más opciones / Web Share API
- [ ] Cada opción tiene un icono (verde para WhatsApp, azul para Facebook, etc)
- [ ] En mobile, se usa bottom sheet; en desktop, modal centrado

### CA3: Compartir por WhatsApp
- [ ] Usuario hace clic en "WhatsApp"
- [ ] Se abre WhatsApp Web o app con mensaje prellenado:
  ```
  [ESTADO] - [NOMBRE] ([TIPO])
  Ubicación: [BARRIO/DIRECCIÓN]
  [Características: color, raza, sexo]
  
  Link: [URL]
  
  #HuellasSantaMarta #PerroPerdido
  ```
- [ ] Message es accesible (no supera límite de caracteres)
- [ ] Link es clickeable en WhatsApp

### CA4: Compartir por Facebook
- [ ] Usuario hace clic en "Facebook"
- [ ] Abre Facebook Share Dialog (si está loggeado)
- [ ] Pre-carga:
  - Foto del reporte
  - Título con estado y nombre
  - Descripción con características
  - Link al reporte
- [ ] Usuario puede agregar comentario adicional antes de publicar
- [ ] Al publicar, muestra confirmación

### CA5: Compartir por Twitter/X
- [ ] Usuario hace clic en "Twitter"
- [ ] Abre Twitter Intent URL con tweet prellenado:
  ```
  🆘 [ESTADO] - [NOMBRE] ([TIPO])
  Buscamos a [NOMBRE] en [ZONA]
  📍 [Características]
  
  [URL]
  
  #HuellasSantaMarta #SantaMarta
  ```
- [ ] Tweet es breve y ajustado al límite de 280 caracteres
- [ ] Incluye emoji para visibilidad

### CA6: Copiar Enlace
- [ ] Usuario hace clic en "Copiar Enlace"
- [ ] El URL se copia al portapapeles: `https://huellas.app/reportes/[REPORTE_ID]`
- [ ] Se muestra toast de confirmación: "Enlace copiado al portapapeles"
- [ ] El usuario puede pegar el link en cualquier lugar (email, mensajes de texto, etc)

### CA7: Web Share API (Fallback)
- [ ] En navegadores que soportan Web Share API (iOS Safari, Android Chrome):
  - [ ] Al hacer clic en "Más" o "Compartir", se abre el compartidor nativo del SO
  - [ ] Se envía: título, descripción, URL
  - [ ] Usuario ve opciones nativas (Mensajes, Mail, etc)

### CA8: Foto en la Compartición
- [ ] La foto del reporte se incluye cuando es posible (Facebook, Twitter)
- [ ] Para WhatsApp, solo se comparte el link (la imagen se ve si hace click)
- [ ] La foto está comprimida para asegurar carga rápida

### CA9: Open Graph Meta Tags
- [ ] Al compartir en Facebook o cualquier plataforma con preview:
  - [ ] `og:title`: "[ESTADO] - [NOMBRE] ([TIPO])"
  - [ ] `og:description`: "Buscamos a [NOMBRE] en [ZONA]. [Características breves]"
  - [ ] `og:image`: URL de la foto del reporte
  - [ ] `og:url`: URL del reporte
- [ ] El preview se ve correctamente en redes

### CA10: URL Pública y Segura
- [ ] El link `https://huellas.app/reportes/[UUID]` es público
- [ ] No requiere autenticación para ver el reporte
- [ ] Se valida que el UUID sea válido
- [ ] Si el reporte no existe, muestra: "Reporte no encontrado"
- [ ] Si el reporte está archivado, muestra: "Este reporte ya no está disponible"

### CA11: Analytics de Compartición
- [ ] Se registra cada compartición:
  - Reporte ID
  - Canal (WhatsApp, Facebook, Twitter, Copiar Enlace, Web Share)
  - Timestamp
- [ ] Se muestra en dashboard de reporte: "Compartido X veces en [canales]"

### CA12: Responsividad
- [ ] En mobile, el menú de compartición se abre como bottom sheet
- [ ] En desktop, se abre como modal centrado
- [ ] Los botones son lo suficientemente grandes para tocar en mobile

### CA13: Fallbacks y Errores
- [ ] Si el usuario no tiene una red social instalada/conectada, se intenta web version o muestra enlace alternativo
- [ ] Si hay error al compartir, muestra: "Error al compartir. Intenta de nuevo."
- [ ] Copiar Enlace siempre funciona (fallback seguro)

### CA14: No Requiere Autenticación
- [ ] El usuario NO necesita estar loggeado para compartir
- [ ] Pero es preferible que esté loggeado para rastrear comparticiones a su usuario
- [ ] Si no está loggeado, se registra la compartición como anónima

---

## Notas Técnicas

- Usar librería `share-api` de MDN o construir manual con URLs estándares
- URLs estándares:
  - WhatsApp: `https://wa.me/?text=[encodeURIComponent(mensaje)]`
  - Facebook: `https://www.facebook.com/sharer/sharer.php?u=[URL]`
  - Twitter: `https://twitter.com/intent/tweet?text=[texto]&url=[URL]`
  - Copiar: `navigator.clipboard.writeText(URL)`
- Open Graph meta tags en `<head>` dinámicamente renderizados (SSG o SSR)
- Crear tabla `comparticiones`: reporte_id, usuario_id (nullable), canal, created_at
- Índice en: reporte_id, canal para reportes de comparticiones
- URL canónica con protocolo HTTPS para garantizar seguridad
- Usar librería `social-share-urls` o similar para generar URLs correctas
