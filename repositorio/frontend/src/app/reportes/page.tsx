w'use client';

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
    <div className="w-full min-h-screen bg-[#fbf9f8]">
      {/* Main Content */}
      <div className="px-[20px] py-[24px] flex flex-col gap-[48px]">
        {/* Header with Title */}
        <div>
          <h1 className="font-headline-lg text-headline-lg text-[#1b1c1c] mb-2">Reportes Recientes</h1>
          <p className="font-body-lg text-body-lg text-[#56423e]">
            Explora los reportes de mascotas perdidas y encontradas
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#ddc0ba]">
          <h2 className="font-headline-md text-headline-md text-[#1b1c1c] mb-4">Filtros</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-label-md font-label-md text-[#1b1c1c] mb-2">Estado</label>
              <div className="relative">
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="w-full rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none appearance-none pr-10"
                >
                  <option value="">Todos</option>
                  <option value={ReportStatus.PERDIDO}>Perdido</option>
                  <option value={ReportStatus.ENCONTRADO}>Encontrado</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#56423e] pointer-events-none" style={{ fontSize: '24px' }}>expand_more</span>
              </div>
            </div>
            <div>
              <label className="block text-label-md font-label-md text-[#1b1c1c] mb-2">Tipo de Animal</label>
              <div className="relative">
                <select
                  value={filters.tipoAnimal}
                  onChange={(e) => setFilters({ ...filters, tipoAnimal: e.target.value })}
                  className="w-full rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none appearance-none pr-10"
                >
                  <option value="">Todos</option>
                  <option value={AnimalType.PERRO}>Perro</option>
                  <option value={AnimalType.GATO}>Gato</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#56423e] pointer-events-none" style={{ fontSize: '24px' }}>expand_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="p-4 bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] rounded-2xl font-body-md">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-[#56423e] text-body-lg font-body-lg">⏳ Cargando reportes...</p>
          </div>
        )}

        {/* Grid de reportes */}
        {!isLoading && reportes.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-[16px]">
              {reportes.map((reporte) => (
                <ReportCard
                  key={reporte.id}
                  reporte={reporte}
                  onClick={(id) => router.push(`/reportes/${id}`)}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={paginaAnterior}
                  disabled={page === 0}
                  className="px-6 py-3 bg-[#9f402d] text-white font-label-md rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8a3626] transition-colors"
                >
                  ← Anterior
                </button>
                <span className="text-[#1b1c1c] font-label-md">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={siguientePagina}
                  disabled={page >= totalPages - 1}
                  className="px-6 py-3 bg-[#9f402d] text-white font-label-md rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8a3626] transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && reportes.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-[#56423e] text-body-lg font-body-lg mb-4">😢 No hay reportes con los filtros seleccionados</p>
            <button
              onClick={() => router.push('/reportes/crear')}
              className="bg-[#9f402d] hover:bg-[#8a3626] text-white font-label-md py-3 px-6 rounded-full transition-colors"
            >
              Crear el primer reporte
            </button>
          </div>
        )}
      </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => router.push('/reportes/crear')}
        className="fixed bottom-32 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-[#9f402d] text-white shadow-lg flex items-center justify-center hover:bg-[#8a3626] active:scale-95 transition-all duration-200 z-40"
        title="Crear nuevo reporte"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
}
