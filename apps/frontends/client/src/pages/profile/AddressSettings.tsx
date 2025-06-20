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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, MapPin, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddressFormValues {
  label: string;
  lat: number;
  lng: number;
}

export function AddressSettings() {
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    isError: addressesError
  } = useGetAddressesQuery();
  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressRecord | null>(
    null
  );

  const form = useForm<AddressFormValues>({
    defaultValues: { label: "", lat: 11.5564, lng: 104.9327 }
  });
  const { control, register, handleSubmit, setValue, watch, reset } = form;

  const watchedLat = watch("lat"),
    watchedLng = watch("lng");
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

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setValue("lat", lat);
      setValue("lng", lng);
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
    reset({ label: "", lat: 11.5564, lng: 104.9327 });
    setFormDialogOpen(true);
  };
  const openEditDialog = (addr: AddressRecord) => {
    setCurrentAddress(addr);
    reset({
      label: addr.label,
      lat: addr.location.coordinates[1],
      lng: addr.location.coordinates[0]
    });
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
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Manage Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {addressesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : addressesError ? (
            <p className="text-center text-red-500 py-8">
              Failed to load addresses. Please try again later.
            </p>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No addresses found.</p>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={openAddDialog}
              >
                <Plus className="h-5 w-5" />
                <span>Add New Address</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <Card key={addr._id} className="border">
                  <CardContent className="flex justify-between items-center p-4">
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
                <CardContent className="flex justify-center p-4">
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
        </CardContent>
      </Card>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {currentAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <input type="hidden" {...register("lat")} />
              <input type="hidden" {...register("lng")} />
              <FormItem>
                <FormLabel>Selected Address</FormLabel>
                <FormControl>
                  <Input value={addressDisplay} readOnly />
                </FormControl>
              </FormItem>
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
