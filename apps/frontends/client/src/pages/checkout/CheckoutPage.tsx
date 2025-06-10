// src/pages/CheckoutPage.tsx
import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import { ContactSelector } from "@/pages/checkout/ContactSelector";
import { DeliveryAddressSelector } from "@/pages/checkout/DeliveryAddressSelector";
import { DeliveryInstructions } from "@/pages/checkout/DeliveryInstructions";
import { DeliverySchedule } from "@/pages/checkout/DeliverySchedule";
import { DeliveryTip } from "@/pages/checkout/DeliveryTip";
import { OrderSummary } from "@/pages/checkout/OrderSummary";
import { PaymentOptions } from "@/pages/checkout/PaymentOptions";
import { SectionCard } from "@/pages/checkout/SectionCard";
import { Coordinates } from "@/types/Coordinates";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const formRef = useRef<HTMLFormElement | null>(null);

  // form state
  const [loading, setLoading] = useState(false);
  const [addressInfo, setAddressInfo] = useState<{
    id: string;
    coords: Coordinates | null;
  }>({ id: "current", coords: null });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [selectedContactId, setSelectedContactId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"khqr" | "card" | "cod">(
    "khqr"
  );
  const [instructions, setInstructions] = useState<string>("");
  const [leaveAtDoor, setLeaveAtDoor] = useState<boolean>(false);
  const [selectedTip, setSelectedTip] = useState(5);

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
    setLoading(true);
    try {
      // **1. Build the payload just like in your test page**
      const cartItems = cart.map((item) => ({
        productId: item.id, // ← adjust if your cart item uses a different ID field
        quantity: item.quantity,
        price: item.price
      }));
      const customer = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: contactNumber
      };
      const shipping = shippingFee;

      // **2. Hit your `/orders` endpoint**
      const resp = await axiosInstance.post("/orders", {
        items: cartItems,
        customer,
        shipping
      });
      const { order, paymentConfig } = resp.data as {
        order: any;
        paymentConfig: { endpoint: string; payload: Record<string, string> };
      };

      // **3. Dynamically build & submit the hidden form to the gateway**
      const { endpoint, payload } = paymentConfig;
      if (!formRef.current) throw new Error("Form ref is not mounted");
      const f = formRef.current;
      // clear old inputs
      while (f.firstChild) f.removeChild(f.firstChild);
      // add new ones
      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        f.appendChild(input);
      });
      // hosted_view flag
      const viewTypeInput = document.createElement("input");
      viewTypeInput.type = "hidden";
      viewTypeInput.name = "view_type";
      viewTypeInput.value = "hosted_view";
      f.appendChild(viewTypeInput);

      f.method = "POST";
      f.action = endpoint;
      f.submit();

      // note: your backend callback + return URLs will handle marking PAID, clearing cart, etc.
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        description: err.response?.data?.error || "Failed to place order.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <SectionCard title="1. Delivery Address">
          <DeliveryAddressSelector onAddressChange={setAddressInfo} />
        </SectionCard>

        <SectionCard title="2. Delivery Schedule">
          <DeliverySchedule
            deliveryTimeSlot={deliveryTimeSlot}
            onTimeSlotChange={setDeliveryTimeSlot}
            slotCount={5}
            slotStepMins={30}
          />
        </SectionCard>

        <SectionCard title="3. Contact Number">
          <ContactSelector
            selectedContactId={selectedContactId}
            contactNumber={contactNumber}
            onSelectContact={setSelectedContactId}
            onEnterNumber={setContactNumber}
          />
        </SectionCard>

        <SectionCard title="4. Payment Option">
          <PaymentOptions
            paymentMethod={paymentMethod}
            onChange={setPaymentMethod}
          />
        </SectionCard>

        <SectionCard title="5. Delivery Instructions (optional)">
          <DeliveryInstructions
            instructions={instructions}
            onChange={setInstructions}
            leaveAtDoor={leaveAtDoor}
            onToggleLeaveAtDoor={setLeaveAtDoor}
          />
        </SectionCard>

        <SectionCard title="6. Delivery Tip">
          <DeliveryTip selectedTip={selectedTip} onTipSelect={setSelectedTip} />
        </SectionCard>
      </div>

      <div className="sticky top-20">
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

      <form ref={formRef} style={{ display: "none" }} />
    </main>
  );
};

export default Checkout;
