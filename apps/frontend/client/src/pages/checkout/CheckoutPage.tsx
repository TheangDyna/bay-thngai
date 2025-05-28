// src/pages/CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart.store";
import { usePlaceOrderMutation } from "@/api/order.api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, loading: cartLoading, fetchCart, clearCart } = useCartStore();
  const placeOrder = usePlaceOrderMutation();

  // form state
  const [address, setAddress] = useState("");
  const [addressNotes, setAddressNotes] = useState("");
  const [label, setLabel] = useState<"Home" | "Work" | "Partner" | "Other">(
    "Home"
  );
  const [contactless, setContactless] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "priority">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "aba">(
    "cod"
  );
  const [tip, setTip] = useState(0);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleSubmit = async () => {
    try {
      const dto = {
        items: items.map((i) => ({
          productId: i.id,
          qty: i.quantity,
          price: i.price
        })),
        address,
        addressNotes,
        label,
        contactless,
        deliveryOption,
        paymentMethod,
        tip
      };
      const order = await placeOrder.mutateAsync(dto);
      toast.success("Order placed!");
      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    }
  };

  if (cartLoading) return <div>Loading cart…</div>;

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Delivery address */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="98 Street 3, Phnom Penh"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              placeholder="Floor, building, landmark…"
              value={addressNotes}
              onChange={(e) => setAddressNotes(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex items-center">
            <Switch
              checked={contactless}
              onCheckedChange={setContactless}
              id="contactless"
            />
            <Label htmlFor="contactless" className="ml-2">
              Contactless delivery
            </Label>
          </CardFooter>
        </Card>

        {/* Delivery options */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery options</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={deliveryOption}
              onValueChange={(v) => setDeliveryOption(v as any)}
              className="space-y-2"
            >
              <div className="flex justify-between">
                <RadioGroupItem value="standard" id="std" />
                <Label htmlFor="std">Standard (15–30 mins)</Label>
              </div>
              <div className="flex justify-between">
                <RadioGroupItem value="priority" id="pri" />
                <Label htmlFor="pri">Priority (10–25 mins) + $0.37</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as any)}
              className="space-y-2"
            >
              <div className="flex items-center">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="ml-2">
                  Cash on Delivery
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="ml-2">
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="aba" id="aba" />
                <Label htmlFor="aba" className="ml-2">
                  ABA Pay
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Tip */}
        <Card>
          <CardHeader>
            <CardTitle>Tip your rider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              {[0, 0.25, 0.5, 0.75, 1].map((amt) => (
                <Button
                  key={amt}
                  variant={tip === amt ? "default" : "outline"}
                  onClick={() => setTip(amt)}
                >
                  {amt === 0 ? "No tip" : `$${amt.toFixed(2)}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>
                  {i.quantity}× {i.name}
                </span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={placeOrder.isPending}
            >
              {placeOrder.isPending ? "Placing…" : "Place order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
