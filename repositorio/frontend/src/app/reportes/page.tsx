'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReportes } from '@/hooks/useReportes';
import { ReportCard } from '@/components/reportes/ReportCard';
import { ReportStatus, AnimalType } from '@/types/reporte';

export default function ReportesPage() {
  const router = useRouter();
  const {
    reportes,
    isLoading,
    error,
    page,
    totalPages,
    listar,
    siguientePagina,
    paginaAnterior,
  } = useReportes({ initialPage: 0, initialSize: 10 });

  const [filters, setFilters] = useState({
    estado: '',
    tipoAnimal: '',
  });

  // Cargar reportes al iniciar
  useEffect(() => {
    listar({
      estado: filters.estado ? (filters.estado as ReportStatus) : undefined,
      tipoAnimal: filters.tipoAnimal ? (filters.tipoAnimal as AnimalType) : undefined,
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🐾 Feed de Reportes</h1>
          <p className="text-blue-100">
            Explora los reportes de mascotas perdidas y encontradas en Santa Marta
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Botón crear reporte */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/reportes/crear')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            + Crear Nuevo Reporte
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-bold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Estado</label>
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Todos</option>
                <option value={ReportStatus.PERDIDO}>Perdido</option>
                <option value={ReportStatus.ENCONTRADO}>Encontrado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo de Animal</label>
              <select
                value={filters.tipoAnimal}
                onChange={(e) => setFilters({ ...filters, tipoAnimal: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Todos</option>
                <option value={AnimalType.PERRO}>Perro</option>
                <option value={AnimalType.GATO}>Gato</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">⏳ Cargando reportes...</p>
          </div>
        )}

        {/* Grid de reportes */}
        {!isLoading && reportes.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reportes.map((reporte) => (
                <ReportCard
                  key={reporte.id}
                  reporte={reporte}
                  onClick={(id) => router.push(`/reportes/${id}`)}
                />
              ))}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={paginaAnterior}
                disabled={page === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                ← Anterior
              </button>
              <span className="text-gray-700 font-semibold">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={siguientePagina}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}

        {!isLoading && reportes.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">😢 No hay reportes con los filtros seleccionados</p>
            <button
              onClick={() => router.push('/reportes/crear')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Crear el primer reporte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
