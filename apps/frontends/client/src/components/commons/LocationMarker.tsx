import L, { LatLng } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";

interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const PinIcon = new L.Icon({
  iconUrl: "/pin.png", // Place in public/icons/
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  onLocationSelect
}: LocationMarkerProps) => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMap();

  const updatePosition = useCallback(
    (newPosition: LatLng) => {
      setPosition((prevPosition) => {
        if (prevPosition?.equals(newPosition)) {
          return prevPosition;
        }
        return newPosition;
      });
      onLocationSelect(newPosition.lat, newPosition.lng);
    },
    [onLocationSelect]
  );

  useMapEvents({
    click(e) {
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
        duration: 0.5
      });
      updatePosition(e.latlng);
    },
    move() {
      updatePosition(map.getCenter());
    }
  });

  useEffect(() => {
    const center = map.getCenter();
    setPosition(center);
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={PinIcon} zIndexOffset={1000} />
  );
};
