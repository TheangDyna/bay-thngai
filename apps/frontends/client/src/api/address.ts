// src/api/address.ts
import { Coordinates } from "@/types/Coordinates";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";

export const useGetAddressQuery = (
  coordinates: Coordinates
): UseQueryResult<string, Error> => {
  const [debouncedCoordinates] = useDebounce(coordinates, 500);
  return useQuery({
    queryKey: ["address", debouncedCoordinates.lat, debouncedCoordinates.lng],
    queryFn: async () => {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json",
            lat: debouncedCoordinates.lat,
            lon: debouncedCoordinates.lng,
            zoom: 13,
            addressdetails: 1
          }
        }
      );
      return response.data.display_name as string;
    },
    enabled:
      debouncedCoordinates.lat !== undefined &&
      debouncedCoordinates.lng !== undefined,
    staleTime: Infinity,
    retry: 1
  });
};
