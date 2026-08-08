package com.huellas.reporte.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Ubicacion {
    private Double latitud;
    private Double longitud;
    private String direccion;
    private String barrio;

    public void validar() {
        if (latitud == null || longitud == null) {
            throw new IllegalArgumentException("Latitud y longitud son obligatorias");
        }
        if (latitud < -90 || latitud > 90) {
            throw new IllegalArgumentException("Latitud debe estar entre -90 y 90");
        }
        if (longitud < -180 || longitud > 180) {
            throw new IllegalArgumentException("Longitud debe estar entre -180 y 180");
        }
        // Validar que esté cercana a Santa Marta (11.2456, -74.1988) con buffer de 5km
        double maxDistancia = 0.045; // aproximadamente 5km en grados
        if (Math.abs(latitud - 11.2456) > maxDistancia || Math.abs(longitud - (-74.1988)) > maxDistancia) {
            throw new IllegalArgumentException("Ubicación debe estar dentro de Santa Marta (+5km buffer)");
        }
    }
}
