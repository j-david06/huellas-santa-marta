// Enums
export enum AnimalType {
  PERRO = 'PERRO',
  GATO = 'GATO',
}

export enum ReportStatus {
  PERDIDO = 'PERDIDO',
  ENCONTRADO = 'ENCONTRADO',
}

export enum ReportLifecycleStatus {
  ACTIVO = 'ACTIVO',
  RESUELTO = 'RESUELTO',
  ARCHIVADO = 'ARCHIVADO',
}

export enum Size {
  PEQUEÑO = 'PEQUEÑO',
  MEDIANO = 'MEDIANO',
  GRANDE = 'GRANDE',
}

export enum Sex {
  MACHO = 'MACHO',
  HEMBRA = 'HEMBRA',
  DESCONOCIDO = 'DESCONOCIDO',
}

// Value Objects
export interface Foto {
  url: string;
  orden: number;
  uploadedAt: string;
}

export interface Ubicacion {
  latitud: number;
  longitud: number;
  direccion?: string;
  barrio?: string;
}

export interface DatosContacto {
  nombre: string;
  telefono: string;
  email?: string;
  usuarioId?: string;
}

// Entidad principal
export interface Reporte {
  id: string;
  tipoAnimal: AnimalType;
  estado: ReportStatus;
  reportStatus: ReportLifecycleStatus;
  fotos: Foto[];
  ubicacion: Ubicacion;
  color: string;
  raza?: string;
  tamaño: Size;
  sexo: Sex;
  señasParticulares?: string;
  descripcion: string;
  fechaAvistamiento: string;
  publicador: DatosContacto;
  fechaCreacion: string;
  ultimaActualizacion: string;
  cantidadComentarios: number;
  cantidadCoincidencias: number;
}

// Form Data
export interface ReporteFormData {
  tipoAnimal: AnimalType | '';
  estado: ReportStatus | '';
  fotos: File[];
  fotosUrls: string[];
  latitud: number | null;
  longitud: number | null;
  direccion: string;
  barrio: string;
  color: string;
  raza: string;
  tamaño: Size | '';
  sexo: Sex | '';
  señasParticulares: string;
  descripcion: string;
  fechaAvistamiento: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
