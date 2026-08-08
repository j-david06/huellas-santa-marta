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
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-48 rounded-[16px] border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer ${
          isDragging
            ? 'border-[#9f402d] bg-[#ffdad3]/30'
            : 'border-[#ddc0ba] bg-[#efeded] hover:bg-[#eae8e7]'
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
        <label htmlFor="photo-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#e4e2e2] flex items-center justify-center group-hover:bg-[#ddc0ba]/30 transition-colors">
            <span className="material-symbols-outlined text-[32px] text-[#89726d]">photo_camera</span>
          </div>
          <span className="font-body-md text-body-md text-[#56423e]">Toca para subir una imagen</span>
          <span className="font-caption text-caption text-[#89726d]">Máx 5MB (JPG, PNG)</span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-[#ffdad6] border-2 border-[#ba1a1a] text-[#93000a] rounded-[12px] font-body-md">
          {error}
        </div>
      )}

      {/* Selected Files Preview */}
      {currentFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-headline-md text-headline-md text-[#1b1c1c] mb-4">
            Fotos seleccionadas ({currentFiles.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {currentFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-[16px] border-2 border-[#ddc0ba]"
                />
                {onRemoveFile && (
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="absolute top-2 right-2 bg-[#ba1a1a] text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition font-bold shadow-md"
                    type="button"
                    title="Eliminar foto"
                  >
                    ✕
                  </button>
                )}
                <p className="text-caption font-caption text-[#56423e] mt-2 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
