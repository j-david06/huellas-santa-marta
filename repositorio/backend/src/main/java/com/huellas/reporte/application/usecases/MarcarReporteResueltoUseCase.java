package com.huellas.reporte.application.usecases;

import com.huellas.reporte.application.ports.output.RepositorioReporte;
import com.huellas.reporte.domain.Reporte;
import com.huellas.reporte.domain.ReporteNoEncontradoException;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class MarcarReporteResueltoUseCase {
    private final RepositorioReporte repositorio;

    public MarcarReporteResueltoUseCase(RepositorioReporte repositorio) {
        this.repositorio = repositorio;
    }

    public void marcarResuelto(UUID id, String comentario) {
        Reporte reporte = repositorio.obtenerPorId(id)
                .orElseThrow(() -> new ReporteNoEncontradoException("Reporte no encontrado con ID: " + id));

        reporte.marcarComoResuelto();
        repositorio.guardar(reporte);
    }
}
