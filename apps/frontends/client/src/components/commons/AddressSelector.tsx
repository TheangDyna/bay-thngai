// src/components/AddressSelector.tsx

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
}

const mockAddresses: Address[] = [
  {
    id: "home",
    label: "Home",
    line1: "Wolfson Institute of Preventive Medicine,",
    line2: "London EC1M 7BA, UK"
  },
  {
    id: "office",
    label: "Office",
    line1: "80 Windsor Park Rd,",
    line2: "Singapore 574175"
  }
];

export const AddressSelector: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("home");

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleNext = () => {
    // advance to next step in checkout flow
    console.log("Selected Address:", selectedId);
    // e.g. navigate("/checkout/schedule");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Title */}
      <div className="flex items-center space-x-2">
        <span className="text-green-600 font-bold text-lg">1</span>
        <h2 className="text-2xl font-semibold">Delivery Address</h2>
      </div>

      {/* Address Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAddresses.map((addr) => {
          const isSelected = addr.id === selectedId;
          return (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr.id)}
              className={`relative cursor-pointer rounded-lg p-5 border 
                ${
                  isSelected
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
            >
              {/* Edit Icon */}
              {isSelected && (
                <button
                  className="absolute top-3 right-3 text-green-600 hover:text-green-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    // open edit modal or navigate to edit screen
                    console.log("Edit", addr.id);
                  }}
                >
                  <Pencil size={18} />
                </button>
              )}

              {/* Label */}
              <h3
                className={`text-lg font-medium mb-1 ${
                  isSelected ? "text-green-800" : "text-gray-800"
                }`}
              >
                {addr.label}
              </h3>

              {/* Lines */}
              <p className="text-gray-600">{addr.line1}</p>
              {addr.line2 && <p className="text-gray-600">{addr.line2}</p>}
            </div>
          );
        })}

        {/* Add New Address Card */}
        <div
          onClick={() => {
            // open "Add Address" modal or navigate
            console.log("Add new address");
          }}
          className="flex items-center justify-center rounded-lg p-5 border border-gray-200 bg-white hover:border-gray-300 cursor-pointer"
        >
          <span className="text-green-600 font-medium text-lg">
            + Add Address
          </span>
        </div>
      </div>

      {/* Next Steps Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700"
        >
          Next Steps
        </Button>
      </div>
    </div>
  );
};
