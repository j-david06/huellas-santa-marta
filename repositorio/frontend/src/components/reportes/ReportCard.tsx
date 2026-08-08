'use client';

import { Reporte, ReportLifecycleStatus, ReportStatus } from '@/types/reporte';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportCardProps {
  reporte: Reporte;
  onClick: (id: string) => void;
}

export function ReportCard({ reporte, onClick }: ReportCardProps) {
  const getStatusBadgeColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PERDIDO:
        return 'bg-[#9f402d]';
      case ReportStatus.ENCONTRADO:
        return 'bg-[#16677a]';
    }
  };

  const getStatusText = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PERDIDO:
        return 'Perdido';
      case ReportStatus.ENCONTRADO:
        return 'Encontrado';
    }
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(reporte.fechaCreacion), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return 'Hace poco';
    }
  };

  const fotoPrincipal = reporte.fotos && reporte.fotos.length > 0 ? reporte.fotos[0].url : null;

  return (
    <article
      onClick={() => onClick(reporte.id)}
      className="bg-[#ffffff] rounded-[24px] shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow border border-[#ddc0ba]"
    >
      {/* Foto Principal */}
      <div className="relative h-48 bg-[#e4e2e2] overflow-hidden">
        {fotoPrincipal ? (
          <img
            src={fotoPrincipal}
            alt={`${reporte.tipoAnimal} - ${reporte.color}`}
            className="w-full h-full object-cover rounded-t-[24px]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#efeded] text-4xl">
            🐾
          </div>
        )}

        {/* Status Badge - Top Left */}
        <div className={`absolute top-4 left-4 ${getStatusBadgeColor(reporte.estado)} text-white px-4 py-2 rounded-full font-label-md text-label-md uppercase h-8 flex items-center shadow-md`}>
          {getStatusText(reporte.estado)}
        </div>

        {/* Fotos count */}
        {reporte.fotos && reporte.fotos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-caption">
            📷 {reporte.fotos.length}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* Nombre y tipo */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-grow">
            <h3 className="font-headline-md text-headline-md text-[#1b1c1c]">
              {reporte.color}
            </h3>
            <p className="font-body-md text-body-md text-[#56423e]">
              {reporte.tipoAnimal === 'PERRO' ? 'Perro' : 'Gato'}{reporte.raza ? ` • ${reporte.raza}` : ''}
            </p>
          </div>
          {reporte.tamaño && (
            <span className="text-caption font-caption bg-[#efeded] text-[#56423e] px-3 py-1 rounded-full whitespace-nowrap">
              {reporte.tamaño}
            </span>
          )}
        </div>

        {/* Ubicación y tiempo */}
        <div className="mt-auto flex flex-col gap-2">
          {reporte.ubicacion?.barrio || reporte.ubicacion?.direccion ? (
            <div className="flex items-center gap-2 text-caption font-caption text-[#56423e]">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
              <span>{reporte.ubicacion.barrio || reporte.ubicacion.direccion || 'Santa Marta'}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-caption font-caption text-[#56423e]">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
            <span>{getTimeAgo()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
