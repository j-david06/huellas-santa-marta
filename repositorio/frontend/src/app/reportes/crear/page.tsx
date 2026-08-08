'use client';

import { useRouter } from 'next/navigation';
import { ReportForm } from '@/components/reportes/ReportForm';

export default function CrearReportePage() {
  const router = useRouter();

  const handleSuccess = (reporteId: string) => {
    // Redirigir al detalle del reporte creado
    router.push(`/reportes/${reporteId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            📝 Crear Nuevo Reporte
          </h1>
          <p className="text-gray-600 mt-2">
            Ayúdanos a encontrar o reportar una mascota. Por favor completa todos los detalles.
          </p>
        </div>

        <ReportForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
