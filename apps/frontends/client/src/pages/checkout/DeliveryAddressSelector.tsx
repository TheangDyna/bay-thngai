import { AddressRecord } from "@/api/auth.api";
import { Map } from "@/components/commons/Map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Coordinates } from "@/types/Coordinates";
import React, { useCallback, useEffect, useState } from "react";

interface DeliveryAddressSelectorProps {
  addresses: AddressRecord[];
  addressesLoading: boolean;
  addressesError: boolean;
  addressesFetchError: Error | null;
  onAddressChange: (info: {
    id: string;
    label: string;
    coords: Coordinates | null;
  }) => void;
}

export const DeliveryAddressSelector: React.FC<
  DeliveryAddressSelectorProps
> = ({
  addresses,
  addressesLoading,
  addressesError,
  addressesFetchError,
  onAddressChange
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>("current");
  const [newAddressLabel, setNewAddressLabel] =
    useState<string>("Current Location");
  const [selectedCoords, setSelectedCoords] = useState<Coordinates | null>(
    null
  );

  // On mount (and whenever selectedAddressId changes), fetch geolocation if "current"
  useEffect(() => {
    if (selectedAddressId === "current") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setSelectedCoords(coords);
          onAddressChange({ id: "current", label: newAddressLabel, coords });
        },
        () => {
          setSelectedCoords(null);
          onAddressChange({
            id: "current",
            label: newAddressLabel,
            coords: null
          });
        }
      );
    } else {
      const addr = addresses.find((a) => a._id === selectedAddressId);
      if (addr) {
        const [lng, lat] = addr.location.coordinates;
        const coords = { lat, lng };
        setSelectedCoords(coords);
        onAddressChange({ id: addr._id, label: addr.label, coords });
      }
    }
  }, [selectedAddressId, addresses, newAddressLabel, onAddressChange]);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      const coords = { lat, lng };
      setSelectedCoords(coords);
      onAddressChange({ id: "current", label: newAddressLabel, coords });
    },
    [newAddressLabel, onAddressChange]
  );

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedAddressId}
        onValueChange={(val) => setSelectedAddressId(val)}
        className="space-y-4"
      >
        {/* Option: Current Location */}
        <div
          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
            selectedAddressId === "current"
              ? "border-green-600 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
          onClick={() => setSelectedAddressId("current")}
        >
          <RadioGroupItem value="current" id="addr_current" />
          <Label htmlFor="addr_current" className="font-medium text-gray-800">
            Use Current Location
          </Label>
        </div>

        {/* Existing addresses */}
        {addressesLoading ? (
          <p>Loading saved addresses…</p>
        ) : addressesError ? (
          <p className="text-red-500">Error: {addressesFetchError?.message}</p>
        ) : (
          addresses.map((addr) => {
            const isSelected = addr._id === selectedAddressId;
            return (
              <div
                key={addr._id}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => setSelectedAddressId(addr._id)}
              >
                <RadioGroupItem value={addr._id} id={`addr_${addr._id}`} />
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      isSelected ? "text-green-800" : "text-gray-800"
                    }`}
                  >
                    {addr.label}
                  </h3>
                  <p className="text-gray-600">
                    {addr.location.address ||
                      `${addr.location.coordinates[1].toFixed(5)}, ${addr.location.coordinates[0].toFixed(5)}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </RadioGroup>

      {/* If "current" is selected, show label input + map */}
      {selectedAddressId === "current" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="newAddressLabel">Label for this location</Label>
            <Input
              id="newAddressLabel"
              value={newAddressLabel}
              onChange={(e) => {
                setNewAddressLabel(e.target.value);
                onAddressChange({
                  id: "current",
                  label: e.target.value,
                  coords: selectedCoords
                });
              }}
              placeholder="e.g. Home, Office"
              className="mt-1"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Select location on map
            </p>
            <div className="h-64 w-full rounded-md overflow-hidden border border-gray-200">
              <Map
                coordinates={selectedCoords || { lat: 11.5564, lng: 104.9327 }}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            {selectedCoords && (
              <p className="text-sm">
                Coordinates: {selectedCoords.lat.toFixed(6)},{" "}
                {selectedCoords.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* If an existing address is selected, show read-only map preview */}
      {selectedAddressId !== "current" && selectedCoords && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Location preview</p>
          <div className="h-64 w-full rounded-md overflow-hidden border border-gray-200">
            <Map coordinates={selectedCoords} onLocationSelect={() => {}} />
          </div>
          <p className="text-sm">
            Coordinates: {selectedCoords.lat.toFixed(6)},{" "}
            {selectedCoords.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};
