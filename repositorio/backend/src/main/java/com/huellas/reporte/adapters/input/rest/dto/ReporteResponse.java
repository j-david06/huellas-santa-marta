package com.huellas.reporte.adapters.input.rest.dto;

import com.huellas.reporte.domain.Reporte;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteResponse {
    private UUID id;
    private String tipoAnimal;
    private String estado;
    private String reportStatus;
    private String color;
    private String raza;
    private String tamaño;
    private String sexo;
    private String senasParticulares;
    private String descripcion;
    private LocalDateTime fechaAvistamiento;
    private Double latitud;
    private Double longitud;
    private String direccion;
    private String barrio;
    private String nombreContacto;
    private String emailContacto;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimaActualizacion;
    private Integer cantidadComentarios;
    private Integer cantidadCoincidencias;
    private List<String> fotosUrls;
    
    public static ReporteResponse from(Reporte reporte) {
        ReporteResponse response = new ReporteResponse();
        response.setId(reporte.getId());
        response.setTipoAnimal(reporte.getTipoAnimal().name());
        response.setEstado(reporte.getEstado().name());
        response.setReportStatus(reporte.getReportStatus().name());
        response.setColor(reporte.getColor());
        response.setRaza(reporte.getRaza());
        response.setTamaño(reporte.getTamaño().name());
        response.setSexo(reporte.getSexo().name());
        response.setSenasParticulares(reporte.getSeñasParticulares());
        response.setDescripcion(reporte.getDescripcion());
        response.setFechaAvistamiento(reporte.getFechaAvistamiento());
        response.setLatitud(reporte.getUbicacion().getLatitud());
        response.setLongitud(reporte.getUbicacion().getLongitud());
        response.setDireccion(reporte.getUbicacion().getDireccion());
        response.setBarrio(reporte.getUbicacion().getBarrio());
        response.setNombreContacto(reporte.getPublicador().getNombre());
        response.setEmailContacto(reporte.getPublicador().getEmail());
        response.setFechaCreacion(reporte.getFechaCreacion());
        response.setUltimaActualizacion(reporte.getUltimaActualizacion());
        response.setCantidadComentarios(reporte.getCantidadComentarios());
        response.setCantidadCoincidencias(reporte.getCantidadCoincidencias());
        response.setFotosUrls(reporte.getFotos().stream()
                .map(f -> f.getUrl()).toList());
        return response;
    }
}
