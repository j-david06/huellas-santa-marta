'use client';

import { useReporteForm } from '@/hooks/useReporteForm';
import { AnimalType, ReportStatus, Size, Sex } from '@/types/reporte';
import { PhotoUpload } from './PhotoUpload';

interface ReportFormProps {
  onSuccess?: (reporteId: string) => void;
}

export function ReportForm({ onSuccess }: ReportFormProps) {
  const {
    formData,
    currentStep,
    isSubmitting,
    error,
    errors,
    updateField,
    addPhoto,
    removePhoto,
    nextStep,
    prevStep,
    submit,
    reset,
  } = useReporteForm((id) => {
    onSuccess?.(id);
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Indicador de Paso */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step}
              </div>
              <span className="text-xs text-center text-gray-600">
                {step === 1 && 'Estado'}
                {step === 2 && 'Fotos'}
                {step === 3 && 'Ubicación'}
                {step === 4 && 'Detalles'}
                {step === 5 && 'Contacto'}
              </span>
              {step < 5 && (
                <div
                  className={`w-12 h-1 mt-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Errores Globales */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Paso 1: Estado */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">¿Es una mascota perdida o encontrada?</h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updateField('estado', ReportStatus.PERDIDO)}
              className={`flex-1 p-6 border-2 rounded-lg text-center transition ${
                formData.estado === ReportStatus.PERDIDO
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <div className="text-5xl mb-3">🔴</div>
              <p className="text-lg font-bold">Perdido/a</p>
              <p className="text-sm text-gray-600 mt-2">Mi mascota está desaparecida</p>
            </button>
            <button
              type="button"
              onClick={() => updateField('estado', ReportStatus.ENCONTRADO)}
              className={`flex-1 p-6 border-2 rounded-lg text-center transition ${
                formData.estado === ReportStatus.ENCONTRADO
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <div className="text-5xl mb-3">🟣</div>
              <p className="text-lg font-bold">Encontrado/a</p>
              <p className="text-sm text-gray-600 mt-2">Encontré una mascota</p>
            </button>
          </div>
          {errors.estado && <p className="text-red-600 text-sm mt-3">{errors.estado}</p>}
        </div>
      )}

      {/* Paso 2: Fotos */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Carga fotos de la mascota</h2>
          <PhotoUpload
            onFilesSelected={(files) => {
              files.forEach((file) => addPhoto(file));
            }}
            currentFiles={formData.fotos}
            onRemoveFile={removePhoto}
          />
          {errors.fotos && <p className="text-red-600 text-sm mt-3">{errors.fotos}</p>}
        </div>
      )}

      {/* Paso 3: Ubicación */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">¿Dónde fue visto/a?</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Latitud *</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitud || ''}
                onChange={(e) => updateField('latitud', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="11.2456"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Longitud *</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitud || ''}
                onChange={(e) => updateField('longitud', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="-74.1988"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => updateField('direccion', e.target.value)}
                placeholder="Calle principal"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Barrio</label>
              <input
                type="text"
                value={formData.barrio}
                onChange={(e) => updateField('barrio', e.target.value)}
                placeholder="Centro Histórico"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
          {errors.ubicacion && <p className="text-red-600 text-sm mt-3">{errors.ubicacion}</p>}
        </div>
      )}

      {/* Paso 4: Detalles del Animal */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Detalles del animal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo de animal *</label>
              <select
                value={formData.tipoAnimal}
                onChange={(e) => updateField('tipoAnimal', e.target.value as AnimalType)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecciona...</option>
                <option value={AnimalType.PERRO}>🐕 Perro</option>
                <option value={AnimalType.GATO}>🐱 Gato</option>
              </select>
              {errors.tipoAnimal && <p className="text-red-600 text-sm">{errors.tipoAnimal}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Color *</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="Negro, blanco y marrón"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {errors.color && <p className="text-red-600 text-sm">{errors.color}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Raza (opcional)</label>
              <input
                type="text"
                value={formData.raza}
                onChange={(e) => updateField('raza', e.target.value)}
                placeholder="Labrador"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tamaño *</label>
              <select
                value={formData.tamaño}
                onChange={(e) => updateField('tamaño', e.target.value as Size)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecciona...</option>
                <option value={Size.PEQUEÑO}>Pequeño</option>
                <option value={Size.MEDIANO}>Mediano</option>
                <option value={Size.GRANDE}>Grande</option>
              </select>
              {errors.tamaño && <p className="text-red-600 text-sm">{errors.tamaño}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Sexo *</label>
              <select
                value={formData.sexo}
                onChange={(e) => updateField('sexo', e.target.value as Sex)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecciona...</option>
                <option value={Sex.MACHO}>Macho</option>
                <option value={Sex.HEMBRA}>Hembra</option>
                <option value={Sex.DESCONOCIDO}>Desconocido</option>
              </select>
              {errors.sexo && <p className="text-red-600 text-sm">{errors.sexo}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Señas particulares (opcional)</label>
              <input
                type="text"
                value={formData.señasParticulares}
                onChange={(e) => updateField('señasParticulares', e.target.value)}
                placeholder="Collar azul, cicatriz en oreja"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Paso 5: Contacto */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Descripción y datos de contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Descripción adicional *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
                placeholder="Cuéntanos más detalles..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/1000
              </p>
              {errors.descripcion && <p className="text-red-600 text-sm">{errors.descripcion}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tu nombre *</label>
              <input
                type="text"
                value={formData.nombreContacto}
                onChange={(e) => updateField('nombreContacto', e.target.value)}
                placeholder="Juan Pérez"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {errors.nombreContacto && <p className="text-red-600 text-sm">{errors.nombreContacto}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tu teléfono (WhatsApp) *</label>
              <input
                type="tel"
                value={formData.telefonoContacto}
                onChange={(e) => updateField('telefonoContacto', e.target.value)}
                placeholder="+57 310 1234567"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {errors.telefonoContacto && <p className="text-red-600 text-sm">{errors.telefonoContacto}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email (opcional)</label>
              <input
                type="email"
                value={formData.emailContacto}
                onChange={(e) => updateField('emailContacto', e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ← Anterior
        </button>
        {currentStep < 5 ? (
          <button
            onClick={nextStep}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '⏳ Publicando...' : '✓ Publicar Reporte'}
          </button>
        )}
      </div>
    </div>
  );
}
