// src/pages/checkout/ContactSelector.tsx
import { ContactRecord, useGetContactsQuery } from "@/api/contact";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect } from "react";

interface ContactSelectorProps {
  selectedContactId: string;
  contactNumber: string;
  onSelectContact: (id: string) => void;
  onEnterNumber: (num: string) => void;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  selectedContactId,
  contactNumber,
  onSelectContact,
  onEnterNumber
}) => {
  const {
    data: contacts = [],
    isLoading,
    isError,
    error
  } = useGetContactsQuery();

  // auto-select the primary (or first) on first load
  useEffect(() => {
    if (!selectedContactId && !isLoading && contacts.length > 0) {
      const primary =
        (contacts as (ContactRecord & { primary?: boolean })[]).find(
          (c) => c.primary
        ) || contacts[0];
      onSelectContact(primary._id);
      onEnterNumber(primary.value);
    }
  }, [selectedContactId, isLoading, contacts, onSelectContact, onEnterNumber]);

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedContactId}
        onValueChange={onSelectContact}
        className="space-y-3"
      >
        {isLoading ? (
          <p>Loading contacts…</p>
        ) : isError ? (
          <p className="text-red-500">{(error as Error).message}</p>
        ) : (
          contacts.map((ct) => {
            const isSelected = ct._id === selectedContactId;
            return (
              <div
                key={ct._id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => onSelectContact(ct._id)}
              >
                <RadioGroupItem value={ct._id} id={`contact_${ct._id}`} />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isSelected ? "text-green-800" : "text-gray-800"
                    }`}
                  >
                    {ct.label}
                  </p>
                  <p className="text-gray-600">{ct.value}</p>
                </div>
              </div>
            );
          })
        )}
      </RadioGroup>

      <div>
        <Label htmlFor="contactNumber">Or enter new number</Label>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="+855XXXXXXXX"
          value={contactNumber}
          onChange={(e) => onEnterNumber(e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};
