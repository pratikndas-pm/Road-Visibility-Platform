
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export type Pin = { id: string; lat: number; lng: number; caption?: string };

const UAEMap: React.FC<{ pins: Pin[] }> = ({ pins }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [54.5, 24.5],
      zoom: 6
    });
    pins.forEach(p => {
      const el = document.createElement('div');
      el.className = 'bg-blue-500 text-white text-[10px] px-2 py-1 rounded shadow';
      el.innerText = p.id;
      new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
    });
    return () => map.remove();
  }, [pins]);
  return <div ref={ref} className="w-full h-full" />;
};
export default UAEMap;
