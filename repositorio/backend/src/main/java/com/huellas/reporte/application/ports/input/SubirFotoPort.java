package com.huellas.reporte.application.ports.input;

public interface SubirFotoPort {
    SubirFotoResult subirFoto(SubirFotoCommand comando);

    record SubirFotoCommand(
            byte[] contenido,
            String nombreOriginal,
            String contentType
    ) {}

    record SubirFotoResult(
            String url
    ) {}
}
