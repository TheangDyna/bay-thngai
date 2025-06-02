import { AddressSelector } from "@/components/commons/AddressSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // assume shadcn/ui radio
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import { PaywayIframe } from "@/pages/PaywayIframe";
import axiosInstance from "@/utils/axiosInstance";
import { CreditCard, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentConfig {
  endpoint: string;
  payload: Record<string, string>;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(false);

  // --- STEP STATES ---
  // 1. Delivery Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // 2. Delivery Schedule
  const [deliveryDate, setDeliveryDate] = useState(""); // e.g. "2025-06-10"
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(""); // e.g. "10:00 AM – 12:00 PM"

  // 3. Contact Number
  const [contactNumber, setContactNumber] = useState("");

  // 4. Payment Option
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");

  // 5. Delivery Instructions (optional)
  const [instructions, setInstructions] = useState("");

  // 6. Delivery Tip
  const tipOptions = [5, 10, 15, 20, 25];
  const [selectedTip, setSelectedTip] = useState<number>(5);

  // Compute subtotal & total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const shippingFee = 0; // assume 0 for simplicity
  const tipAmount = selectedTip;
  const total = subtotal + shippingFee + tipAmount;

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      toast({ description: "Your cart is empty. Redirecting to shop…" });
      navigate("/", { replace: true });
    }
  }, [cart, navigate]);

  const handlePlaceOrder = async () => {
    // Simple validation for required fields
    if (
      !addressLine1 ||
      !city ||
      !postalCode ||
      !deliveryDate ||
      !deliveryTimeSlot ||
      !contactNumber
    ) {
      toast({
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Build payload for payment
    const cartId = "local-cart";
    const rawTranId = cartId.slice(0, 20);
    const items = cart.map((i) => ({
      name: i.name,
      qty: i.quantity,
      price: i.price
    }));

    const payload = {
      orderId: rawTranId,
      amount: total,
      items,
      customer: {
        firstname: "Theang", // replace with dynamic data if available
        lastname: "Dyna",
        email: "theangdyna365@gmail.com"
      },
      delivery: {
        addressLine1,
        addressLine2,
        city,
        postalCode,
        deliveryDate,
        deliveryTimeSlot,
        contactNumber,
        instructions,
        tip: tipAmount
      },
      payment: {
        method: paymentMethod
      }
    };

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/payments/purchase", payload);
      setConfig(data);
    } catch {
      toast({
        description: "Failed to initialize payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseIframe = () => {
    clearCart();
    setConfig(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Checkout Steps */}
      <div className="lg:col-span-2 space-y-8">
        {/* 1. Delivery Address */}
        <AddressSelector />
        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-600 font-semibold text-lg mr-2">
              1.
            </span>
            <h2 className="text-xl font-semibold">Delivery Address</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                placeholder="123 Main St"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                placeholder="Apt, suite, etc. (optional)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="12345"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* 2. Delivery Schedule */}
        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-600 font-semibold text-lg mr-2">
              2.
            </span>
            <h2 className="text-xl font-semibold">Delivery Schedule</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryDate">Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deliveryTimeSlot">Time Slot</Label>
              <select
                id="deliveryTimeSlot"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
              >
                <option value="">Select a time slot</option>
                <option value="08:00 AM - 10:00 AM">08:00 AM – 10:00 AM</option>
                <option value="10:00 AM - 12:00 PM">10:00 AM – 12:00 PM</option>
                <option value="12:00 PM - 02:00 PM">12:00 PM – 02:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM – 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM – 06:00 PM</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. Contact Number */}
        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-600 font-semibold text-lg mr-2">
              3.
            </span>
            <h2 className="text-xl font-semibold">Contact Number</h2>
          </div>
          <div>
            <Label htmlFor="contactNumber">Phone / Mobile</Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="+855 12 345 678"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
        </section>

        {/* 4. Payment Option */}
        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-600 font-semibold text-lg mr-2">
              4.
            </span>
            <h2 className="text-xl font-semibold">Payment Option</h2>
          </div>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(val: "card" | "cod") => setPaymentMethod(val)}
            className="space-y-2"
          >
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
        </section>

        {/* 5. Delivery Instructions (optional) */}
        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-600 font-semibold text-lg mr-2">
              5.
            </span>
            <h2 className="text-xl font-semibold">
              Delivery Instructions (optional)
            </h2>
          </div>
          <Textarea
            placeholder="Any specific instructions for the driver?"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full resize-none h-24"
          />
        </section>

        {/* 6. Delivery Tip */}
        <section className="border rounded-md p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <span className="text-green-600 font-semibold text-lg mr-2">
              6.
            </span>
            <h2 className="text-xl font-semibold">Delivery Tip</h2>
          </div>
          <div className="flex space-x-3">
            {tipOptions.map((tip) => (
              <button
                key={tip}
                onClick={() => setSelectedTip(tip)}
                className={`px-4 py-2 border rounded-md font-medium ${
                  selectedTip === tip
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                ${tip}
              </button>
            ))}
          </div>
        </section>

        {/* Place Order Button */}
        <div className="pt-4 flex justify-end">
          <Button
            onClick={handlePlaceOrder}
            disabled={loading || !!config}
            className="w-full max-w-xs"
          >
            {loading ? "Processing…" : "Order Now"}
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <aside className="space-y-6">
        <div className="border rounded-md p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center py-3">
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full rounded"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tip</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Payway Iframe Overlay */}
      {config && (
        <PaywayIframe
          endpoint={config.endpoint}
          payload={config.payload}
          onClose={handleCloseIframe}
        />
      )}
    </div>
  );
};

export default Checkout;
