package com.huellas.reporte.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {
    private UUID id;
    private AnimalType tipoAnimal;
    private ReportStatus estado;
    private ReportLifecycleStatus reportStatus;
    private List<Foto> fotos;
    private Ubicacion ubicacion;
    private String color;
    private String raza;
    private Size tamaño;
    private Sex sexo;
    private String señasParticulares;
    private String descripcion;
    private LocalDateTime fechaAvistamiento;
    private DatosContacto publicador;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimaActualizacion;
    private Integer cantidadComentarios;
    private Integer cantidadCoincidencias;

    public Reporte(AnimalType tipoAnimal,
                   ReportStatus estado,
                   String color,
                   Size tamaño,
                   Sex sexo,
                   String descripcion,
                   LocalDateTime fechaAvistamiento,
                   Ubicacion ubicacion,
                   DatosContacto publicador,
                   List<Foto> fotos,
                   String raza,
                   String señasParticulares) {
        this.id = UUID.randomUUID();
        this.tipoAnimal = tipoAnimal;
        this.estado = estado;
        this.reportStatus = ReportLifecycleStatus.ACTIVO;
        this.color = color;
        this.raza = raza;
        this.tamaño = tamaño;
        this.sexo = sexo;
        this.señasParticulares = señasParticulares;
        this.descripcion = descripcion;
        this.fechaAvistamiento = fechaAvistamiento;
        this.ubicacion = ubicacion;
        this.publicador = publicador;
        this.fotos = fotos != null ? fotos : new ArrayList<>();
        this.fechaCreacion = LocalDateTime.now();
        this.ultimaActualizacion = LocalDateTime.now();
        this.cantidadComentarios = 0;
        this.cantidadCoincidencias = 0;

        validar();
    }

    private void validar() {
        if (tipoAnimal == null) {
            throw new IllegalArgumentException("Tipo de animal es obligatorio");
        }
        if (estado == null) {
            throw new IllegalArgumentException("Estado del reporte es obligatorio");
        }
        if (color == null || color.trim().isEmpty()) {
            throw new IllegalArgumentException("Color es obligatorio");
        }
        if (descripcion == null || descripcion.trim().isEmpty()) {
            throw new IllegalArgumentException("Descripción es obligatoria");
        }
        if (descripcion.length() > 1000) {
            throw new IllegalArgumentException("Descripción no debe exceder 1000 caracteres");
        }
        if (tamaño == null) {
            throw new IllegalArgumentException("Tamaño es obligatorio");
        }
        if (sexo == null) {
            throw new IllegalArgumentException("Sexo es obligatorio");
        }
        if (fechaAvistamiento == null) {
            throw new IllegalArgumentException("Fecha de avistamiento es obligatoria");
        }
        if (fotos == null || fotos.isEmpty()) {
            throw new IllegalArgumentException("Al menos una foto es obligatoria");
        }
        if (fotos.size() > 5) {
            throw new IllegalArgumentException("Máximo 5 fotos permitidas");
        }
        if (ubicacion == null) {
            throw new IllegalArgumentException("Ubicación es obligatoria");
        }
        if (publicador == null) {
            throw new IllegalArgumentException("Datos de contacto son obligatorios");
        }

        ubicacion.validar();
        publicador.validar();
    }

    public void marcarComoResuelto() {
        if (this.reportStatus == ReportLifecycleStatus.RESUELTO) {
            throw new IllegalArgumentException("El reporte ya está marcado como resuelto");
        }
        this.reportStatus = ReportLifecycleStatus.RESUELTO;
        this.ultimaActualizacion = LocalDateTime.now();
    }

    public void actualizar(String descripcion, String señasParticulares) {
        if (descripcion != null && !descripcion.trim().isEmpty()) {
            if (descripcion.length() > 1000) {
                throw new IllegalArgumentException("Descripción no debe exceder 1000 caracteres");
            }
            this.descripcion = descripcion;
        }
        if (señasParticulares != null) {
            this.señasParticulares = señasParticulares;
        }
        this.ultimaActualizacion = LocalDateTime.now();
    }
}
