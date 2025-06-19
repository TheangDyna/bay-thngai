// src/pages/AddressSettingsPage.tsx

import { useGetAddressQuery } from "@/api/address";
import {
  AddressRecord,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation
} from "@/api/auth";
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
import { Edit, MapPin, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddressFormValues {
  label: string;
  lat: number;
  lng: number;
}

export function AddressSettings() {
  // 1) Fetch all addresses for this user
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

  // 2) Initialize form (with default lat/lng somewhere in Cambodia)
  const form = useForm<AddressFormValues>({
    defaultValues: {
      label: "",
      lat: 11.5564,
      lng: 104.9327
    }
  });
  const { control, register, handleSubmit, setValue, watch, reset } = form;

  // 3) Watch lat/lng so we can reverse‐geocode & re‐center the map
  const watchedLat = watch("lat");
  const watchedLng = watch("lng");

  // 4) Reverse‐geocode into a human‐readable string
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

  // 5) Whenever the user clicks on the map, update form's lat/lng
  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setValue("lat", lat);
      setValue("lng", lng);
    },
    [setValue]
  );

  // 6) On form submit, either add or update
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

  // 7) Open “Add New” dialog → reset everything to defaults
  const openAddDialog = () => {
    setCurrentAddress(null);
    reset({
      label: "",
      lat: 11.5564,
      lng: 104.9327
    });
    setFormDialogOpen(true);
  };

  // 8) Open “Edit” dialog → populate with existing values
  const openEditDialog = (addr: AddressRecord) => {
    setCurrentAddress(addr);

    // GeoJSON stores as [lng, lat], so flip them
    const existingLat = addr.location.coordinates[1];
    const existingLng = addr.location.coordinates[0];

    reset({
      label: addr.label,
      lat: existingLat,
      lng: existingLng
    });

    setFormDialogOpen(true);
  };

  // 9) Delete handler
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
            {addresses.map((addr, idx) => (
              <Card key={idx} className="border">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Label */}
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

              {/* Hidden lat & lng inputs (registered via `register`) */}
              <input type="hidden" {...register("lat")} />
              <input type="hidden" {...register("lng")} />

              {/* Read‐only address string */}
              <FormItem>
                <FormLabel>Selected Address</FormLabel>
                <FormControl>
                  <Input value={addressDisplay} readOnly />
                </FormControl>
              </FormItem>

              {/* Inline Map Selector (fixed height container) */}
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
