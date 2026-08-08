package com.huellas.reporte.domain;

public enum Sex {
    MACHO("Macho"),
    HEMBRA("Hembra"),
    DESCONOCIDO("Desconocido");

    private final String displayName;

    Sex(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
