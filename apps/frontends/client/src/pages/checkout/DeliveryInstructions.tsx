// src/pages/checkout/DeliveryInstructions.tsx
import React from "react";

interface DeliveryInstructionsProps {
  instructions: string;
  onChange: (val: string) => void;
}

export const DeliveryInstructions: React.FC<DeliveryInstructionsProps> = ({
  instructions,
  onChange
}) => (
  <textarea
    placeholder="Any specific instructions for the driver?"
    value={instructions}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border rounded-md p-2 resize-none h-24"
  />
);
