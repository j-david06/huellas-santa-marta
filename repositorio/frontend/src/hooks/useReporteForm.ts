'use client';

import { useState, useCallback } from 'react';
import { ReporteFormData, AnimalType, ReportStatus, Size, Sex } from '@/types/reporte';
import { reporteService } from '@/services/reporteService';

const INITIAL_FORM_DATA: ReporteFormData = {
  tipoAnimal: '',
  estado: '',
  fotos: [],
  fotosUrls: [],
  latitud: null,
  longitud: null,
  direccion: '',
  barrio: '',
  color: '',
  raza: '',
  tamaño: '',
  sexo: '',
  señasParticulares: '',
  descripcion: '',
  fechaAvistamiento: new Date().toISOString().slice(0, 16),
  nombreContacto: '',
  telefonoContacto: '',
  emailContacto: '',
};

export function useReporteForm(onSuccess?: (id: string) => void) {
  const [formData, setFormData] = useState<ReporteFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(
    <K extends keyof ReporteFormData>(field: K, value: ReporteFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Limpiar error del campo al actualizar
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    },
    []
  );

  const addPhoto = useCallback((file: File) => {
    setFormData((prev) => ({
      ...prev,
      fotos: [...prev.fotos, file],
    }));
  }, []);

  const removePhoto = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.estado) newErrors.estado = 'Debes seleccionar un estado';
        break;
      case 2:
        if (formData.fotos.length === 0) newErrors.fotos = 'Debes cargar al menos una foto';
        if (formData.fotos.length > 5) newErrors.fotos = 'Máximo 5 fotos permitidas';
        break;
      case 3:
        if (formData.latitud === null || formData.longitud === null) {
          newErrors.ubicacion = 'Debes seleccionar una ubicación en el mapa';
        }
        break;
      case 4:
        if (!formData.tipoAnimal) newErrors.tipoAnimal = 'Tipo de animal es obligatorio';
        if (!formData.color) newErrors.color = 'Color es obligatorio';
        if (!formData.tamaño) newErrors.tamaño = 'Tamaño es obligatorio';
        if (!formData.sexo) newErrors.sexo = 'Sexo es obligatorio';
        break;
      case 5:
        if (!formData.descripcion) newErrors.descripcion = 'Descripción es obligatoria';
        if (!formData.nombreContacto) newErrors.nombreContacto = 'Nombre es obligatorio';
        if (!formData.telefonoContacto) newErrors.telefonoContacto = 'Teléfono es obligatorio';
        if (formData.descripcion.length > 1000) {
          newErrors.descripcion = 'Descripción no debe exceder 1000 caracteres';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const submit = useCallback(async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const resultado = await reporteService.crearReporte(formData);
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
      setErrors({});
      onSuccess?.(resultado.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear reporte';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, currentStep, validateStep, onSuccess]);

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setError(null);
    setErrors({});
  }, []);

  return {
    formData,
    currentStep,
    isSubmitting,
    error,
    errors,
    updateField,
    addPhoto,
    removePhoto,
    validateStep,
    nextStep,
    prevStep,
    submit,
    reset,
  };
}
