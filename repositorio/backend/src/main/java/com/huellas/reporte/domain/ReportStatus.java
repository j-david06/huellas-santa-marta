package com.huellas.reporte.domain;

public enum ReportStatus {
    PERDIDO("Perdido"),
    ENCONTRADO("Encontrado");

    private final String displayName;

    ReportStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
