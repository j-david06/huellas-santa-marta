package com.huellas.reporte.adapters.input.rest;

import com.huellas.reporte.application.ports.input.SubirFotoPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/reportes/fotos")
public class FotoController {

    private final SubirFotoPort subirFotoPort;

    public FotoController(SubirFotoPort subirFotoPort) {
        this.subirFotoPort = subirFotoPort;
    }

    /**
     * Endpoint para subir una foto.
     * @param foto archivo multipart
     * @return URL donde quedó guardada la foto
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> subirFoto(@RequestParam("foto") MultipartFile foto) throws IOException {
        // Validar que el archivo no sea vacío
        if (foto.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "BAD_REQUEST");
            error.put("message", "La foto no puede estar vacía");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Crear comando
        SubirFotoPort.SubirFotoCommand comando = new SubirFotoPort.SubirFotoCommand(
                foto.getBytes(),
                foto.getOriginalFilename(),
                foto.getContentType()
        );

        // Ejecutar use case
        SubirFotoPort.SubirFotoResult resultado = subirFotoPort.subirFoto(comando);

        // Retornar resultado
        Map<String, String> response = new HashMap<>();
        response.put("url", resultado.url());
        return ResponseEntity.ok(response);
    }
}
