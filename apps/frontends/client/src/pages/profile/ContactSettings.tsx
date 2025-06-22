// src/components/ContactSettings.tsx
import {
  ContactRecord,
  useAddContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useUpdateContactMutation
} from "@/api/contact";
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
import { Edit, Phone, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ContactFormValues {
  label: string;
  value: string;
}

const PHONE_REGEX = /^\+855\d{8,9}$/;

function formatPhone(raw: string): string {
  const match8 = raw.match(/^\+855(\d{2})(\d{3})(\d{3})$/);
  if (match8) {
    const [, op, p1, p2] = match8;
    return `+855 ${op} ${p1} ${p2}`;
  }
  const match9 = raw.match(/^\+855(\d{2})(\d{3})(\d{4})$/);
  if (match9) {
    const [, op, p1, p2] = match9;
    return `+855 ${op} ${p1} ${p2}`;
  }
  return raw;
}

export function ContactSettings() {
  const {
    data: contacts = [],
    isLoading: contactsLoading,
    isError: contactsError
  } = useGetContactsQuery();
  const addContactMutation = useAddContactMutation();
  const updateContactMutation = useUpdateContactMutation();
  const deleteContactMutation = useDeleteContactMutation();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactRecord | null>(
    null
  );

  const form = useForm<ContactFormValues>({
    defaultValues: { label: "", value: "" }
  });
  const { reset, control, handleSubmit } = form;

  useEffect(() => {
    if (currentContact) {
      reset({ label: currentContact.label, value: currentContact.value });
    } else {
      reset({ label: "", value: "" });
    }
  }, [currentContact, reset]);

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    const raw = values.value.replace(/\s+/g, "");
    if (!PHONE_REGEX.test(raw)) return;
    try {
      if (currentContact) {
        await updateContactMutation.mutateAsync({
          _id: currentContact._id,
          label: values.label,
          value: raw
        });
      } else {
        await addContactMutation.mutateAsync({
          label: values.label,
          value: raw
        });
      }
      setFormDialogOpen(false);
      setCurrentContact(null);
    } catch (err) {
      console.error("Error saving contact:", err);
    }
  };

  const openAddDialog = () => {
    setCurrentContact(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (contact: ContactRecord) => {
    setCurrentContact(contact);
    setFormDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Manage Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contactsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : contactsError ? (
            <p className="text-center text-red-500 py-8">
              Failed to load contacts. Please try again later.
            </p>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No contacts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((c) => (
                <Card key={c._id} className="border">
                  <CardContent className="flex justify-between items-center p-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">{c.label}</p>
                        <p className="text-sm text-gray-500">
                          {formatPhone(c.value)}
                        </p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                        onClick={() => openEditDialog(c)}
                      >
                        <Edit className="h-5 w-5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <Card className="border-dashed border-gray-300">
            <CardContent className="flex justify-center p-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={openAddDialog}
              >
                <Plus className="h-5 w-5" />
                <span>Add New Contact</span>
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {currentContact ? "Edit Contact" : "Add New Contact"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={control}
                name="label"
                rules={{ required: "Label is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label (e.g. Primary, Secondary)</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="value"
                rules={{
                  required: "Phone number is required",
                  validate: (val) => {
                    const raw = val.replace(/\s+/g, "");
                    return (
                      PHONE_REGEX.test(raw) ||
                      "Use format +855 followed by 8 or 9 digits"
                    );
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+85512345678"
                        {...field}
                        onBlur={(e) => {
                          const raw = e.target.value.replace(/\s+/g, "");
                          field.onChange(raw);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full">
                  {currentContact ? "Save Changes" : "Add Contact"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
