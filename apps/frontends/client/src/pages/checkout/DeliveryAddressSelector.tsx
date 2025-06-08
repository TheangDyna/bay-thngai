// src/components/DeliveryAddressSelector.tsx

import { useGetAddressQuery } from "@/api/address";
import { useGetAddressesQuery } from "@/api/auth.api";
import { Map } from "@/components/commons/Map";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Coordinates } from "@/types/Coordinates";
import { getCurrentPosition } from "@/utils/location";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

interface DeliveryAddressSelectorProps {
  onAddressChange: (info: {
    id: string;
    label: string;
    coords: Coordinates | null;
    address?: string;
  }) => void;
}

type AddressRecord = {
  _id: string;
  label: string;
  location: { coordinates: [number, number]; address?: string };
};

export const DeliveryAddressSelector: React.FC<
  DeliveryAddressSelectorProps
> = ({ onAddressChange }) => {
  // 📍 Default center (Phnom Penh) — used only for initial map region
  const DEFAULT_COORDS: Coordinates = { lat: 11.5564, lng: 104.9327 };

  // 1) fetch saved addresses
  const {
    data: addrsResp = [],
    isLoading: addrsLoading,
    isError: addrsError,
    error: addrsFetchError
  } = useGetAddressesQuery();
  const addresses: AddressRecord[] = Array.isArray(addrsResp)
    ? addrsResp
    : addrsResp && "data" in addrsResp
      ? (addrsResp as { data: AddressRecord[] }).data
      : [];

  // 2) local state
  const [selectedId, setSelectedId] = useState("current");
  const [currentCoords, setCurrentCoords] =
    useState<Coordinates>(DEFAULT_COORDS);
  const [savedCoords, setSavedCoords] = useState<Coordinates | null>(null);

  // track when real GPS has arrived
  const [locationLoaded, setLocationLoaded] = useState(false);

  const isCurrent = selectedId === "current";
  const CURRENT_LABEL = "Current Location";

  // 3) get browser location on mount (and again if re-select “current”)
  const fetchBrowserLocation = useCallback(async () => {
    try {
      const pos = await getCurrentPosition();
      const { latitude: lat, longitude: lng } = pos.coords;
      if (isNaN(lat) || isNaN(lng)) throw new Error("Invalid coords");
      setCurrentCoords({ lat, lng });
      onAddressChange({
        id: "current",
        label: CURRENT_LABEL,
        coords: { lat, lng }
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err.message || "Enable location services."
      });
      setCurrentCoords(DEFAULT_COORDS);
      onAddressChange({ id: "current", label: CURRENT_LABEL, coords: null });
    } finally {
      setLocationLoaded(true);
    }
  }, [onAddressChange]);

  useEffect(() => {
    fetchBrowserLocation();
  }, []);

  // 4) reverse-geocode whenever currentCoords changes
  const {
    data: fetchedAddress,
    isLoading: addrLoading,
    error
  } = useGetAddressQuery(currentCoords);

  // inform parent once we finally have a real address
  useEffect(() => {
    if (isCurrent && locationLoaded && !addrLoading) {
      onAddressChange({
        id: "current",
        label: CURRENT_LABEL,
        coords: currentCoords,
        address: fetchedAddress
      });
    }
  }, [
    isCurrent,
    locationLoaded,
    addrLoading,
    fetchedAddress,
    currentCoords,
    onAddressChange
  ]);

  // 6) handle saved-address selection
  useEffect(() => {
    if (!isCurrent) {
      const found = addresses.find((a) => a._id === selectedId);
      if (found) {
        const [lng, lat] = found.location.coordinates;
        setSavedCoords({ lat, lng });
        onAddressChange({
          id: found._id,
          label: found.label,
          coords: { lat, lng },
          address: found.location.address
        });
      }
    }
  }, [isCurrent, selectedId, addresses, onAddressChange]);

  // 7) helper to re-center the saved-address map
  const RecenterMap: React.FC<{ coords: Coordinates }> = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([coords.lat, coords.lng], map.getZoom(), { animate: false });
    }, [coords, map]);
    return null;
  };

  return (
    <div className="space-y-6">
      {/* ─── Choice List ───────────────────────────────────────── */}
      <RadioGroup
        value={selectedId}
        onValueChange={(val) => {
          setSelectedId(val);
          if (val === "current") {
            setLocationLoaded(false);
            fetchBrowserLocation();
          }
        }}
        className="space-y-4"
      >
        {/* Current Location */}
        <div
          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
            isCurrent
              ? "border-green-600 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => {
            setSelectedId("current");
            setLocationLoaded(false);
            fetchBrowserLocation();
          }}
        >
          <RadioGroupItem value="current" id="addr_current" />
          <div className="flex-1">
            <Label htmlFor="addr_current" className="font-medium">
              {CURRENT_LABEL}
            </Label>
            <p className="text-sm text-gray-500">
              {addrLoading
                ? "Loading address..."
                : error
                  ? `Error: ${(error as Error).message}`
                  : fetchedAddress || "No address available"}
            </p>
          </div>
        </div>

        {/* Saved Addresses */}
        {addrsLoading ? (
          <p>Loading saved addresses…</p>
        ) : addrsError ? (
          <p className="text-red-500">{(addrsFetchError as Error).message}</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-600">No saved addresses</p>
        ) : (
          addresses.map((a) => {
            const sel = a._id === selectedId;
            const [lng, lat] = a.location.coordinates;
            return (
              <div
                key={a._id}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                  sel
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedId(a._id)}
              >
                <RadioGroupItem value={a._id} id={`addr_${a._id}`} />
                <div className="flex-1">
                  <h3 className={`font-medium ${sel ? "text-green-800" : ""}`}>
                    {a.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {a.location.address ||
                      `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </RadioGroup>

      {/* ─── Map & Details for Current Location ──────────────── */}
      {isCurrent && locationLoaded && (
        <div className="space-y-4">
          <p className="font-medium">Select location on map</p>
          <Map
            coordinates={currentCoords}
            onLocationSelect={(lat, lng) => {
              setCurrentCoords({ lat, lng });
            }}
          />
          <p className="text-sm">
            <span className="font-medium">Coords:</span>{" "}
            {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* ─── Read-only Preview for Saved Address ─────────────── */}
      {!isCurrent && savedCoords && (
        <div className="space-y-2">
          <p className="font-medium">Location preview</p>
          <MapContainer
            center={[savedCoords.lat, savedCoords.lng]}
            zoom={16}
            className="h-64 w-full rounded-md border"
            minZoom={3}
            maxZoom={18}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap coords={savedCoords} />
            <Marker position={[savedCoords.lat, savedCoords.lng]} />
          </MapContainer>
          <p className="text-sm">
            <span className="font-medium">Coords:</span>{" "}
            {savedCoords.lat.toFixed(6)}, {savedCoords.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};
