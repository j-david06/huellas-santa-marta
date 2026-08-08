package com.huellas.reporte.domain;

public class ReporteNoEncontradoException extends RuntimeException {
    public ReporteNoEncontradoException(String message) {
        super(message);
    }

    public ReporteNoEncontradoException(String message, Throwable cause) {
        super(message, cause);
    }
}
