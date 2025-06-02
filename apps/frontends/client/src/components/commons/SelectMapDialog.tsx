// src/pages/AddressSettingsPage.tsx
import { useGetAddressQuery } from "@/api/address";
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
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Address {
  id: string;
  label: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface AddressFormValues {
  label: string;
  lat: number;
  lng: number;
  address: string;
}

export default function AddressSettingsPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      location: {
        lat: 11.5564,
        lng: 104.916,
        address: "123 Main St, Phnom Penh"
      }
    },
    {
      id: "2",
      label: "Office",
      location: {
        lat: 13.3611,
        lng: 103.856,
        address: "456 Business Rd, Siem Reap"
      }
    }
  ]);

  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  // Map coordinates / form defaults
  const [mapCoords, setMapCoords] = useState<Coordinates>({
    lat: 11.5564,
    lng: 104.9327
  });

  const form = useForm<AddressFormValues>({
    defaultValues: {
      label: "",
      lat: 11.5564,
      lng: 104.9327,
      address: ""
    }
  });
  const { reset, control, handleSubmit, setValue, watch } = form;

  // Watch lat / lng / address fields
  const watchedLat = watch("lat");
  const watchedLng = watch("lng");
  const watchedAddress = watch("address");

  // Fetch reverse-geocoded address whenever coordinates change
  const {
    data: fetchedAddress,
    isLoading,
    error
  } = useGetAddressQuery({
    lat: watchedLat,
    lng: watchedLng
  });

  // Populate form's address field with fetched address
  useEffect(() => {
    if (fetchedAddress) {
      setValue("address", fetchedAddress);
    }
  }, [fetchedAddress, setValue]);

  // When opening form for add/edit, populate fields and map
  useEffect(() => {
    if (currentAddress) {
      reset({
        label: currentAddress.label,
        lat: currentAddress.location.lat,
        lng: currentAddress.location.lng,
        address: currentAddress.location.address
      });
      setMapCoords({
        lat: currentAddress.location.lat,
        lng: currentAddress.location.lng
      });
    } else {
      reset({
        label: "",
        lat: 11.5564,
        lng: 104.9327,
        address: ""
      });
      setMapCoords({ lat: 11.5564, lng: 104.9327 });
    }
  }, [currentAddress, reset]);

  // When user clicks on the map, update form's lat / lng
  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setValue("lat", lat);
      setValue("lng", lng);
      setMapCoords({ lat, lng });
      // address will update automatically via useGetAddressQuery
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<AddressFormValues> = (values) => {
    const newAddress: Address = {
      id: currentAddress ? currentAddress.id : nanoid(),
      label: values.label,
      location: {
        lat: values.lat,
        lng: values.lng,
        address: values.address
      }
    };

    if (currentAddress) {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === currentAddress.id ? newAddress : addr))
      );
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }
    setFormDialogOpen(false);
  };

  const openAddDialog = () => {
    setCurrentAddress(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (addr: Address) => {
    setCurrentAddress(addr);
    setFormDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Manage Addresses</h1>

        <div className="space-y-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className="border">
              <CardContent className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">{addr.label}</p>
                    <p className="text-sm text-gray-500">
                      {addr.location.address}
                    </p>
                    <p className="text-xs text-gray-400">
                      Lat: {addr.location.lat.toFixed(6)}, Lng:{" "}
                      {addr.location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => openEditDialog(addr)}
                >
                  <Edit className="h-5 w-5" />
                  <span>Edit</span>
                </Button>
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
      </main>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
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

              {/* Hidden latitude & longitude */}
              <input type="hidden" {...form.register("lat")} />
              <input type="hidden" {...form.register("lng")} />

              {/* Address Input (shows fetched address but is editable) */}
              <FormField
                control={control}
                name="address"
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selected Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                <p className="text-sm text-gray-500">
                  {isLoading
                    ? "Loading address..."
                    : error
                      ? `Error: ${(error as Error).message}`
                      : fetchedAddress || "No address available"}
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
