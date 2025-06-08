// src/components/DeliverySchedule.tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useEffect, useMemo } from "react";

interface DeliveryScheduleProps {
  deliveryTimeSlot: string;
  onTimeSlotChange: (slot: string) => void;
  /** how many future slots to show after “Now” */
  slotCount?: number;
  /** minutes between slots */
  slotStepMins?: number;
}

export const DeliverySchedule: React.FC<DeliveryScheduleProps> = ({
  deliveryTimeSlot,
  onTimeSlotChange,
  slotCount = 4,
  slotStepMins = 30
}) => {
  // compute rounded-up next slots
  const slots = useMemo(() => {
    const now = new Date();
    const mins = now.getMinutes();
    const remainder = mins % slotStepMins;
    const delta = remainder === 0 ? 0 : slotStepMins - remainder;
    const first = new Date(now.getTime() + delta * 60000);
    const arr: Date[] = [first];
    for (let i = 1; i < slotCount; i++) {
      arr.push(new Date(arr[i - 1].getTime() + slotStepMins * 60000));
    }
    return arr.map((d) =>
      d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    );
  }, [slotCount, slotStepMins]);

  // on mount, if nothing selected yet, default to Now
  useEffect(() => {
    if (!deliveryTimeSlot) {
      onTimeSlotChange("Now");
    }
  }, [deliveryTimeSlot, onTimeSlotChange]);

  const options = ["Now", ...slots];

  return (
    <ToggleGroup
      type="single"
      value={deliveryTimeSlot}
      onValueChange={(v) => onTimeSlotChange(v)}
      className="grid grid-cols-3 sm:grid-cols-5 gap-2"
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt}
          value={opt}
          className={`px-3 py-2 text-sm rounded-md border ${
            deliveryTimeSlot === opt
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
          }`}
        >
          {opt}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
