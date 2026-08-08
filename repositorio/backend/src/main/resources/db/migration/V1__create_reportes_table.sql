-- Create ENUM types for Reporte
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
CREATE TYPE animal_type AS ENUM ('PERRO', 'GATO');
CREATE TYPE report_status AS ENUM ('PERDIDO', 'ENCONTRADO');
CREATE TYPE report_lifecycle_status AS ENUM ('ACTIVO', 'RESUELTO', 'ARCHIVADO');
CREATE TYPE animal_size AS ENUM ('PEQUEÑO', 'MEDIANO', 'GRANDE');
CREATE TYPE animal_sex AS ENUM ('MACHO', 'HEMBRA', 'DESCONOCIDO');

-- Create reportes table
CREATE TABLE reportes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_animal animal_type NOT NULL,
    estado report_status NOT NULL,
    report_status report_lifecycle_status NOT NULL DEFAULT 'ACTIVO',
    color VARCHAR(255) NOT NULL,
    raza VARCHAR(255),
    tamaño animal_size NOT NULL,
    sexo animal_sex NOT NULL DEFAULT 'DESCONOCIDO',
    señas_particulares TEXT,
    descripcion TEXT NOT NULL,
    fecha_avistamiento TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Ubicación
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    direccion VARCHAR(255),
    barrio VARCHAR(255),
    
    -- Datos de contacto del publicador
    nombre_contacto VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(20) NOT NULL,
    email_contacto VARCHAR(255),
    usuario_id UUID,
    
    -- Estadísticas
    cantidad_comentarios INTEGER DEFAULT 0,
    cantidad_coincidencias INTEGER DEFAULT 0,
    
    -- Timestamps
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ck_latitud CHECK (latitud BETWEEN -90 AND 90),
    CONSTRAINT ck_longitud CHECK (longitud BETWEEN -180 AND 180)
);

-- Create indexes for better query performance
CREATE INDEX idx_reportes_estado ON reportes(estado);
CREATE INDEX idx_reportes_tipo_animal ON reportes(tipo_animal);
CREATE INDEX idx_reportes_report_status ON reportes(report_status);
CREATE INDEX idx_reportes_fecha_creacion ON reportes(fecha_creacion DESC);
CREATE INDEX idx_reportes_usuario_id ON reportes(usuario_id);
CREATE INDEX idx_reportes_ubicacion ON reportes USING GIST(
    ll_to_earth(latitud, longitud)
);

-- Create fotos table
CREATE TABLE fotos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporte_id UUID NOT NULL REFERENCES reportes(id) ON DELETE CASCADE,
    url VARCHAR(512) NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_orden CHECK (orden >= 0)
);

CREATE INDEX idx_fotos_reporte_id ON fotos(reporte_id);
CREATE INDEX idx_fotos_orden ON fotos(reporte_id, orden);
