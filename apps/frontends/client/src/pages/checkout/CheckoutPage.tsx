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

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const formRef = useRef<HTMLFormElement | null>(null);

  // form state
  const [loading, setLoading] = useState(false);
  const [addressInfo, setAddressInfo] = useState<{
    id: string;
    coords: Coordinates | null;
    address?: string;
  }>({ id: "current", coords: null });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");
  const [selectedContactId, setSelectedContactId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "abapay_khqr" | "cards" | "cod"
  >("abapay_khqr");
  const [instructions, setInstructions] = useState<string>("");
  const [leaveAtDoor, setLeaveAtDoor] = useState<boolean>(false);
  const [selectedTip, setSelectedTip] = useState(5);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee + selectedTip;

  useEffect(() => {
    if (!cart.length) {
      toast({ description: "Your cart is empty.", variant: "destructive" });
      navigate("/");
    }
  }, [cart]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/orders", {
        items: cart.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        customer: {
          phone: contactNumber
        },
        shipping: shippingFee,
        tip: selectedTip,
        paymentMethod,
        deliveryAddress: {
          type: "Point" as const,
          coordinates: [addressInfo.coords?.lng, addressInfo.coords?.lat] as [
            number,
            number
          ],
          address: addressInfo.address
        },
        deliveryTimeSlot,
        instructions,
        leaveAtDoor
      });

      const { order, paymentConfig } = data;

      if (paymentMethod === "cod") {
        clearCart();
        navigate(`/order-success/${order.tranId}`);
        return;
      }

      const f = formRef.current!;
      f.innerHTML = "";
      Object.entries(paymentConfig.payload).forEach(([k, v]) => {
        const inp = document.createElement("input");
        inp.type = "hidden";
        inp.name = k;
        inp.value = String(v);
        f.appendChild(inp);
      });
      const vt = document.createElement("input");
      vt.type = "hidden";
      vt.name = "view_type";
      vt.value = "hosted_view";
      f.appendChild(vt);

      f.method = "POST";
      f.action = paymentConfig.endpoint;
      f.submit();
    } catch (err: any) {
      toast({
        description: err.response?.data?.error || "Checkout failed",
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

export default CheckoutPage;
