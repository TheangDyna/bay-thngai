// src/components/DeliverySchedule.tsx
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo } from "react";

interface DeliveryScheduleProps {
  deliveryTimeSlot: string;
  onTimeSlotChange: (slot: string) => void;
  slotCount?: number;
  slotStepMins?: number;
}

export const DeliverySchedule: React.FC<DeliveryScheduleProps> = ({
  deliveryTimeSlot,
  onTimeSlotChange,
  slotCount = 4,
  slotStepMins = 30
}) => {
  const options = useMemo(() => {
    const now = new Date();
    const mins = now.getMinutes();
    const rem = mins % slotStepMins;
    const first = new Date(
      now.getTime() + (rem === 0 ? 0 : slotStepMins - rem) * 60000
    );
    const arr = [first];
    for (let i = 1; i < slotCount; i++) {
      arr.push(new Date(arr[i - 1].getTime() + slotStepMins * 60000));
    }
    return [
      "Now",
      ...arr.map((d) =>
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      )
    ];
  }, [slotCount, slotStepMins]);

  // default to "Now" on first render
  useEffect(() => {
    if (!deliveryTimeSlot) onTimeSlotChange("Now");
  }, [deliveryTimeSlot, onTimeSlotChange]);

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <Button
          key={opt}
          variant={deliveryTimeSlot === opt ? "default" : "outline"}
          onClick={() => onTimeSlotChange(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
};
