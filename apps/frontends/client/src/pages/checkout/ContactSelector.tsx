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

  // Auto-select the primary (or first) contact on first load
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

  // Handle contact selection
  const handleSelectContact = (id: string) => {
    onSelectContact(id);
    const selectedContact = contacts.find((c) => c._id === id);
    if (selectedContact) {
      onEnterNumber(selectedContact.value);
    }
  };

  // Handle manual input change
  const handleInputChange = (value: string) => {
    onEnterNumber(value);
    if (selectedContactId !== "custom") {
      onSelectContact("custom"); // Mark as custom input
    }
  };

  // Format phone number for display
  const displayedNumber =
    selectedContactId === "custom" ? contactNumber : formatPhone(contactNumber);

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedContactId}
        onValueChange={handleSelectContact}
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
                onClick={() => handleSelectContact(ct._id)}
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
                  <p className="text-gray-600">{formatPhone(ct.value)}</p>
                </div>
              </div>
            );
          })
        )}
        {/* Custom input option */}
        <div
          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
            selectedContactId === "custom"
              ? "border-green-600 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
          onClick={() => onSelectContact("custom")}
        >
          <RadioGroupItem value="custom" id="contact_custom" />
          <div className="flex-1">
            <p
              className={`font-medium ${
                selectedContactId === "custom"
                  ? "text-green-800"
                  : "text-gray-800"
              }`}
            >
              Enter new number
            </p>
          </div>
        </div>
      </RadioGroup>

      {(selectedContactId === "custom" || contacts.length === 0) && (
        <div>
          <Label htmlFor="contactNumber">Phone number</Label>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="+85512345678"
            value={displayedNumber}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={(e) => {
              const raw = e.target.value.replace(/\s+/g, "");
              if (raw && !PHONE_REGEX.test(raw)) {
                onEnterNumber(raw); // Keep invalid input for validation error
              } else {
                onEnterNumber(raw);
              }
            }}
            className="mt-1"
            onFocus={() => onSelectContact("custom")}
          />
          {selectedContactId === "custom" &&
            contactNumber.replace(/\s+/g, "") &&
            !PHONE_REGEX.test(contactNumber.replace(/\s+/g, "")) && (
              <p className="text-red-500 text-sm mt-1">
                Use format +855 followed by 8 or 9 digits
              </p>
            )}
        </div>
      )}
    </div>
  );
};
