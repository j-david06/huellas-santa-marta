'use client';

import { Reporte, ReportLifecycleStatus, ReportStatus } from '@/types/reporte';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportCardProps {
  reporte: Reporte;
  onClick: (id: string) => void;
}

export function ReportCard({ reporte, onClick }: ReportCardProps) {
  const getStatusBadgeColor = (status: ReportLifecycleStatus) => {
    switch (status) {
      case ReportLifecycleStatus.ACTIVO:
        return 'bg-green-100 text-green-800';
      case ReportLifecycleStatus.RESUELTO:
        return 'bg-blue-100 text-blue-800';
      case ReportLifecycleStatus.ARCHIVADO:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportStatusBadgeColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PERDIDO:
        return 'bg-red-100 text-red-800';
      case ReportStatus.ENCONTRADO:
        return 'bg-purple-100 text-purple-800';
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
    <div
      onClick={() => onClick(reporte.id)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      {/* Foto Principal */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {fotoPrincipal ? (
          <img
            src={fotoPrincipal}
            alt={`${reporte.tipoAnimal} - ${reporte.color}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-4xl">
            🐾
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReportStatusBadgeColor(reporte.estado)}`}>
            {reporte.estado === ReportStatus.PERDIDO ? '🔴 Perdido' : '🟣 Encontrado'}
          </span>
          {reporte.reportStatus !== ReportLifecycleStatus.ACTIVO && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(reporte.reportStatus)}`}>
              {reporte.reportStatus === ReportLifecycleStatus.RESUELTO ? '✓ Resuelto' : 'Archivado'}
            </span>
          )}
        </div>

        {/* Fotos count */}
        {reporte.fotos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            📷 {reporte.fotos.length}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">
            {reporte.tipoAnimal === 'PERRO' ? '🐕' : '🐱'} {reporte.color}
          </h3>
          {reporte.tamaño && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">{reporte.tamaño}</span>
          )}
        </div>

        {/* Raza */}
        {reporte.raza && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Raza:</strong> {reporte.raza}
          </p>
        )}

        {/* Sexo */}
        {reporte.sexo && (
          <p className="text-sm text-gray-600 mb-2">
            <strong>Sexo:</strong> {reporte.sexo}
          </p>
        )}

        {/* Ubicación */}
        {reporte.ubicacion && (
          <p className="text-sm text-gray-600 mb-3">
            📍 <strong>{reporte.ubicacion.barrio || reporte.ubicacion.direccion || 'Santa Marta'}</strong>
          </p>
        )}

        {/* Descripción Preview */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {reporte.descripcion}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
          <span>{getTimeAgo()}</span>
          <span>💬 {reporte.cantidadComentarios}</span>
        </div>
      </div>
    </div>
  );
}
