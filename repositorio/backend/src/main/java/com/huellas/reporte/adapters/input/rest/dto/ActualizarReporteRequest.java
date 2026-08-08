package com.huellas.reporte.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarReporteRequest {
    private String descripcion;
    private String senasParticulares;
}
