import { useOrderTrackingQuery, useOrderTrackingSocket } from "@/api/order";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/order.types";
import { Product } from "@/types/product.types";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";

const bikeIcon = new L.Icon({
  iconUrl: "/bike.png", // Place in public/icons/
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const PinIcon = new L.Icon({
  iconUrl: "/address.png", // Place in public/icons/
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const statusSteps = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered"
] as const;

// Product query hook
const useProductQuery = (productId: string) => {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data.data;
    },
    enabled: !!productId
  });
};

export default function OrderTrackingPage() {
  const { tranId } = useParams<{ tranId: string }>();
  const { data: order, isLoading } = useOrderTrackingQuery(tranId);
  const [riderPos, setRiderPos] = useState<[number, number] | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Simulate rider movement
  useEffect(() => {
    if (!order || riderPos || order.deliveryStatus !== "out_for_delivery") {
      console.log("Simulation skipped", {
        hasOrder: !!order,
        hasRiderPos: !!riderPos,
        deliveryStatus: order?.deliveryStatus
      });
      return;
    }

    console.log("Starting rider simulation...", {
      deliveryStatus: order.deliveryStatus
    });

    const startPos: [number, number] = [11.565, 104.875]; // Near Phnom Penh
    const endPos: [number, number] = [
      order.deliveryAddress.coordinates[1], // lat
      order.deliveryAddress.coordinates[0] // lng
    ];
    let step = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
      step += 1;
      if (step > totalSteps) {
        clearInterval(interval);
        setRiderPos(endPos);
        console.log("Simulation complete, rider at:", endPos);
        return;
      }
      const lat = startPos[0] + (endPos[0] - startPos[0]) * (step / totalSteps);
      const lng = startPos[1] + (endPos[1] - startPos[1]) * (step / totalSteps);
      setRiderPos([lat, lng]);
      console.log("Rider position updated:", [lat, lng]);
    }, 200); // Update every 200ms

    return () => {
      console.log("Cleaning up simulation interval");
      clearInterval(interval);
    };
  }, [order, riderPos]);

  useOrderTrackingSocket(
    tranId!,
    (updatedOrder: Order) => {
      queryClient.setQueryData(["orders", tranId], updatedOrder);
      if (
        updatedOrder.deliveryStatus === "delivered" ||
        updatedOrder.deliveryStatus === "cancelled"
      ) {
        setRiderPos(null); // Clear riderPos for delivered or cancelled
        if (updatedOrder.deliveryStatus === "delivered") {
          toast({
            description: "Your order has been delivered!",
            duration: 5000
          });
        }
      }
    },
    (coords) => {
      const newPos: [number, number] = [coords[1], coords[0]]; // Swap lng, lat to lat, lng
      setRiderPos(newPos);
      console.log("Socket updated rider position:", newPos);
    }
  );

  if (isLoading || !order) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(
    order.deliveryStatus as (typeof statusSteps)[number]
  );
  const isCancelled = order.deliveryStatus === "cancelled";
  const isOutForDelivery = order.deliveryStatus === "out_for_delivery";

  // Calculate subtotal
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tracking Order #{order.tranId}</h2>
        <Badge
          variant={isCancelled ? "destructive" : "default"}
          className="text-sm"
        >
          {isCancelled
            ? "Order Cancelled"
            : order.deliveryStatus.replace(/_/g, " ").toUpperCase()}
        </Badge>
      </div>

      {!isCancelled && (
        <p className="text-muted-foreground text-sm">
          Estimated Arrival:{" "}
          {new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString()}
        </p>
      )}

      {/* Delivery Progress and Rider Location Side by Side */}
      {!isCancelled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Delivery Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative flex flex-col space-y-4">
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  return (
                    <div key={step} className="flex items-center gap-3">
                      {isActive ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      <span
                        className={`font-medium capitalize ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.replace(/_/g, " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Rider Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                {isOutForDelivery ? "Rider Location" : "Delivery Address"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] rounded overflow-hidden">
                <MapContainer
                  center={[
                    order.deliveryAddress.coordinates[1],
                    order.deliveryAddress.coordinates[0]
                  ]}
                  zoom={14}
                  className="h-full w-full z-10"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {/* Customer Marker (always shown) */}
                  <Marker
                    position={[
                      order.deliveryAddress.coordinates[1],
                      order.deliveryAddress.coordinates[0]
                    ]}
                    icon={PinIcon}
                  />
                  {/* Rider Marker and Polyline (only for out_for_delivery) */}
                  {isOutForDelivery && riderPos && (
                    <>
                      <Marker position={riderPos} icon={bikeIcon} />
                      <Polyline
                        positions={[
                          riderPos,
                          [
                            order.deliveryAddress.coordinates[1],
                            order.deliveryAddress.coordinates[0]
                          ]
                        ]}
                        color="blue"
                      />
                    </>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Customer</h4>
            <p className="text-sm text-muted-foreground">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer.phone}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Delivery Address</h4>
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress.address}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <ProductName productId={item.productId} />
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      ${(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="text-sm font-medium">Summary</h4>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tip</span>
              <span>${order.tip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>${order.amount.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">Payment & Delivery</h4>
            <p className="text-sm text-muted-foreground">
              Payment Method: {order.paymentMethod.toUpperCase()}
            </p>
            <p className="text-sm text-muted-foreground">
              Payment Status:{" "}
              {order.paymentStatus.replace(/_/g, " ").toUpperCase()}
            </p>
            <p className="text-sm text-muted-foreground">
              Delivery Time: {order.deliveryTimeSlot}
            </p>
            <p className="text-sm text-muted-foreground">
              Leave at Door: {order.leaveAtDoor ? "Yes" : "No"}
            </p>
            {order.instructions && (
              <p className="text-sm text-muted-foreground">
                Instructions: {order.instructions}
              </p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium">Timestamps</h4>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Updated: {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component to fetch product name
const ProductName: React.FC<{ productId: string }> = ({ productId }) => {
  const { data: product, isLoading } = useProductQuery(productId);
  if (isLoading) return <span>Loading...</span>;
  return <span>{product?.name || "Unknown Product"}</span>;
};
