package com.huellas.reporte.application.usecases;

import com.huellas.reporte.application.ports.input.ReporteCreationPort;
import com.huellas.reporte.application.ports.output.RepositorioReporte;
import com.huellas.reporte.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class CrearReporteUseCase implements ReporteCreationPort {
    private final RepositorioReporte repositorio;

    public CrearReporteUseCase(RepositorioReporte repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public UUID crearReporte(CrearReporteCommand comando) {
        validarComando(comando);

        // Convertir tipos y crear entidad de dominio
        AnimalType tipoAnimal = AnimalType.valueOf(comando.tipoAnimal());
        ReportStatus estado = ReportStatus.valueOf(comando.estado());
        Size tamaño = Size.valueOf(comando.tamaño());
        Sex sexo = Sex.valueOf(comando.sexo());

        // Parsear fecha
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime fechaAvistamiento = LocalDateTime.parse(comando.fechaAvistamiento(), formatter);

        // Crear valor objeto Ubicacion
        Ubicacion ubicacion = new Ubicacion(
                comando.latitud(),
                comando.longitud(),
                comando.direccion(),
                comando.barrio()
        );

        // Crear valor objeto DatosContacto
        DatosContacto datosContacto = new DatosContacto(
                comando.nombreContacto(),
                comando.telefonoContacto(),
                comando.emailContacto(),
                null // usuarioId
        );

        // Crear fotos
        List<Foto> fotos = new ArrayList<>();
        if (comando.fotosUrls() != null) {
            for (int i = 0; i < comando.fotosUrls().size(); i++) {
                fotos.add(new Foto(comando.fotosUrls().get(i), i));
            }
        }

        // Crear reporte (valida internamente)
        Reporte reporte = new Reporte(
                tipoAnimal,
                estado,
                comando.color(),
                tamaño,
                sexo,
                comando.descripcion(),
                fechaAvistamiento,
                ubicacion,
                datosContacto,
                fotos,
                comando.raza(),
                comando.señasParticulares()
        );

        // Guardar en repositorio
        Reporte reporteGuardado = repositorio.guardar(reporte);
        return reporteGuardado.getId();
    }

    private void validarComando(CrearReporteCommand comando) {
        if (comando.tipoAnimal() == null || comando.tipoAnimal().isEmpty()) {
            throw new IllegalArgumentException("Tipo de animal es obligatorio");
        }
        if (comando.estado() == null || comando.estado().isEmpty()) {
            throw new IllegalArgumentException("Estado es obligatorio");
        }
        if (comando.color() == null || comando.color().isEmpty()) {
            throw new IllegalArgumentException("Color es obligatorio");
        }
        if (comando.tamaño() == null || comando.tamaño().isEmpty()) {
            throw new IllegalArgumentException("Tamaño es obligatorio");
        }
        if (comando.sexo() == null || comando.sexo().isEmpty()) {
            throw new IllegalArgumentException("Sexo es obligatorio");
        }
        if (comando.descripcion() == null || comando.descripcion().isEmpty()) {
            throw new IllegalArgumentException("Descripción es obligatoria");
        }
        if (comando.fechaAvistamiento() == null || comando.fechaAvistamiento().isEmpty()) {
            throw new IllegalArgumentException("Fecha de avistamiento es obligatoria");
        }
        if (comando.latitud() == null || comando.longitud() == null) {
            throw new IllegalArgumentException("Ubicación (latitud/longitud) es obligatoria");
        }
        if (comando.nombreContacto() == null || comando.nombreContacto().isEmpty()) {
            throw new IllegalArgumentException("Nombre de contacto es obligatorio");
        }
        if (comando.telefonoContacto() == null || comando.telefonoContacto().isEmpty()) {
            throw new IllegalArgumentException("Teléfono de contacto es obligatorio");
        }
        if (comando.fotosUrls() == null || comando.fotosUrls().isEmpty()) {
            throw new IllegalArgumentException("Al menos una foto es obligatoria");
        }
    }
}
