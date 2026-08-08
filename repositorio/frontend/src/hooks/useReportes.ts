'use client';

import { useState, useCallback } from 'react';
import { Reporte, PaginatedResponse, ReportStatus, AnimalType } from '@/types/reporte';
import { reporteService } from '@/services/reporteService';

interface UseReportesOptions {
  initialPage?: number;
  initialSize?: number;
}

export function useReportes(options: UseReportesOptions = {}) {
  const { initialPage = 0, initialSize = 10 } = options;

  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const listar = useCallback(
    async (
      filters?: {
        estado?: ReportStatus;
        tipoAnimal?: AnimalType;
        color?: string;
        barrio?: string;
      }
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await reporteService.listarReportes(page, size, filters);
        setReportes(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar reportes');
      } finally {
        setIsLoading(false);
      }
    },
    [page, size]
  );

  const buscar = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reporteService.buscarReportes(query, page, size);
      setReportes(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  const obtenerDetalle = useCallback(async (id: string): Promise<Reporte | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await reporteService.obtenerReporte(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reporte');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const obtenerPorUbicacion = useCallback(
    async (latitud: number, longitud: number, radiusKm: number = 5) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await reporteService.obtenerPorUbicacion(latitud, longitud, radiusKm);
        setReportes(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar por ubicación');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const siguientePagina = useCallback(() => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const paginaAnterior = useCallback(() => {
    if (page > 0) {
      setPage(page - 1);
    }
  }, [page]);

  return {
    reportes,
    isLoading,
    error,
    page,
    totalPages,
    totalElements,
    listar,
    buscar,
    obtenerDetalle,
    obtenerPorUbicacion,
    siguientePagina,
    paginaAnterior,
  };
}
