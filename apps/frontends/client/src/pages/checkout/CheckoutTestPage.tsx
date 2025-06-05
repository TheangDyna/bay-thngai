// src/pages/CheckoutTestPage.tsx

import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import React, { useState } from "react";

interface Item {
  name: string;
  quantity: number;
  price: number;
}

export const CheckoutTestPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // ──────────────────────────────────────
      // 1) Build mock order data (for testing)
      const amount = 15000; // e.g., 15,000 KHR
      const items: Item[] = [
        { name: "Sample Product", quantity: 1, price: 15000 }
      ];
      const customer = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "012345678"
      };

      // ──────────────────────────────────────
      // 2) Ask backend for PayWay endpoint + payload
      const resp = await axiosInstance.post("/payments/purchase", {
        amount,
        items,
        customer
      });

      const { endpoint, payload } = resp.data as {
        endpoint: string;
        payload: Record<string, string | number>;
      };

      // ──────────────────────────────────────
      // 3) Open (or reuse) a named window/tab called "PayWayWindow"
      //    This must happen synchronously inside the click handler to avoid popup blockers.
      const paywayWindow = window.open("", "PayWayWindow");
      if (!paywayWindow) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      // ──────────────────────────────────────
      // 4) Build a hidden <form> targeting that named window
      const form = document.createElement("form");
      form.method = "POST";
      form.action = endpoint;
      form.target = "PayWayWindow"; // ← ensures the form submission goes to (or reuses) our new tab
      form.style.display = "none";

      // 5) Add all signed payload fields as hidden inputs
      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // ──────────────────────────────────────
      // 6) Submit the form, which navigates PayWayWindow to PayWay’s hosted checkout
      form.submit();

      // Optionally clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(form);
      }, 1000);
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.error || "Failed to initialize payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <Button onClick={handleCheckout} disabled={isProcessing}>
        {isProcessing ? "Processing…" : "Check Out"}
      </Button>
    </div>
  );
};

export default CheckoutTestPage;
