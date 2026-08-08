package com.huellas.reporte.application.ports.input;

import com.huellas.reporte.domain.Reporte;
import java.util.UUID;

public interface ReporteCreationPort {
    UUID crearReporte(CrearReporteCommand comando);
    
    record CrearReporteCommand(
        String tipoAnimal,
        String estado,
        String color,
        String tamaño,
        String sexo,
        String descripcion,
        String fechaAvistamiento,
        Double latitud,
        Double longitud,
        String direccion,
        String barrio,
        String nombreContacto,
        String telefonoContacto,
        String emailContacto,
        String raza,
        String señasParticulares,
        java.util.List<String> fotosUrls
    ) {}
}
