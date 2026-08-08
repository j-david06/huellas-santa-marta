package com.huellas.reporte.domain;

public enum Size {
    PEQUEÑO("Pequeño"),
    MEDIANO("Mediano"),
    GRANDE("Grande");

    private final String displayName;

    Size(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
