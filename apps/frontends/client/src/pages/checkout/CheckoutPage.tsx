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
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const CheckoutSchema = z.object({
  deliveryAddressId: z.string().nonempty(),
  deliveryTimeSlot: z.string().nonempty(),
  contactNumber: z.string().min(7),
  paymentMethod: z.enum(["khqr", "card", "cod"]),
  tip: z.number().min(0)
});

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  const [addrId, setAddrId] = useState("");
  const [slot, setSlot] = useState("");
  const [contact, setContact] = useState("");
  const [method, setMethod] = useState<"khqr" | "card" | "cod">("khqr");
  const [instructions, setInstructions] = useState("");
  const [tip, setTip] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    if (!cart.length) {
      toast({ description: "Your cart is empty.", variant: "destructive" });
      navigate("/");
    }
  }, [cart]);

  const handlePlaceOrder = async () => {
    const parse = CheckoutSchema.safeParse({
      deliveryAddressId: addrId,
      deliveryTimeSlot: slot,
      contactNumber: contact,
      paymentMethod: method,
      tip
    });
    if (!parse.success) {
      const err = Object.values(parse.error.flatten().fieldErrors)[0]![0];
      return toast({ description: err, variant: "destructive" });
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/orders", {
        items: cart.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        customer: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: contact
        },
        shipping: 0,
        tip,
        paymentMethod: method,
        deliveryAddressId: addrId,
        deliveryTimeSlot: slot,
        instructions
      });

      const { order, paymentConfig } = data;

      if (method === "cod") {
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
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <SectionCard title="Delivery Address">
        <DeliveryAddressSelector
          onAddressChange={(info) => setAddrId(info.id)}
        />
      </SectionCard>

      <SectionCard title="Delivery Schedule">
        <DeliverySchedule
          deliveryTimeSlot={slot}
          onTimeSlotChange={setSlot}
          slotCount={5}
          slotStepMins={30}
        />
      </SectionCard>

      <SectionCard title="Contact Number">
        <ContactSelector
          contactNumber={contact}
          onEnterNumber={setContact}
          selectedContactId={""}
          onSelectContact={() => {}}
        />
      </SectionCard>

      <SectionCard title="Payment Option">
        <PaymentOptions paymentMethod={method} onChange={setMethod} />
      </SectionCard>

      <SectionCard title="Instructions (optional)">
        <DeliveryInstructions
          instructions={instructions}
          onChange={setInstructions}
          leaveAtDoor={false}
          onToggleLeaveAtDoor={() => {}}
        />
      </SectionCard>

      <SectionCard title="Delivery Tip">
        <DeliveryTip selectedTip={tip} onTipSelect={setTip} />
      </SectionCard>

      <OrderSummary
        cart={cart}
        subtotal={subtotal}
        shippingFee={0}
        tipAmount={tip}
        total={subtotal + tip}
        onPlaceOrder={handlePlaceOrder}
        loading={loading}
      />

      <form ref={formRef} style={{ display: "none" }} />
    </main>
  );
};

export default CheckoutPage;
