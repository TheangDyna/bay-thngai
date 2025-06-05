import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentCancel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If PayWay appended ?tran_id=ORDER_12345:
  const params = new URLSearchParams(location.search);
  const tranId = params.get("tran_id");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Payment Cancelled</h1>
      {tranId && (
        <p>
          Your transaction <strong>{tranId}</strong> was cancelled.
        </p>
      )}
      <p>
        You can return to your <a onClick={() => navigate("/cart")}>Cart</a>
        or try another payment method.
      </p>
    </div>
  );
};
