package com.huellas.reporte.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Foto {
    private UUID id;
    private String url;
    private Integer orden;
    private LocalDateTime uploadedAt;

    public Foto(String url, Integer orden) {
        this.id = UUID.randomUUID();
        this.url = url;
        this.orden = orden;
        this.uploadedAt = LocalDateTime.now();
    }
}
