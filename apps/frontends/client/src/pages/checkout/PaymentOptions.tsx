// src/components/PaymentOptions.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, QrCode, Tag } from "lucide-react";
import React from "react";

export type PaymentMethod = "khqr" | "card" | "cod";

interface PaymentOptionsProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentMethod,
  onChange
}) => (
  <RadioGroup
    value={paymentMethod}
    onValueChange={(val) => onChange(val as PaymentMethod)}
    className="space-y-4"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="khqr" id="pay_khqr" />
      <Label htmlFor="pay_khqr" className="flex items-center space-x-1">
        <QrCode className="w-4 h-4 text-gray-600" />
        <span>KHQR</span>
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="card" id="pay_card" />
      <Label htmlFor="pay_card" className="flex items-center space-x-1">
        <CreditCard className="w-4 h-4 text-gray-600" />
        <span>Credit / Debit Card</span>
      </Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="cod" id="pay_cod" />
      <Label htmlFor="pay_cod" className="flex items-center space-x-1">
        <Tag className="w-4 h-4 text-gray-600" />
        <span>Cash on Delivery</span>
      </Label>
    </div>
  </RadioGroup>
);
