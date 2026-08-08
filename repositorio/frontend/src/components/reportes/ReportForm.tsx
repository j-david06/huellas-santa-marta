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
    isSubmitting,
    error,
    errors,
    updateField,
    addPhoto,
    removePhoto,
    submit,
  } = useReporteForm((id) => {
    onSuccess?.(id);
  });

  return (
    <div className="px-[20px] py-[24px] max-w-md">
      {/* Header */}
      <div className="mb-[48px]">
        <h1 className="font-headline-xl text-headline-xl text-[#1b1c1c] mb-2">Crear Reporte</h1>
        <p className="font-body-lg text-body-lg text-[#56423e]">
          Ayúdanos a reunir a las mascotas con sus familias. Completa los detalles a continuación.
        </p>
      </div>

      {/* Errores Globales */}
      {error && (
        <div className="mb-6 p-4 bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] rounded-2xl font-body-md">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-[48px]">
        {/* Paso 1: Estado */}
        <section className="flex flex-col gap-[12px]">
          <label className="font-headline-md text-headline-md text-[#1b1c1c]">1. Estado de la Mascota</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer relative">
              <input
                type="radio"
                checked={formData.estado === ReportStatus.PERDIDO}
                onChange={() => updateField('estado', ReportStatus.PERDIDO)}
                className="peer sr-only"
              />
              <div className="w-full h-24 rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] peer-checked:bg-[#9f402d] peer-checked:border-[#9f402d] peer-checked:text-white text-[#56423e] flex flex-col items-center justify-center gap-2 transition-all shadow-sm peer-checked:shadow-md">
                <span className="material-symbols-outlined text-[32px]">search</span>
                <span className="font-label-md text-label-md text-[14px]">Perdido</span>
              </div>
            </label>
            <label className="cursor-pointer relative">
              <input
                type="radio"
                checked={formData.estado === ReportStatus.ENCONTRADO}
                onChange={() => updateField('estado', ReportStatus.ENCONTRADO)}
                className="peer sr-only"
              />
              <div className="w-full h-24 rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] peer-checked:bg-[#16677a] peer-checked:border-[#16677a] peer-checked:text-white text-[#56423e] flex flex-col items-center justify-center gap-2 transition-all shadow-sm peer-checked:shadow-md">
                <span className="material-symbols-outlined text-[32px]">waving_hand</span>
                <span className="font-label-md text-label-md text-[14px]">Encontrado</span>
              </div>
            </label>
          </div>
          {errors.estado && <p className="text-[#ba1a1a] text-caption font-caption mt-2">{errors.estado}</p>}
        </section>

        {/* Paso 2: Subir foto */}
        <section className="flex flex-col gap-[12px]">
          <label className="font-headline-md text-headline-md text-[#1b1c1c]">2. Subir Foto</label>
          <PhotoUpload
            onFilesSelected={(files) => {
              files.forEach((file) => addPhoto(file));
            }}
            currentFiles={formData.fotos}
            onRemoveFile={removePhoto}
          />
          {errors.fotos && <p className="text-[#ba1a1a] text-caption font-caption mt-2">{errors.fotos}</p>}
        </section>

        {/* Paso 3: Ubicación */}
        <section className="flex flex-col gap-[12px]">
          <label className="font-headline-md text-headline-md text-[#1b1c1c]">3. Ubicación</label>
          <p className="font-body-md text-body-md text-[#56423e]">¿Dónde fue visto por última vez?</p>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Latitud *</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitud || ''}
                onChange={(e) => updateField('latitud', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="11.2456"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Longitud *</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitud || ''}
                onChange={(e) => updateField('longitud', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="-74.1988"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => updateField('direccion', e.target.value)}
                placeholder="Calle principal"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Barrio</label>
              <input
                type="text"
                value={formData.barrio}
                onChange={(e) => updateField('barrio', e.target.value)}
                placeholder="Centro Histórico"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          {errors.ubicacion && <p className="text-[#ba1a1a] text-caption font-caption mt-2">{errors.ubicacion}</p>}
        </section>

        {/* Paso 4: Detalles del Animal */}
        <section className="flex flex-col gap-[12px]">
          <label className="font-headline-md text-headline-md text-[#1b1c1c]">4. Detalles del Animal</label>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Tipo *</label>
              <div className="relative">
                <select
                  value={formData.tipoAnimal}
                  onChange={(e) => updateField('tipoAnimal', e.target.value as AnimalType)}
                  className="w-full rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none appearance-none pr-10"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value={AnimalType.PERRO}>Perro</option>
                  <option value={AnimalType.GATO}>Gato</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#56423e] pointer-events-none" style={{ fontSize: '24px' }}>expand_more</span>
              </div>
              {errors.tipoAnimal && <p className="text-[#ba1a1a] text-caption font-caption">{errors.tipoAnimal}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Color Principal *</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="Ej. Negro, Blanco con manchas..."
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
              {errors.color && <p className="text-[#ba1a1a] text-caption font-caption">{errors.color}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Raza (Opcional)</label>
              <input
                type="text"
                value={formData.raza}
                onChange={(e) => updateField('raza', e.target.value)}
                placeholder="Ej. Labrador, Criollo..."
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Tamaño *</label>
              <div className="relative">
                <select
                  value={formData.tamaño}
                  onChange={(e) => updateField('tamaño', e.target.value as Size)}
                  className="w-full rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none appearance-none pr-10"
                >
                  <option value="">Selecciona...</option>
                  <option value={Size.PEQUEÑO}>Pequeño</option>
                  <option value={Size.MEDIANO}>Mediano</option>
                  <option value={Size.GRANDE}>Grande</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#56423e] pointer-events-none" style={{ fontSize: '24px' }}>expand_more</span>
              </div>
              {errors.tamaño && <p className="text-[#ba1a1a] text-caption font-caption">{errors.tamaño}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Sexo *</label>
              <div className="relative">
                <select
                  value={formData.sexo}
                  onChange={(e) => updateField('sexo', e.target.value as Sex)}
                  className="w-full rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none appearance-none pr-10"
                >
                  <option value="">Selecciona...</option>
                  <option value={Sex.MACHO}>Macho</option>
                  <option value={Sex.HEMBRA}>Hembra</option>
                  <option value={Sex.DESCONOCIDO}>Desconocido</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#56423e] pointer-events-none" style={{ fontSize: '24px' }}>expand_more</span>
              </div>
              {errors.sexo && <p className="text-[#ba1a1a] text-caption font-caption">{errors.sexo}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Señas Particulares (Opcional)</label>
              <input
                type="text"
                value={formData.señasParticulares}
                onChange={(e) => updateField('señasParticulares', e.target.value)}
                placeholder="Collar rojo, cicatriz en la oreja..."
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </section>

        {/* Paso 5: Contacto */}
        <section className="flex flex-col gap-[12px]">
          <label className="font-headline-md text-headline-md text-[#1b1c1c]">5. Descripción y datos de contacto</label>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Descripción adicional *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
                placeholder="Proporciona cualquier detalle adicional que pueda ayudar..."
                rows={4}
                maxLength={1000}
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0 resize-none"
              />
              <p className="text-caption font-caption text-[#56423e]">
                {formData.descripcion.length}/1000
              </p>
              {errors.descripcion && <p className="text-[#ba1a1a] text-caption font-caption">{errors.descripcion}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Tu nombre *</label>
              <input
                type="text"
                value={formData.nombreContacto}
                onChange={(e) => updateField('nombreContacto', e.target.value)}
                placeholder="Juan Pérez"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
              {errors.nombreContacto && <p className="text-[#ba1a1a] text-caption font-caption">{errors.nombreContacto}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Tu teléfono (WhatsApp) *</label>
              <input
                type="tel"
                value={formData.telefonoContacto}
                onChange={(e) => updateField('telefonoContacto', e.target.value)}
                placeholder="+57 310 1234567"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
              {errors.telefonoContacto && <p className="text-[#ba1a1a] text-caption font-caption">{errors.telefonoContacto}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-[#1b1c1c]">Email (Opcional)</label>
              <input
                type="email"
                value={formData.emailContacto}
                onChange={(e) => updateField('emailContacto', e.target.value)}
                placeholder="correo@ejemplo.com"
                className="rounded-[16px] border-2 border-[#ddc0ba] bg-[#ffffff] px-4 py-3 font-body-md text-body-md text-[#1b1c1c] focus:border-[#9f402d] focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="mt-[12px]">
          <button
            onClick={submit}
            disabled={isSubmitting}
            type="button"
            className="w-full bg-[#9f402d] text-white font-label-md text-[18px] py-4 rounded-full flex justify-center items-center gap-2 shadow-md hover:bg-[#8a3626] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
            {isSubmitting ? '⏳ Publicando...' : 'Publicar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
}
