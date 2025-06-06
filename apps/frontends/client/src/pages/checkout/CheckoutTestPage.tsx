import PushNotification from "@/components/commons/PushNotification";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import React, { useRef, useState } from "react";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

const CheckoutPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      const cartItems: CartItem[] = [
        { productId: "ABC123", quantity: 1, price: 14700 }
        // ...any other items...
      ];
      const customer = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "012345678"
      };
      const shipping = 0;

      const resp = await axiosInstance.post("/orders", {
        items: cartItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price
        })),
        customer,
        shipping
      });

      const { order, paymentConfig } = resp.data as {
        order: any;
        paymentConfig: { endpoint: string; payload: Record<string, string> };
      };

      console.log("order: ", order);
      console.log("paymentConfig: ", paymentConfig);

      const { endpoint, payload } = paymentConfig;

      if (!formRef.current) {
        throw new Error("Form ref is not mounted");
      }
      const f = formRef.current;

      while (f.firstChild) {
        f.removeChild(f.firstChild);
      }

      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        f.appendChild(input);
      });

      const viewTypeInput = document.createElement("input");
      viewTypeInput.type = "hidden";
      viewTypeInput.name = "view_type";
      viewTypeInput.value = "hosted_view";
      f.appendChild(viewTypeInput);

      f.method = "POST";
      f.action = endpoint;
      f.submit();

      //  Once PayWay’s modal is open, the user enters payment details. When they finish:
      //    1) PayWay’s server sends a callback to your BACKEND_CALLBACK_URL → you mark order “PAID” in your DB.
      //    2) PayWay’s JS automatically closes the modal AND redirects the parent window to your
      //       FRONTEND_RETURN_SUCCESS_URL (e.g. https://your-frontend.com/payment-success?tran_id=...)
      //       or FRONTEND_RETURN_CANCEL_URL (if they cancelled) with `?tran_id=<yourTranId>`.
      //    At that point, the browser will navigate to /payment-success or /payment-cancel in your React app.
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err.response?.data?.error || "Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <PushNotification />
      <Button onClick={handlePlaceOrder} disabled={isLoading}>
        {isLoading ? "Processing..." : "Place Order"}
      </Button>

      <form ref={formRef} style={{ display: "none" }} />
    </div>
  );
};

export default CheckoutPage;
