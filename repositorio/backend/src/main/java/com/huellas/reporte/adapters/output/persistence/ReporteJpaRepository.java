package com.huellas.reporte.adapters.output.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReporteJpaRepository extends JpaRepository<ReporteEntity, UUID> {

    @Query("SELECT r FROM ReporteEntity r WHERE r.reportStatus = 'ACTIVO' ORDER BY r.fechaCreacion DESC")
    List<ReporteEntity> findAllActivos(Pageable pageable);

    @Query("SELECT r FROM ReporteEntity r WHERE r.reportStatus = 'ACTIVO' AND " +
            "(LOWER(r.color) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(r.raza) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(r.descripcion) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(r.barrio) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY r.fechaCreacion DESC")
    List<ReporteEntity> findByTexto(@Param("query") String query, Pageable pageable);

    @Query(value = "SELECT * FROM reportes r WHERE r.report_status = 'ACTIVO' AND " +
            "earth_distance(ll_to_earth(:latitud, :longitud), ll_to_earth(r.latitud, r.longitud)) <= :radiusKm * 1000 " +
            "ORDER BY r.fecha_creacion DESC", nativeQuery = true)
    List<ReporteEntity> findByUbicacion(@Param("latitud") Double latitud,
                                        @Param("longitud") Double longitud,
                                        @Param("radiusKm") Integer radiusKm);
}
