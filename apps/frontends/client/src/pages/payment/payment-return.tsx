import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentReturn: React.FC = () => {
  const [params] = useSearchParams();
  const tranId = params.get("tranId");
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    if (!tranId) {
      toast({ description: "Missing transaction ID", variant: "destructive" });
      navigate("/");
      return;
    }

    const verify = async () => {
      try {
        clearCart();
        navigate(`/order-track/${tranId}`);
      } catch {
        toast({
          description: "Payment verification failed",
          variant: "destructive"
        });
        navigate("/");
      }
    };

    verify();
  }, [tranId]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-xl font-semibold">Verifying payment...</h1>
    </div>
  );
};

export default PaymentReturn;
