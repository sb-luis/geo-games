'use client';

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { GlobeScene } from './GlobeScene';
import { CAMERA_DIST, MAX_FOV } from '@/lib/geo/lod';

interface GlobeProps {
  onSelect?: (name: string | null) => void;
  showLabel?: boolean;
}

export function Globe({ onSelect, showLabel = true }: GlobeProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleSelect = useCallback((name: string | null) => {
    setSelectedCountry(name);
    onSelect?.(name);
  }, [onSelect]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ fov: MAX_FOV, position: [CAMERA_DIST, 0, 0], near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <GlobeScene onSelect={handleSelect} />
      </Canvas>

      {showLabel && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          {selectedCountry ? (
            <span className="rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-gray-800 shadow backdrop-blur-sm">
              {selectedCountry}
            </span>
          ) : (
            <span className="text-sm text-gray-400">double-click a country</span>
          )}
        </div>
      )}
    </div>
  );
}
