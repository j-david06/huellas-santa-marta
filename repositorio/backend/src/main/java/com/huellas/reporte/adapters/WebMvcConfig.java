package com.huellas.reporte.adapters;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.uploads.path:./uploads}")
    private String uploadsPath;

    /**
     * Configura CORS globalmente para todos los controladores.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * Configura el servidor para servir archivos de la carpeta uploads/ como recursos estáticos.
     * Esto permite que el navegador pueda acceder a /uploads/nombre-archivo.jpg
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convertir ruta configurada a absoluta para garantizar consistencia
        String absoluteUploadsPath = Paths.get(uploadsPath)
                .toAbsolutePath()
                .toUri()
                .toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(absoluteUploadsPath)
                .setCachePeriod(3600); // Cache de 1 hora
    }
}
