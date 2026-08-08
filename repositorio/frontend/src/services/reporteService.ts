import axios, { AxiosInstance } from 'axios';
import {
  Reporte,
  ReporteFormData,
  ApiResponse,
  PaginatedResponse,
  AnimalType,
  ReportStatus,
  Size,
  Sex,
} from '@/types/reporte';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ReporteService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Crear reporte con fotos (FormData)
  async crearReporte(formData: ReporteFormData): Promise<Reporte> {
    const data = new FormData();
    
    // Agregar campos simples
    data.append('tipoAnimal', formData.tipoAnimal);
    data.append('estado', formData.estado);
    data.append('color', formData.color);
    data.append('tamaño', formData.tamaño);
    data.append('sexo', formData.sexo);
    data.append('descripcion', formData.descripcion);
    data.append('fechaAvistamiento', formData.fechaAvistamiento);
    data.append('latitud', formData.latitud?.toString() || '');
    data.append('longitud', formData.longitud?.toString() || '');
    data.append('direccion', formData.direccion);
    data.append('barrio', formData.barrio);
    data.append('nombreContacto', formData.nombreContacto);
    data.append('telefonoContacto', formData.telefonoContacto);
    data.append('emailContacto', formData.emailContacto || '');
    
    if (formData.raza) {
      data.append('raza', formData.raza);
    }
    if (formData.señasParticulares) {
      data.append('señasParticulares', formData.señasParticulares);
    }

    // Agregar fotos
    formData.fotos.forEach((file, index) => {
      data.append(`fotos`, file);
    });

    try {
      const response = await this.api.post<Reporte>('/reportes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener reporte por ID
  async obtenerReporte(id: string): Promise<Reporte> {
    try {
      const response = await this.api.get<Reporte>(`/reportes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Listar reportes activos con paginación y filtros
  async listarReportes(
    page: number = 0,
    size: number = 10,
    filters?: {
      estado?: ReportStatus;
      tipoAnimal?: AnimalType;
      color?: string;
      barrio?: string;
    }
  ): Promise<PaginatedResponse<Reporte>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.tipoAnimal) params.append('tipo', filters.tipoAnimal);
      if (filters?.color) params.append('color', filters.color);
      if (filters?.barrio) params.append('barrio', filters.barrio);

      const response = await this.api.get<PaginatedResponse<Reporte>>(
        `/reportes?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Buscar reportes por texto
  async buscarReportes(
    query: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Reporte>> {
    try {
      const response = await this.api.get<PaginatedResponse<Reporte>>(
        `/reportes/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener reportes por ubicación
  async obtenerPorUbicacion(
    latitud: number,
    longitud: number,
    radiusKm: number = 5
  ): Promise<Reporte[]> {
    try {
      const response = await this.api.get<Reporte[]>(
        `/reportes/ubicacion?latitud=${latitud}&longitud=${longitud}&radiusKm=${radiusKm}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Actualizar reporte
  async actualizarReporte(
    id: string,
    data: {
      descripcion?: string;
      señasParticulares?: string;
    }
  ): Promise<Reporte> {
    try {
      const response = await this.api.patch<Reporte>(`/reportes/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Marcar reporte como resuelto
  async marcarResuelto(id: string, comentario?: string): Promise<Reporte> {
    try {
      const response = await this.api.post<Reporte>(
        `/reportes/${id}/resolver`,
        { comentario: comentario || '' }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejo de errores
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return new Error('Reporte no encontrado');
      }
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Datos inválidos';
        return new Error(message);
      }
      if (error.response?.status === 500) {
        return new Error('Error interno del servidor');
      }
      return new Error(error.message || 'Error desconocido');
    }
    return new Error('Error desconocido');
  }
}

export const reporteService = new ReporteService();
