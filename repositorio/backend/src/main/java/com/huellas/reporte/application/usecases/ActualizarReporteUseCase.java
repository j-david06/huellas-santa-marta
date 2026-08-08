package com.huellas.reporte.application.usecases;

import com.huellas.reporte.application.ports.input.ReporteUpdatePort;
import com.huellas.reporte.application.ports.output.RepositorioReporte;
import com.huellas.reporte.domain.Reporte;
import com.huellas.reporte.domain.ReporteNoEncontradoException;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class ActualizarReporteUseCase implements ReporteUpdatePort {
    private final RepositorioReporte repositorio;

    public ActualizarReporteUseCase(RepositorioReporte repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public void actualizarReporte(UUID id, ActualizarReporteCommand comando) {
        Reporte reporte = repositorio.obtenerPorId(id)
                .orElseThrow(() -> new ReporteNoEncontradoException("Reporte no encontrado con ID: " + id));

        reporte.actualizar(comando.descripcion(), comando.señasParticulares());
        repositorio.guardar(reporte);
    }

    @Override
    public void marcarComoResuelto(UUID id, String comentario) {
        Reporte reporte = repositorio.obtenerPorId(id)
                .orElseThrow(() -> new ReporteNoEncontradoException("Reporte no encontrado con ID: " + id));

        reporte.marcarComoResuelto();
        repositorio.guardar(reporte);
    }

    @Override
    public void eliminarReporte(UUID id) {
        Reporte reporte = repositorio.obtenerPorId(id)
                .orElseThrow(() -> new ReporteNoEncontradoException("Reporte no encontrado con ID: " + id));

        repositorio.eliminar(id);
    }
}
