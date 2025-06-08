// src/pages/CheckoutPage.tsx
import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import { Coordinates } from "@/types/Coordinates";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ContactSelector } from "@/pages/checkout/ContactSelector";
import { DeliveryAddressSelector } from "@/pages/checkout/DeliveryAddressSelector";
import { DeliveryInstructions } from "@/pages/checkout/DeliveryInstructions";
import { DeliverySchedule } from "@/pages/checkout/DeliverySchedule";
import { DeliveryTip } from "@/pages/checkout/DeliveryTip";
import { OrderSummary } from "@/pages/checkout/OrderSummary";
import { PaymentOptions } from "@/pages/checkout/PaymentOptions";

interface PaymentConfig {
  endpoint: string;
  payload: Record<string, any>;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<PaymentConfig | null>(null);

  const [addressInfo, setAddressInfo] = useState<{
    id: string;
    coords: Coordinates | null;
  }>({
    id: "current",
    coords: null
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>("");
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"khqr" | "card" | "cod">(
    "khqr"
  );
  const [instructions, setInstructions] = useState<string>("");
  const [selectedTip, setSelectedTip] = useState<number>(5);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee + selectedTip;

  useEffect(() => {
    if (!cart.length) {
      toast({ description: "Your cart is empty. Redirecting…" });
      navigate("/", { replace: true });
    }
  }, [cart, navigate]);

  const handlePlaceOrder = async () => {
    if (!addressInfo.coords || !deliveryTimeSlot || !contactNumber) {
      return toast({
        description: "Please fill all required fields.",
        variant: "destructive"
      });
    }

    const payload = {
      orderId: `local-${Date.now()}`,
      amount: total.toString(),
      items: cart.map((i) => ({
        name: i.name,
        qty: i.quantity,
        price: i.price.toString()
      })),
      delivery: {
        addressId: addressInfo.id,
        coords: addressInfo.coords,
        timeSlot: deliveryTimeSlot,
        contactNumber,
        instructions,
        tip: selectedTip.toString()
      },
      payment: { method: paymentMethod }
    };

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/payments/purchase", payload);
      setConfig(data);
      clearCart();
      navigate("/order-success");
    } catch {
      toast({ description: "Failed to place order.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section className="border rounded-md p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">1. Delivery Address</h2>
          <DeliveryAddressSelector onAddressChange={setAddressInfo} />
        </section>

        <section className="border rounded-md p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">2. Delivery Schedule</h2>
          <DeliverySchedule
            deliveryTimeSlot={deliveryTimeSlot}
            onTimeSlotChange={setDeliveryTimeSlot}
            slotCount={5}
            slotStepMins={30}
          />
        </section>

        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">3. Contact Number</h2>
          </div>
          <ContactSelector
            selectedContactId={selectedContactId}
            contactNumber={contactNumber}
            onSelectContact={setSelectedContactId}
            onEnterNumber={setContactNumber}
          />
        </section>

        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold"> 4. Payment Option</h2>
          </div>
          <PaymentOptions
            paymentMethod={paymentMethod}
            onChange={setPaymentMethod}
          />
        </section>

        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">
              5. Delivery Instructions (optional)
            </h2>
          </div>
          <DeliveryInstructions
            instructions={instructions}
            onChange={setInstructions}
          />
        </section>

        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold"> 6. Delivery Tip</h2>
          </div>
          <DeliveryTip selectedTip={selectedTip} onTipSelect={setSelectedTip} />
        </section>
      </div>

      <OrderSummary
        cart={cart}
        subtotal={subtotal}
        shippingFee={shippingFee}
        tipAmount={selectedTip}
        total={total}
        onPlaceOrder={handlePlaceOrder}
        loading={loading}
      />
    </div>
  );
};

export default Checkout;
