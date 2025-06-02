// src/pages/AddressSettingsPage.tsx

import { useGetAddressQuery } from "@/api/address";
import {
  AddressRecord,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation
} from "@/api/auth.api";
import { Map } from "@/components/commons/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Coordinates } from "@/types/Coordinates";
import { Edit, MapPin, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddressFormValues {
  label: string;
  lat: number;
  lng: number;
}

export default function AddressSettingsPage() {
  // TODO: Replace with actual authenticated user ID
  const userId = "CURRENT_USER_ID";

  // Fetch all addresses for this user
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError,
    error: addressesFetchError
  } = useGetAddressesQuery();

  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressRecord | null>(
    null
  );

  // Default map coords (Cambodia)
  const [mapCoords, setMapCoords] = useState<Coordinates>({
    lat: 11.5564,
    lng: 104.9327
  });

  const form = useForm<AddressFormValues>({
    defaultValues: {
      label: "",
      lat: 11.5564,
      lng: 104.9327
    }
  });
  const { reset, control, handleSubmit, setValue, watch } = form;

  // Watch lat/lng for reverse-geocoding
  const watchedLat = watch("lat");
  const watchedLng = watch("lng");

  // Reverse-geocode address string
  const {
    data: fetchedAddress,
    isLoading: addressLoading,
    error: addressError
  } = useGetAddressQuery({ lat: watchedLat, lng: watchedLng });

  const addressDisplay = addressLoading
    ? "Loading..."
    : addressError instanceof Error
      ? addressError.message
      : fetchedAddress || "No address available";

  // Populate form when editing
  useEffect(() => {
    if (currentAddress) {
      reset({
        label: currentAddress.label,
        lat: currentAddress.location.coordinates[1],
        lng: currentAddress.location.coordinates[0]
      });
      setMapCoords({
        lat: currentAddress.location.coordinates[1],
        lng: currentAddress.location.coordinates[0]
      });
    } else {
      reset({
        label: "",
        lat: 11.5564,
        lng: 104.9327
      });
      setMapCoords({ lat: 11.5564, lng: 104.9327 });
    }
  }, [currentAddress, reset]);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setValue("lat", lat);
      setValue("lng", lng);
      setMapCoords({ lat, lng });
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<AddressFormValues> = async (values) => {
    const payload = {
      label: values.label,
      location: {
        type: "Point" as const,
        coordinates: [values.lng, values.lat] as [number, number],
        address: addressDisplay
      }
    };

    try {
      if (currentAddress) {
        await updateAddressMutation.mutateAsync({
          _id: currentAddress._id,
          ...payload
        });
      } else {
        await addAddressMutation.mutateAsync(payload);
      }
      setFormDialogOpen(false);
      setCurrentAddress(null);
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  const openAddDialog = () => {
    setCurrentAddress(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (addr: AddressRecord) => {
    setCurrentAddress(addr);
    setFormDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddressMutation.mutateAsync({ id });
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Manage Addresses</h1>

        {addressesLoading ? (
          <p>Loading addresses…</p>
        ) : addressesError ? (
          <p className="text-red-500">
            Error:{" "}
            {addressesFetchError instanceof Error
              ? addressesFetchError.message
              : ""}
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <Card key={index} className="border">
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium">{addr.label}</p>
                      <p className="text-sm text-gray-500">
                        {addr.location.address}
                      </p>
                      <p className="text-xs text-gray-400">
                        Lat: {addr.location.coordinates[1].toFixed(6)}, Lng:{" "}
                        {addr.location.coordinates[0].toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1"
                      onClick={() => openEditDialog(addr)}
                    >
                      <Edit className="h-5 w-5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(addr._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed border-gray-300">
              <CardContent className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={openAddDialog}
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Address</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog
        open={formDialogOpen}
        onOpenChange={() => setFormDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {currentAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              {/* Label Input */}
              <FormField
                control={control}
                name="label"
                rules={{ required: "Label is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label (e.g. Home, Office)</FormLabel>
                    <FormControl>
                      <Input placeholder="Home" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden lat & lng */}
              <input type="hidden" {...form.register("lat")} />
              <input type="hidden" {...form.register("lng")} />

              {/* Read-only address display */}
              <FormItem>
                <FormLabel>Selected Address</FormLabel>
                <FormControl>
                  <Input value={addressDisplay} readOnly />
                </FormControl>
              </FormItem>

              {/* Inline Map Selector */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Select Location
                </p>
                <div className="h-[300px] w-full rounded-md overflow-hidden border border-gray-200">
                  <Map
                    coordinates={{ lat: watchedLat, lng: watchedLng }}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <p className="text-sm">
                  Coordinates: {watchedLat.toFixed(6)}, {watchedLng.toFixed(6)}
                </p>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full">
                  {currentAddress ? "Save Changes" : "Add Address"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
