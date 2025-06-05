import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const PaymentCancel: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tranId = params.get("tran_id");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold text-center">
            Payment Canceled
          </h1>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {tranId ? (
            <p>
              Your transaction <strong>{tranId}</strong> was canceled or failed.
              <br />
              You can return to your cart or try again.
            </p>
          ) : (
            <p>No transaction ID was provided by PayWay.</p>
          )}
          <div className="flex justify-center space-x-4">
            <Link to="/checkout-test">
              <Button variant="destructive">Return to Cart</Button>
            </Link>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
