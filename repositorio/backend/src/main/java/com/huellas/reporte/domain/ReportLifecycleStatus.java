package com.huellas.reporte.domain;

public enum ReportLifecycleStatus {
    ACTIVO("Activo"),
    RESUELTO("Resuelto"),
    ARCHIVADO("Archivado");

    private final String displayName;

    ReportLifecycleStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
