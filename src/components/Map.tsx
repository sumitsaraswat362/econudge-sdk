'use client';

import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix leaflet default icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function Map({ origin, destination }: { origin: [number, number]; destination: [number, number] }) {
  const center: [number, number] = [
    (origin[0] + destination[0]) / 2,
    (origin[1] + destination[1]) / 2,
  ];

  useEffect(() => {
    // Delete default icon to prevent missing icon error
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="h-40 w-full overflow-hidden rounded-xl border border-white/10 mb-4 z-0">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={origin} icon={icon} />
        <Marker position={destination} icon={icon} />
        <Polyline positions={[origin, destination]} color="#10b981" weight={4} dashArray="10, 10" />
      </MapContainer>
    </div>
  );
}
