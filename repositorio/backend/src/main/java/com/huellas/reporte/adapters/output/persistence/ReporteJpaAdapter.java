package com.huellas.reporte.adapters.output.persistence;

import com.huellas.reporte.application.ports.output.RepositorioReporte;
import com.huellas.reporte.domain.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ReporteJpaAdapter implements RepositorioReporte {
    private final ReporteJpaRepository repository;

    public ReporteJpaAdapter(ReporteJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Reporte guardar(Reporte reporte) {
        ReporteEntity entity = toEntity(reporte);
        ReporteEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Reporte> obtenerPorId(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Reporte> listarActivos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAllActivos(pageable).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Reporte> buscarPorTexto(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByTexto(query, pageable).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Reporte> obtenerPorUbicacion(Double latitud, Double longitud, Integer radiusKm) {
        return repository.findByUbicacion(latitud, longitud, radiusKm).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminar(UUID id) {
        repository.deleteById(id);
    }

    private ReporteEntity toEntity(Reporte reporte) {
        ReporteEntity entity = new ReporteEntity();
        entity.setId(reporte.getId());
        entity.setTipoAnimal(reporte.getTipoAnimal());
        entity.setEstado(reporte.getEstado());
        entity.setReportStatus(reporte.getReportStatus());
        entity.setColor(reporte.getColor());
        entity.setRaza(reporte.getRaza());
        entity.setTamaño(reporte.getTamaño());
        entity.setSexo(reporte.getSexo());
        entity.setSeñasParticulares(reporte.getSeñasParticulares());
        entity.setDescripcion(reporte.getDescripcion());
        entity.setFechaAvistamiento(reporte.getFechaAvistamiento());
        entity.setLatitud(reporte.getUbicacion().getLatitud());
        entity.setLongitud(reporte.getUbicacion().getLongitud());
        entity.setDireccion(reporte.getUbicacion().getDireccion());
        entity.setBarrio(reporte.getUbicacion().getBarrio());
        entity.setNombreContacto(reporte.getPublicador().getNombre());
        entity.setTelefonoContacto(reporte.getPublicador().getTelefono());
        entity.setEmailContacto(reporte.getPublicador().getEmail());
        entity.setUsuarioId(reporte.getPublicador().getUsuarioId());
        entity.setCantidadComentarios(reporte.getCantidadComentarios());
        entity.setCantidadCoincidencias(reporte.getCantidadCoincidencias());
        entity.setFechaCreacion(reporte.getFechaCreacion());
        entity.setUltimaActualizacion(reporte.getUltimaActualizacion());

        if (reporte.getFotos() != null) {
            List<FotoEntity> fotoEntities = reporte.getFotos().stream()
                    .map(foto -> {
                        FotoEntity fotoEntity = new FotoEntity();
                        fotoEntity.setId(UUID.randomUUID());
                        fotoEntity.setReporte(entity);
                        fotoEntity.setUrl(foto.getUrl());
                        fotoEntity.setOrden(foto.getOrden());
                        fotoEntity.setUploadedAt(foto.getUploadedAt());
                        return fotoEntity;
                    })
                    .collect(Collectors.toList());
            entity.setFotos(fotoEntities);
        }

        return entity;
    }

    private Reporte toDomain(ReporteEntity entity) {
        List<Foto> fotos = entity.getFotos() != null ? entity.getFotos().stream()
                .map(f -> new Foto(f.getId(), f.getUrl(), f.getOrden(), f.getUploadedAt()))
                .collect(Collectors.toList())
                : new ArrayList<>();

        Ubicacion ubicacion = new Ubicacion(
                entity.getLatitud(),
                entity.getLongitud(),
                entity.getDireccion(),
                entity.getBarrio()
        );

        DatosContacto datosContacto = new DatosContacto(
                entity.getNombreContacto(),
                entity.getTelefonoContacto(),
                entity.getEmailContacto(),
                entity.getUsuarioId()
        );

        Reporte reporte = new Reporte(
                entity.getTipoAnimal(),
                entity.getEstado(),
                entity.getColor(),
                entity.getTamaño(),
                entity.getSexo(),
                entity.getDescripcion(),
                entity.getFechaAvistamiento(),
                ubicacion,
                datosContacto,
                fotos,
                entity.getRaza(),
                entity.getSeñasParticulares()
        );

        // Asignar propiedades post-creación
        reporte = new Reporte(
                entity.getId(),
                entity.getTipoAnimal(),
                entity.getEstado(),
                entity.getReportStatus(),
                fotos,
                ubicacion,
                entity.getColor(),
                entity.getRaza(),
                entity.getTamaño(),
                entity.getSexo(),
                entity.getSeñasParticulares(),
                entity.getDescripcion(),
                entity.getFechaAvistamiento(),
                datosContacto,
                entity.getFechaCreacion(),
                entity.getUltimaActualizacion(),
                entity.getCantidadComentarios(),
                entity.getCantidadCoincidencias()
        );

        return reporte;
    }
}
