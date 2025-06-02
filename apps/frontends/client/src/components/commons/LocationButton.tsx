import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getCurrentPosition } from "@/utils/location";
import { useState } from "react";

interface LocationButtonProps {
  onLocation: (lat: number, lng: number) => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocation
}: LocationButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number" ||
        isNaN(latitude) ||
        isNaN(longitude)
      ) {
        throw new Error("Invalid coordinates received");
      }

      onLocation(latitude, longitude);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof GeolocationPositionError
            ? getGeolocationErrorMessage(error.code)
            : "Could not get your location. Please ensure location services are enabled."
      });
    } finally {
      setLoading(false);
    }
  };

  const getGeolocationErrorMessage = (code: number): string => {
    switch (code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return "Location permission denied. Please enable it in your browser settings.";
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case GeolocationPositionError.TIMEOUT:
        return "The request to get your location timed out.";
      default:
        return "An unknown error occurred while getting your location.";
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="secondary"
      aria-label={loading ? "Getting location" : "Get current location"}
      type="button"
    >
      {loading ? "Getting location..." : "Get Current Location"}
    </Button>
  );
};
