import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ImageData } from '../types';
import { Icon } from './Icon';

interface ImageUploaderProps {
  onImageChange: (imageData: ImageData[]) => void;
  multiple?: boolean;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageChange, 
  multiple = false,
  label = 'Click to upload image'
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onImageChange(images);
  }, [images, onImageChange]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: ImageData[] = [];
      const filesArray = Array.from(files);

      if (filesArray.length === 0) return;

      let processedCount = 0;
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          newImages.push({ file, dataUrl });
          processedCount++;
          if (processedCount === filesArray.length) {
            setImages(prevImages => multiple ? [...prevImages, ...newImages] : newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [multiple]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const UploadBox = () => (
     <div
      onClick={triggerFileInput}
      className="aspect-video w-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-cyan-500 transition-colors p-2 text-center"
    >
      <Icon.UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 mb-2" />
      <p className="font-semibold text-gray-400 text-sm sm:text-base">{label}</p>
      <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
    </div>
  );

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        multiple={multiple}
      />
      {multiple ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((image, index) => (
                <div key={`${image.file.name}-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-gray-600">
                    <img src={image.dataUrl} alt={`Preview ${index}`} className="w-full h-full object-contain bg-gray-700/50" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center justify-center transition-colors"
                            aria-label="Remove image"
                        >
                            <Icon.Trash className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
             <div onClick={triggerFileInput} className="aspect-video w-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-cyan-500 transition-colors p-2 text-center">
                <Icon.Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500 mb-2" />
                <p className="font-semibold text-gray-400 text-sm">Add More</p>
             </div>
        </div>
      ) : (
        <>
        {images.length > 0 ? (
            <div className="relative group aspect-video rounded-lg overflow-hidden border-2 border-gray-600">
              <img src={images[0].dataUrl} alt="Preview" className="w-full h-full object-contain bg-gray-700/50" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveImage(0)}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Icon.Trash className="w-5 h-5" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <UploadBox />
          )}
        </>
      )}
    </div>
  );
};