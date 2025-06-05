// src/pages/PaymentSuccess.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<null | string>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tranId = params.get("tran_id") || "";
    // Optionally, we can query our backend to confirm the final status:
    axios
      .get(`/api/orders/status?tran_id=${tranId}`)
      .then((res) => setOrderStatus(res.data.status))
      .catch(() => setOrderStatus("Unknown"));
  }, [location.search]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Payment Successful!</h1>
      {orderStatus ? (
        <p>
          Your order (ID: <strong>{orderStatus}</strong>) has been confirmed.
        </p>
      ) : (
        <p>Loading order details…</p>
      )}
      <p>
        Go back to <a onClick={() => navigate("/")}>Home</a> or view your{" "}
        <a onClick={() => navigate("/orders")}>Order History</a>.
      </p>
    </div>
  );
};
