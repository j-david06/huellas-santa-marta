package com.huellas.reporte.domain;

public class FotoInvalidaException extends RuntimeException {
    public FotoInvalidaException(String message) {
        super(message);
    }

    public FotoInvalidaException(String message, Throwable cause) {
        super(message, cause);
    }
}
