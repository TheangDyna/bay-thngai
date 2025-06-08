// src/pages/checkout/DeliveryInstructions.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface DeliveryInstructionsProps {
  instructions: string;
  onChange: (val: string) => void;
  leaveAtDoor: boolean;
  onToggleLeaveAtDoor: (val: boolean) => void;
}

export const DeliveryInstructions: React.FC<DeliveryInstructionsProps> = ({
  instructions,
  onChange,
  leaveAtDoor,
  onToggleLeaveAtDoor
}) => (
  <div className="space-y-6">
    <div className="space-y-1">
      <Label htmlFor="deliveryInstructionsNote">
        Delivery Instructions Note
      </Label>
      <textarea
        id="deliveryInstructionsNote"
        placeholder="Any specific instructions for the driver?"
        value={instructions}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          border border-gray-300
          rounded-md
          p-4
          resize-none
          h-32
          focus:outline-none
          focus:border-green-500
          focus:ring-1 focus:ring-green-200
        "
      />
    </div>

    <div className="flex items-start space-x-3">
      <Checkbox
        id="leaveAtDoor"
        checked={leaveAtDoor}
        onCheckedChange={(checked) => onToggleLeaveAtDoor(!!checked)}
      />
      <div className="space-y-1">
        <Label htmlFor="leaveAtDoor" className="font-medium">
          Leave at my door if I am not around
        </Label>
        <p className="text-sm text-gray-600">
          By selecting this option you accept full responsibility for your order
          after it has been delivered unattended, including any loss due to
          theft or damage due to temperature sensitivity.
        </p>
      </div>
    </div>
  </div>
);
