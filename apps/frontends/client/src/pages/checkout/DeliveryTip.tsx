// src/pages/checkout/DeliveryTip.tsx
import { Button } from "@/components/ui/button";
import React from "react";

interface DeliveryTipProps {
  tipOptions?: number[];
  selectedTip: number;
  onTipSelect: (tip: number) => void;
}

export const DeliveryTip: React.FC<DeliveryTipProps> = ({
  tipOptions = [5, 10, 15, 20, 25],
  selectedTip,
  onTipSelect
}) => (
  <div className="flex space-x-3">
    {tipOptions.map((tip) => (
      <Button
        key={tip}
        variant={selectedTip === tip ? "default" : "outline"}
        onClick={() => onTipSelect(tip)}
      >
        ${tip}
      </Button>
    ))}
  </div>
);
