// src/components/PaymentOptions.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, QrCode, Tag } from "lucide-react";
import React from "react";

export type PaymentMethod = "abapay_khqr" | "cards" | "cod";

interface PaymentOptionsProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const OPTIONS: {
  value: PaymentMethod;
  id: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  { value: "abapay_khqr", id: "pay_khqr", label: "KHQR", Icon: QrCode },
  {
    value: "cards",
    id: "pay_card",
    label: "Credit / Debit Card",
    Icon: CreditCard
  },
  { value: "cod", id: "pay_cod", label: "Cash on Delivery", Icon: Tag }
];

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentMethod,
  onChange
}) => {
  return (
    <RadioGroup
      value={paymentMethod}
      onValueChange={(val) => onChange(val as PaymentMethod)}
      className="space-y-3"
    >
      {OPTIONS.map(({ value, id, label, Icon }) => {
        const isSelected = paymentMethod === value;
        return (
          <div
            key={value}
            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              isSelected
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
            onClick={() => onChange(value)}
          >
            <RadioGroupItem value={value} id={id} />
            <div className="flex items-center space-x-2">
              <Icon
                className={`w-5 h-5 ${
                  isSelected ? "text-green-600" : "text-gray-600"
                }`}
              />
              <Label
                htmlFor={id}
                className={`font-medium ${
                  isSelected ? "text-green-800" : "text-gray-800"
                }`}
              >
                {label}
              </Label>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};
