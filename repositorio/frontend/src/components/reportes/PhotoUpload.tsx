'use client';

import { ChangeEvent, DragEvent, useState } from 'react';

interface PhotoUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  currentFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

export function PhotoUpload({
  onFilesSelected,
  maxFiles = 5,
  maxSizeMB = 5,
  currentFiles = [],
  onRemoveFile,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList | File[]): boolean => {
    const fileArray = Array.from(files);

    if (currentFiles.length + fileArray.length > maxFiles) {
      setError(`Máximo ${maxFiles} fotos permitidas`);
      return false;
    }

    for (const file of fileArray) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Solo se permiten formatos JPG, PNG o WebP');
        return false;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Cada foto no debe exceder ${maxSizeMB}MB`);
        return false;
      }
    }

    return true;
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && validateFiles(e.target.files)) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && validateFiles(e.dataTransfer.files)) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-lg font-semibold text-gray-700">
            Arrastra fotos aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Máx. {maxFiles} fotos, {maxSizeMB}MB cada una (JPG, PNG, WebP)
          </p>
        </label>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {currentFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Fotos seleccionadas ({currentFiles.length}/{maxFiles})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                {onRemoveFile && (
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    type="button"
                  >
                    ✕
                  </button>
                )}
                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
