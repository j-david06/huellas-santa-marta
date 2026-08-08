package com.huellas.reporte.adapters.input.rest;

import com.huellas.reporte.application.ports.input.ReporteCreationPort;
import com.huellas.reporte.application.ports.input.ReporteQueryPort;
import com.huellas.reporte.application.ports.input.ReporteUpdatePort;
import com.huellas.reporte.adapters.input.rest.dto.CrearReporteRequest;
import com.huellas.reporte.adapters.input.rest.dto.ActualizarReporteRequest;
import com.huellas.reporte.adapters.input.rest.dto.ReporteResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/v1/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {
    
    private final ReporteCreationPort creationPort;
    private final ReporteQueryPort queryPort;
    private final ReporteUpdatePort updatePort;
    
    public ReporteController(ReporteCreationPort creationPort,
                           ReporteQueryPort queryPort,
                           ReporteUpdatePort updatePort) {
        this.creationPort = creationPort;
        this.queryPort = queryPort;
        this.updatePort = updatePort;
    }
    
    @PostMapping
    public ResponseEntity<?> crearReporte(@RequestBody CrearReporteRequest request) {
        try {
            var comando = new ReporteCreationPort.CrearReporteCommand(
                request.getTipoAnimal(),
                request.getEstado(),
                request.getColor(),
                request.getTamaño(),
                request.getSexo(),
                request.getDescripcion(),
                request.getFechaAvistamiento(),
                request.getLatitud(),
                request.getLongitud(),
                request.getDireccion(),
                request.getBarrio(),
                request.getNombreContacto(),
                request.getTelefonoContacto(),
                request.getEmailContacto(),
                request.getRaza(),
                request.getSenasParticulares(),
                request.getFotosUrls()
            );
            UUID reporteId = creationPort.crearReporte(comando);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new IdResponse(reporteId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al crear reporte: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerReporte(@PathVariable UUID id) {
        var reporte = queryPort.obtenerPorId(id);
        return ResponseEntity.ok(ReporteResponse.from(reporte));
    }
    
    @GetMapping
    public ResponseEntity<?> listarReportes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            var reportes = queryPort.listarActivos(page, size);
            var response = reportes.stream()
                    .map(ReporteResponse::from)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> actualizarReporte(
            @PathVariable UUID id,
            @RequestBody ActualizarReporteRequest request) {
        var comando = new ReporteUpdatePort.ActualizarReporteCommand(
            request.getDescripcion(),
            request.getSenasParticulares()
        );
        updatePort.actualizarReporte(id, comando);
        var reporte = queryPort.obtenerPorId(id);
        return ResponseEntity.ok(ReporteResponse.from(reporte));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReporte(@PathVariable UUID id) {
        try {
            updatePort.eliminarReporte(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    record IdResponse(UUID id) {}
    record ErrorResponse(String mensaje) {}
}
