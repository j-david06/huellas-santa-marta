package com.huellas.reporte.application.usecases;

import com.huellas.reporte.application.ports.input.ReporteQueryPort;
import com.huellas.reporte.application.ports.output.RepositorioReporte;
import com.huellas.reporte.domain.Reporte;
import com.huellas.reporte.domain.ReporteNoEncontradoException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ReporteQueryUseCase implements ReporteQueryPort {
    private final RepositorioReporte repositorio;

    public ReporteQueryUseCase(RepositorioReporte repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Reporte obtenerPorId(UUID id) {
        return repositorio.obtenerPorId(id)
                .orElseThrow(() -> new ReporteNoEncontradoException("Reporte no encontrado con ID: " + id));
    }

    @Override
    public List<Reporte> listarActivos(int page, int size) {
        return repositorio.listarActivos(page, size);
    }

    @Override
    public List<Reporte> buscarPorTexto(String query, int page, int size) {
        return repositorio.buscarPorTexto(query, page, size);
    }

    @Override
    public List<Reporte> obtenerPorUbicacion(Double latitud, Double longitud, Integer radiusKm) {
        return repositorio.obtenerPorUbicacion(latitud, longitud, radiusKm);
    }
}
