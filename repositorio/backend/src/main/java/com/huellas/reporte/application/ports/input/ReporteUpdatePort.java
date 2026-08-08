package com.huellas.reporte.application.ports.input;

import java.util.UUID;

public interface ReporteUpdatePort {
    void actualizarReporte(UUID id, ActualizarReporteCommand comando);
    void marcarComoResuelto(UUID id, String comentario);
    void eliminarReporte(UUID id);
    
    record ActualizarReporteCommand(
        String descripcion,
        String señasParticulares
    ) {}
}
