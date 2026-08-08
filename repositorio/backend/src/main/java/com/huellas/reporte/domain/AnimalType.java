package com.huellas.reporte.domain;

public enum AnimalType {
    PERRO("Perro"),
    GATO("Gato");

    private final String displayName;

    AnimalType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
