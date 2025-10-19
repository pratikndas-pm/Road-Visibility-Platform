import React, { useEffect, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';

type Position = { lat: number; lng: number; }
export type ShipmentPin = { id: string; caption: string; pos: Position; };

type Props = {
  pins: ShipmentPin[];
  styleUrl?: string;
  geofenceUrl?: string;
  onPinClick?: (id: string) => void;
};

export default function MapView({
  pins,
  styleUrl = import.meta.env.VITE_MAP_STYLE || 'https://demotiles.maplibre.org/style.json',
  geofenceUrl,
  onPinClick,
}: Props) {
  const mapRef = useRef<Map | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current || !hostRef.current) return;
    const map = new maplibregl.Map({
      container: hostRef.current,
      style: styleUrl,
      center: [55.27, 25.20],
      zoom: 6,
      attributionControl: true,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', async () => {
      if (geofenceUrl) {
        try {
          const res = await fetch(geofenceUrl);
          const geo = await res.json();
          map.addSource('geofences', { type: 'geojson', data: geo });
          map.addLayer({ id:'geofences-fill', type:'fill', source:'geofences', paint:{'fill-color':'#22c55e','fill-opacity':0.12} });
          map.addLayer({ id:'geofences-line', type:'line', source:'geofences', paint:{'line-color':'#16a34a','line-width':1.5} });
        } catch {}
      }
    });

    mapRef.current = map;
    return () => { map.remove(); };
  }, [styleUrl, geofenceUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (map as any)._roadiqMarkers?.forEach((m: maplibregl.Marker) => m.remove());
    (map as any)._roadiqMarkers = [];

    const bounds = new maplibregl.LngLatBounds();

    pins.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'rounded-full border bg-white px-2 py-1 text-xs shadow';
      el.style.cursor = 'pointer';
      el.innerText = p.id;
      el.onclick = () => onPinClick && onPinClick(p.id);

      const mk = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([p.pos.lng, p.pos.lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML('<div style="font-weight:600">'+p.id+'</div><div style="font-size:12px">'+p.caption+'</div>'))
        .addTo(map);
      (map as any)._roadiqMarkers.push(mk);
      bounds.extend([p.pos.lng, p.pos.lat]);
    });

    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 60, duration: 500 });
  }, [pins]);

  return <div ref={hostRef} className="h-[420px] rounded-2xl border overflow-hidden" />;
}
