'use client';

import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { GlobeScene } from './GlobeScene';
import type { GlobeSceneHandle } from './GlobeScene';
import { CAMERA_DIST, MAX_FOV, fovToSlider, sliderToFov } from '@/lib/geo/lod';

export interface GlobeHandle {
  reset: () => void;
}

interface GlobeProps {
  onSelect?: (name: string | null) => void;
  showLabel?: boolean;
}

export const Globe = forwardRef<GlobeHandle, GlobeProps>(function Globe(
  { onSelect, showLabel = true },
  ref,
) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(() => fovToSlider(MAX_FOV));
  const sceneRef = useRef<GlobeSceneHandle>(null);

  const handleSelect = useCallback((name: string | null) => {
    setSelectedCountry(name);
    onSelect?.(name);
  }, [onSelect]);

  const handleFovChange = useCallback((fov: number) => {
    setSliderValue(fovToSlider(fov));
  }, []);

  const handleSliderInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setSliderValue(v);
    sceneRef.current?.setFov(sliderToFov(v));
  }, []);

  const handleReset = useCallback(() => {
    sceneRef.current?.reset();
  }, []);

  useImperativeHandle(ref, () => ({ reset: handleReset }), [handleReset]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ fov: MAX_FOV, position: [CAMERA_DIST, 0, 0], near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <GlobeScene ref={sceneRef} onSelect={handleSelect} onFovChange={handleFovChange} />
      </Canvas>

      <div className="globe-zoom-slider-wrap">
        <span className="globe-zoom-label">−</span>
        <input
          className="globe-zoom-slider"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={sliderValue}
          onChange={handleSliderInput}
        />
        <span className="globe-zoom-label">+</span>
      </div>

      {showLabel && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center">
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
});
