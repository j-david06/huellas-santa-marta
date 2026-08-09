package com.huellas.reporte.adapters.output.storage;

import com.huellas.reporte.application.ports.output.FotoStoragePort;
import com.huellas.reporte.domain.FotoInvalidaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class LocalFotoStorageAdapter implements FotoStoragePort {

    @Value("${app.uploads.path:./uploads}")
    private String uploadsPath;

    @Override
    public String guardarFoto(byte[] contenido, String nombreArchivo) {
        try {
            // Crear directorio si no existe - convertir a ruta absoluta para garantizar consistencia
            Path uploadDir = Paths.get(uploadsPath).toAbsolutePath();
            Files.createDirectories(uploadDir);

            // Guardar archivo
            Path filePath = uploadDir.resolve(nombreArchivo);
            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                fos.write(contenido);
                fos.flush();
            }

            // Retornar URL relativa accesible
            return "/uploads/" + nombreArchivo;

        } catch (IOException e) {
            throw new FotoInvalidaException("Error al guardar la foto: " + e.getMessage(), e);
        }
    }
}
