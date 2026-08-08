package com.huellas.reporte.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DatosContacto {
    private String nombre;
    private String telefono; // Formato E.164: +573101234567
    private String email;
    private UUID usuarioId; // Referencia al usuario (si está autenticado)

    public void validar() {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("Nombre de contacto es obligatorio");
        }
        if (telefono == null || telefono.trim().isEmpty()) {
            throw new IllegalArgumentException("Teléfono de contacto es obligatorio");
        }
        validarFormatoE164();
    }

    private void validarFormatoE164() {
        // Formato E.164: +[1-9]{1-3}[0-9]{0,14}
        if (!telefono.matches("^\\+[1-9]\\d{1,14}$")) {
            throw new IllegalArgumentException("Teléfono debe estar en formato E.164 (ej: +573101234567)");
        }
    }
}
