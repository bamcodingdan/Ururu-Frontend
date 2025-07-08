import { useState } from 'react';

export function useImageUpload(initial: File[] = []) {
  const [images, setImages] = useState<File[]>(initial);

  const addImages = (files: FileList | File[]) => {
    const arr = Array.from(files);
    setImages((prev) => [...prev, ...arr]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => setImages(initial);

  return { images, addImages, removeImage, reset };
}
