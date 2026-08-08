package com.huellas.reporte.application.ports.input;

import com.huellas.reporte.domain.Reporte;
import java.util.UUID;

public interface ReporteQueryPort {
    Reporte obtenerPorId(UUID id);
    java.util.List<Reporte> listarActivos(int page, int size);
    java.util.List<Reporte> buscarPorTexto(String query, int page, int size);
    java.util.List<Reporte> obtenerPorUbicacion(Double latitud, Double longitud, Integer radiusKm);
}
