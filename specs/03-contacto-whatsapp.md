# Spec: Contacto Directo por WhatsApp

## Descripción Funcional

El módulo de Contacto WhatsApp permite a los usuarios contactar directamente al publicador de un reporte a través de WhatsApp, la plataforma de mensajería más utilizada en Colombia. Se proporciona un botón destacado en la vista de detalle del reporte que abre WhatsApp con un mensaje prellenado contextualizado.

El flujo es simple y directo: usuario hace clic en el botón → se abre WhatsApp → mensaje prellenado con información relevante (nombre de mascota, ubicación, tipo de reporte).

---

## Entidades Involucradas

### Contacto WhatsApp
- **Número de Teléfono del Publicador**: Formato E.164 (ej: +573101234567)
- **Nombre de Mascota**: Texto (ej: "Bruno")
- **Tipo de Reporte**: PERDIDO o ENCONTRADO
- **Ubicación**: Dirección descriptiva (ej: "Centro Histórico")
- **ID del Reporte**: UUID (para incluir en URL)
- **Mensaje Prellenado**: Texto generado dinámicamente

### Mensaje Prellenado (Ejemplo)
```
Hola, estoy viendo tu reporte sobre Bruno (Perro - Perdido) en Centro Histórico.
Tengo información que podría ayudar. ¿Podemos hablar?
```

---

## Reglas de Negocio

1. **Validación de Número**:
   - El número debe estar almacenado en formato E.164 (ej: +573101234567)
   - Si el número no es válido, el botón está deshabilitado con tooltip de error
   - Se valida en backend que sea un número colombiano (código +57) o válido internacionalmente

2. **Mensaje Prellenado**:
   - Debe ser amigable, breve y contextualizado
   - Incluye nombre de mascota, tipo (Perro/Gato), estado (Perdido/Encontrado), ubicación
   - No supera 300 caracteres para asegurar que se envíe completamente
   - Se URL-encoda correctamente para pasar como parámetro en `wa.me/`

3. **Privacidad**:
   - El número de teléfono NO se muestra en la interfaz de la aplicación
   - Solo se usa para generar el link de WhatsApp
   - La aplicación nunca almacena o registra que el usuario hizo clic en contactar

4. **Disponibilidad**:
   - El botón solo está disponible si:
     - El reporte está en estado ACTIVO
     - El teléfono del publicador es válido
     - El usuario no es el propietario del reporte (no puede contactarse a sí mismo)

5. **Link de Compartición**:
   - Al hacer clic, se genera un link `https://wa.me/[numero]?text=[mensaje_encodeado]`
   - Si el usuario tiene WhatsApp Web abierto, se abre en esa pestaña
   - Si tiene la app de WhatsApp instalada en el dispositivo, se abre en la app

---

## Criterios de Aceptación

### CA1: Botón "Contactar por WhatsApp"
- [ ] El botón es visible en la vista de detalle del reporte
- [ ] Está prominentemente posicionado (arriba del área de características)
- [ ] Color de fondo es verde WhatsApp (#25D366)
- [ ] Icono de chat o WhatsApp acompaña el texto
- [ ] Texto del botón: "Contactar por WhatsApp"
- [ ] El botón es responsive y se ve bien en mobile y desktop

### CA2: Mensaje Prellenado
- [ ] Al hacer clic en el botón, se abre WhatsApp (web o app)
- [ ] El campo de mensaje está prellenado con:
  ```
  Hola, estoy interesado en tu reporte sobre [NOMBRE] ([TIPO] - [ESTADO]) 
  en [UBICACIÓN]. ¿Podemos hablar más al respecto?
  ```
- [ ] El mensaje es breve y amigable
- [ ] El mensaje incluye contexto suficiente para que el publicador entienda de qué reporte se trata

### CA3: Generación de Link
- [ ] El link usa el formato correcto: `https://wa.me/[numero_sin_+]?text=[mensaje_urlencodeado]`
- [ ] El número incluye código de país sin el símbolo +
- [ ] El mensaje se URL-encoda correctamente (espacios, caracteres especiales)

### CA4: Seguridad y Privacidad
- [ ] El número de teléfono nunca aparece en la UI
- [ ] No hay registro de log que muestre números de teléfono en la consola del navegador
- [ ] Los datos de contacto se cumplen con GDPR / Habeas Data colombiano

### CA5: Casos de Borde
- [ ] Si el número del publicador es inválido, el botón está deshabilitado
- [ ] Si el reporte está marcado como RESUELTO, el botón sigue funcionando pero con tooltip: "Reporte resuelto"
- [ ] Si el usuario está viendo su propio reporte, el botón no aparece
- [ ] Si el dispositivo no tiene WhatsApp instalado, se abre WhatsApp Web (navegador)

### CA6: Compatibilidad
- [ ] Funciona en iOS (abre la app de WhatsApp o WhatsApp Web)
- [ ] Funciona en Android (abre la app de WhatsApp o WhatsApp Web)
- [ ] Funciona en desktop (abre WhatsApp Web)

### CA7: Fallback
- [ ] Si WhatsApp no está disponible, se muestra un botón secundario "Copiar Número" que copia el teléfono al portapapeles
- [ ] Se muestra notificación: "Número copiado. Abre WhatsApp y pégalo manualmente."

---

## Notas Técnicas

- Usar librería `wa-click` o construir link manualmente con `https://wa.me/[numero]?text=[mensaje]`
- El número debe estar en formato E.164: +[código_país][número] sin espacios ni guiones
- URL-encodar el mensaje: reemplazar espacios con %20, caracteres especiales según estándar de URL
- La librería `encodeURIComponent()` en JavaScript codifica correctamente para URLs
- No se require ninguna API de WhatsApp (no es WhatsApp Business API), solo el link estándar `wa.me`
