package com.huellas.reporte.adapters.output.persistence;

import com.huellas.reporte.domain.AnimalType;
import com.huellas.reporte.domain.ReportLifecycleStatus;
import com.huellas.reporte.domain.ReportStatus;
import com.huellas.reporte.domain.Sex;
import com.huellas.reporte.domain.Size;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "reportes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReporteEntity {
    @Id
    private UUID id;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_animal", nullable = false)
    private AnimalType tipoAnimal;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private ReportStatus estado;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "report_status", nullable = false)
    private ReportLifecycleStatus reportStatus;

    @Column(nullable = false)
    private String color;

    @Column(nullable = true)
    private String raza;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "tamaño", nullable = false)
    private Size tamaño;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Enumerated(EnumType.STRING)
    @Column(name = "sexo", nullable = false)
    private Sex sexo;

    @Column(name = "señas_particulares", columnDefinition = "TEXT")
    private String señasParticulares;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(name = "fecha_avistamiento", nullable = false)
    private LocalDateTime fechaAvistamiento;

    // Ubicación
    @Column(nullable = false)
    private Double latitud;

    @Column(nullable = false)
    private Double longitud;

    @Column(nullable = true)
    private String direccion;

    @Column(nullable = true)
    private String barrio;

    // Datos de contacto del publicador
    @Column(name = "nombre_contacto", nullable = false)
    private String nombreContacto;

    @Column(name = "telefono_contacto", nullable = false)
    private String telefonoContacto;

    @Column(name = "email_contacto", nullable = true)
    private String emailContacto;

    @Column(name = "usuario_id")
    private UUID usuarioId;

    // Estadísticas
    @Column(name = "cantidad_comentarios")
    private Integer cantidadComentarios = 0;

    @Column(name = "cantidad_coincidencias")
    private Integer cantidadCoincidencias = 0;

    // Timestamps
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "ultima_actualizacion", nullable = false)
    private LocalDateTime ultimaActualizacion;

    // Relación con fotos
    @OneToMany(mappedBy = "reporte", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FotoEntity> fotos = new ArrayList<>();
}
