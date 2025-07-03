import React from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  priority = false,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className="w-full object-cover"
      priority={priority}
    />
  );
};
