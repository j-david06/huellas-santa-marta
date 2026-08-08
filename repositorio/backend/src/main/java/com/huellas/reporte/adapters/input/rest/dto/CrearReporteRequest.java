package com.huellas.reporte.adapters.input.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearReporteRequest {
    private String tipoAnimal;
    private String estado;
    private String color;
    private String tamaño;
    private String sexo;
    private String descripcion;
    private String fechaAvistamiento;
    private Double latitud;
    private Double longitud;
    private String direccion;
    private String barrio;
    private String nombreContacto;
    private String telefonoContacto;
    private String emailContacto;
    private String raza;
    private String senasParticulares;
    private List<String> fotosUrls;
}
