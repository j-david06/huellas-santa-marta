package com.huellas.reporte.application.ports.output;

public interface FotoStoragePort {
    /**
     * Guarda un archivo de foto en el storage.
     * @param contenido bytes del archivo
     * @param nombreArchivo nombre único del archivo (ej. UUID.jpg)
     * @return ruta relativa para acceder al archivo (ej. /uploads/uuid.jpg)
     */
    String guardarFoto(byte[] contenido, String nombreArchivo);
}
