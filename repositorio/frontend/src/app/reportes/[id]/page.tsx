'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Reporte, ReportStatus, ReportLifecycleStatus } from '@/types/reporte';
import { reporteService } from '@/services/reporteService';

export default function DetallePage() {
  const router = useRouter();
  const params = useParams();
  const reporteId = params.id as string;

  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const cargarReporte = async () => {
      if (!reporteId) return;
      setIsLoading(true);
      try {
        const data = await reporteService.obtenerReporte(reporteId);
        setReporte(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar reporte');
      } finally {
        setIsLoading(false);
      }
    };

    cargarReporte();
  }, [reporteId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">⏳ Cargando reporte...</p>
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg mb-4">{error || 'Reporte no encontrado'}</p>
        <button
          onClick={() => router.push('/reportes')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Volver al Feed
        </button>
      </div>
    );
  }

  const fotoActual = reporte.fotos[activeImageIndex]?.url;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          ← Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería de fotos */}
          <div>
            <div className="bg-gray-300 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
              {fotoActual ? (
                <img
                  src={fotoActual}
                  alt={`Foto ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">🐾</div>
              )}
            </div>

            {/* Thumbnails */}
            {reporte.fotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {reporte.fotos.map((foto, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === activeImageIndex
                        ? 'border-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={foto.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del reporte */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-6">
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  reporte.estado === ReportStatus.PERDIDO
                    ? 'bg-red-100 text-red-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {reporte.estado === ReportStatus.PERDIDO ? '🔴 Perdido' : '🟣 Encontrado'}
              </span>
              {reporte.reportStatus !== ReportLifecycleStatus.ACTIVO && (
                <span
                  className={`px-4 py-2 rounded-full font-semibold ${
                    reporte.reportStatus === ReportLifecycleStatus.RESUELTO
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {reporte.reportStatus === ReportLifecycleStatus.RESUELTO ? '✓ Resuelto' : 'Archivado'}
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-4xl font-bold mb-4">
              {reporte.tipoAnimal === 'PERRO' ? '🐕' : '🐱'} {reporte.color}
            </h1>

            {/* Detalles del animal */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Detalles del Animal</h2>
              <div className="grid grid-cols-2 gap-4">
                {reporte.raza && (
                  <div>
                    <p className="text-gray-600 font-semibold">Raza</p>
                    <p className="text-lg">{reporte.raza}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 font-semibold">Tamaño</p>
                  <p className="text-lg">{reporte.tamaño}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Sexo</p>
                  <p className="text-lg">{reporte.sexo}</p>
                </div>
                {reporte.señasParticulares && (
                  <div className="col-span-2">
                    <p className="text-gray-600 font-semibold">Señas Particulares</p>
                    <p className="text-lg">{reporte.señasParticulares}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">📍 Ubicación</h2>
              <p className="text-lg mb-2">
                <strong>Barrio:</strong> {reporte.ubicacion.barrio || 'No especificado'}
              </p>
              {reporte.ubicacion.direccion && (
                <p className="text-lg mb-2">
                  <strong>Dirección:</strong> {reporte.ubicacion.direccion}
                </p>
              )}
              <p className="text-gray-600">
                Coordenadas: {reporte.ubicacion.latitud.toFixed(4)}, {reporte.ubicacion.longitud.toFixed(4)}
              </p>
            </div>

            {/* Descripción */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Descripción</h2>
              <p className="text-lg text-gray-700 whitespace-pre-wrap">
                {reporte.descripcion}
              </p>
            </div>

            {/* Datos de contacto */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Contactar al Reportero</h2>
              <p className="text-lg mb-2">
                <strong>Nombre:</strong> {reporte.publicador.nombre}
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href={`https://wa.me/${reporte.publicador.telefono.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition text-center"
                >
                  💬 WhatsApp
                </a>
                {reporte.publicador.email && (
                  <a
                    href={`mailto:${reporte.publicador.email}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-center"
                  >
                    📧 Email
                  </a>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-6 text-gray-600 text-sm">
              <p>Creado: {new Date(reporte.fechaCreacion).toLocaleDateString('es-CO')}</p>
              {reporte.ultimaActualizacion !== reporte.fechaCreacion && (
                <p>
                  Última actualización: {new Date(reporte.ultimaActualizacion).toLocaleDateString('es-CO')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
