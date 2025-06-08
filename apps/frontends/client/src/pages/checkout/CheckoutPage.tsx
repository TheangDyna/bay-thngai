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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

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
      const { data } = await axiosInstance.post("/payments/purchase", payload);
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
