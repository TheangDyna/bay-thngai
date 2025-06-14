import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
  const { tranId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tranId) navigate("/");
  }, []);

  return (
    <div className="max-w-xl mx-auto text-center p-8">
      <h1 className="text-2xl font-bold">🎉 Order Placed Successfully!</h1>
      <p className="mt-2">
        Transaction ID: <strong>{tranId}</strong>
      </p>
      <a href={`/order-track/${tranId}`} className="btn mt-6">
        Track Delivery
      </a>
    </div>
  );
};

export default OrderSuccessPage;
