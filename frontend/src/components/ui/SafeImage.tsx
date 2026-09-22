'use client';

import React, { useState } from 'react';
import { getFallbackImage, getSvgFallback } from '@/lib/placeholders';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  category?: string;
  fallbackType?: string;
  className?: string;
}

/**
 * SafeImage Component for Bazar-Bio
 * Enforces Zero-Broken-Image directive:
 * 1. Attempts to render primary `src`.
 * 2. If empty or fails, falls back to high-res category-specific photography (cassava, news/loudspeaker, etc.).
 * 3. If network fails or offline, falls back to inline SVG data-URI with category icon and label.
 */
export function SafeImage({
  src,
  alt,
  category,
  fallbackType,
  className = 'w-full h-full object-cover',
  ...props
}: SafeImageProps) {
  const contextKey = fallbackType || category;
  const photoFallback = getFallbackImage(contextKey);
  const svgFallback = getSvgFallback(contextKey);

  const initialSrc = src && src.trim() !== '' ? src : photoFallback;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [errorStage, setErrorStage] = useState<number>(src && src.trim() !== '' ? 0 : 1);

  const [prevSrc, setPrevSrc] = useState<string | null | undefined>(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src && src.trim() !== '' ? src : photoFallback);
    setErrorStage(src && src.trim() !== '' ? 0 : 1);
  }

  const handleError = () => {
    if (errorStage === 0) {
      // Primary URL failed -> try high-res category photographic fallback
      setErrorStage(1);
      setImgSrc(photoFallback);
    } else if (errorStage === 1) {
      // Photo fallback failed (e.g. offline) -> switch to bulletproof inline SVG vector
      setErrorStage(2);
      setImgSrc(svgFallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}

