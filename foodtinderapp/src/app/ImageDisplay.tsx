'use client'

import { useState, useEffect } from 'react';

interface ImageDisplayProps {
  url: string;
}

const ImageDisplay = ({ url }: ImageDisplayProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    const getImage = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    getImage();
  }, [url]);

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Fetched Image"/>}
    </div>
  );
};

export default ImageDisplay;
