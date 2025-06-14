import axios from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderTrackingPage: React.FC = () => {
  const { tranId } = useParams<{ tranId: string }>();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (tranId)
      axios.get(`/orders/${tranId}`).then((res) => setOrder(res.data));
  }, [tranId]);

  if (!order) return <p className="text-center mt-20">Loading order...</p>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold">🛵 Order Tracking</h2>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Delivery Time:</strong> {order.deliveryTimeSlot}
      </p>
      <p>
        <strong>Phone:</strong> {order.customer?.phone}
      </p>
      <p>
        <strong>Address:</strong> {order.deliveryAddress?.address}
      </p>
    </div>
  );
};

export default OrderTrackingPage;
