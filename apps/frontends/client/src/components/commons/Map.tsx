import { LocationButton } from "@/components/commons/LocationButton";
import { LocationMarker } from "@/components/commons/LocationMarker";
import { Coordinates } from "@/types/Coordinates";
import "leaflet/dist/leaflet.css";
import { useCallback, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  coordinates: Coordinates;
}

export const Map: React.FC<MapProps> = ({
  onLocationSelect,
  coordinates
}: MapProps) => {
  const mapRef = useRef<any | null>(null);
  const position: [number, number] = [coordinates.lat, coordinates.lng];

  const handleCurrentLocation = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current) return;
      mapRef.current.setView([lat, lng], 16, {
        animate: true,
        duration: 0.5
      });
      onLocationSelect(lat, lng);
    },
    [onLocationSelect]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LocationButton onLocation={handleCurrentLocation} />
      </div>
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={16}
        className="h-[350px] w-full rounded-md"
        minZoom={3}
        maxZoom={18}
        bounceAtZoomLimits={true}
        maxBounds={[
          [5.0, 60.0],
          [75.0, 150.0]
        ]}
        maxBoundsViscosity={1.0}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};
