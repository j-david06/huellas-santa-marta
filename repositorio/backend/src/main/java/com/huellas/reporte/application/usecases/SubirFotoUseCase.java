package com.huellas.reporte.application.usecases;

import com.huellas.reporte.application.ports.input.SubirFotoPort;
import com.huellas.reporte.application.ports.output.FotoStoragePort;
import com.huellas.reporte.domain.FotoInvalidaException;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class SubirFotoUseCase implements SubirFotoPort {

    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"};
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"};

    private final FotoStoragePort fotoStoragePort;

    public SubirFotoUseCase(FotoStoragePort fotoStoragePort) {
        this.fotoStoragePort = fotoStoragePort;
    }

    @Override
    public SubirFotoResult subirFoto(SubirFotoCommand comando) {
        // Validar tamaño
        if (comando.contenido().length > MAX_SIZE_BYTES) {
            throw new FotoInvalidaException("La foto no debe exceder 5MB");
        }

        // Validar tipo MIME
        if (!isAllowedMimeType(comando.contentType())) {
            throw new FotoInvalidaException("Tipo de archivo no permitido. Solo JPG, PNG o WebP");
        }

        // Extraer extensión del nombre original
        String extension = extractExtension(comando.nombreOriginal());
        if (!isAllowedExtension(extension)) {
            throw new FotoInvalidaException("Extensión no permitida. Solo .jpg, .jpeg, .png o .webp");
        }

        // Generar nombre único: UUID + extensión
        String nombreArchivo = UUID.randomUUID().toString() + extension;

        // Guardar en storage
        String url = fotoStoragePort.guardarFoto(comando.contenido(), nombreArchivo);

        return new SubirFotoResult(url);
    }

    private boolean isAllowedMimeType(String contentType) {
        if (contentType == null) return false;
        for (String allowed : ALLOWED_TYPES) {
            if (contentType.equalsIgnoreCase(allowed)) {
                return true;
            }
        }
        return false;
    }

    private boolean isAllowedExtension(String extension) {
        if (extension == null || extension.isEmpty()) return false;
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (extension.equalsIgnoreCase(allowed)) {
                return true;
            }
        }
        return false;
    }

    private String extractExtension(String filename) {
        if (filename == null || filename.isEmpty()) return "";
        int lastDot = filename.lastIndexOf('.');
        if (lastDot > 0) {
            return filename.substring(lastDot);
        }
        return "";
    }
}
