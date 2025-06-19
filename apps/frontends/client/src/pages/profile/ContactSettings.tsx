// src/pages/ContactSettingsPage.tsx

import {
  ContactRecord,
  useAddContactMutation,
  useDeleteContactMutation,
  useGetContactsQuery,
  useUpdateContactMutation
} from "@/api/contact";
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
import { Edit, Phone, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ContactFormValues {
  label: string;
  value: string;
}

// ─── CAMBODIA PHONE REGEX & FORMAT ──────────────────────────────────────────
// Valid: +855 followed by one of the mobile prefixes (10,11,12,15,16,17,18,19)
// then either 6 or 7 digits. Examples:
//   +85512123456   →  +855 12 123 456   (8 digits after +855)
//   +855121234567  →  +855 12 123 4567  (9 digits after +855)
const PHONE_REGEX = /^\+855(?:10|11|12|15|16|17|18|19)(?:\d{6}|\d{7})$/;

function formatPhone(raw: string): string {
  // raw is like "+85512123456" or "+855121234567"
  const match8 = raw.match(/^\+855(\d{2})(\d{3})(\d{3})$/);
  if (match8) {
    const [, operator, part1, part2] = match8;
    return `+855 ${operator} ${part1} ${part2}`;
  }
  const match9 = raw.match(/^\+855(\d{2})(\d{3})(\d{4})$/);
  if (match9) {
    const [, operator, part1, part2] = match9;
    return `+855 ${operator} ${part1} ${part2}`;
  }
  return raw;
}

export function ContactSettings() {
  const {
    data: contacts = [],
    isLoading: contactsLoading,
    isError: contactsError,
    error: contactsFetchError
  } = useGetContactsQuery();

  const addContactMutation = useAddContactMutation();
  const updateContactMutation = useUpdateContactMutation();
  const deleteContactMutation = useDeleteContactMutation();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactRecord | null>(
    null
  );

  const form = useForm<ContactFormValues>({
    defaultValues: {
      label: "",
      value: ""
    }
  });
  const { reset, control, handleSubmit } = form;

  // Prefill form when editing
  useEffect(() => {
    if (currentContact) {
      reset({
        label: currentContact.label,
        // keep raw value in input, no spaces
        value: currentContact.value
      });
    } else {
      reset({ label: "", value: "" });
    }
  }, [currentContact, reset]);

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    // Strip any spaces the user typed (though input won't show spaces)
    const rawValue = values.value.replace(/\s+/g, "");
    if (!PHONE_REGEX.test(rawValue)) {
      // react-hook-form validation should catch this, but double-check
      return;
    }

    try {
      if (currentContact) {
        await updateContactMutation.mutateAsync({
          _id: currentContact._id,
          label: values.label,
          value: rawValue
        });
      } else {
        await addContactMutation.mutateAsync({
          label: values.label,
          value: rawValue
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
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">Manage Contacts</h1>

        {contactsLoading ? (
          <p>Loading contacts…</p>
        ) : contactsError ? (
          <p className="text-red-500">
            Error:{" "}
            {contactsFetchError instanceof Error
              ? contactsFetchError.message
              : ""}
          </p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact._id} className="border">
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium">{contact.label}</p>
                      <p className="text-sm text-gray-500">
                        {formatPhone(contact.value)}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit className="h-5 w-5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(contact._id)}
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
                  <span>Add New Contact</span>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {currentContact ? "Edit Contact" : "Add New Contact"}
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
                    <FormLabel>Label (e.g. Primary, Secondary)</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Input */}
              <FormField
                control={control}
                name="value"
                rules={{
                  required: "Phone number is required",
                  validate: (val) => {
                    const raw = val.replace(/\s+/g, "");
                    return (
                      PHONE_REGEX.test(raw) ||
                      "Use format +855XXXXXXXX or +855XXXXXXXXX"
                    );
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+85512123456"
                        {...field}
                        onBlur={(e) => {
                          // Remove any spaces on blur; keep raw digits
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
