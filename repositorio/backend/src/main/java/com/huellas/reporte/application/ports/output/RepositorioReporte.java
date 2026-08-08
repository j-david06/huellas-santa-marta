package com.huellas.reporte.application.ports.output;

import com.huellas.reporte.domain.Reporte;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface RepositorioReporte {
    Reporte guardar(Reporte reporte);
    Optional<Reporte> obtenerPorId(UUID id);
    List<Reporte> listarActivos(int page, int size);
    List<Reporte> buscarPorTexto(String query, int page, int size);
    List<Reporte> obtenerPorUbicacion(Double latitud, Double longitud, Integer radiusKm);
    void eliminar(UUID id);
}
