'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

interface QuestImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  loop?: boolean; // Whether to loop the video (default: true)
}

export function QuestImage({ src, alt, size = 'medium', className = '', loop = true }: QuestImageProps) {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-40 h-40',
    large: 'w-48 h-48'
  };

  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={className.includes('!relative') ? className : `relative ${className}`}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop={loop}
          muted={true}
          playsInline
          className={`${sizeClasses[size]} object-contain`}
          style={{
            imageRendering: 'pixelated',
            imageRendering: '-moz-crisp-edges',
            imageRendering: 'crisp-edges'
          }}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} object-contain`}
          style={{
            imageRendering: 'pixelated',
            imageRendering: '-moz-crisp-edges',
            imageRendering: 'crisp-edges'
          }}
        />
      )}
    </motion.div>
  );
}
