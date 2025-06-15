import { useOrderTrackingQuery, useOrderTrackingSocket } from "@/api/order";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Order } from "@/types/order.types";
import { useQueryClient } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";

const statusSteps = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered"
] as const;

export default function OrderTrackingPage() {
  const { tranId } = useParams<{ tranId: string }>();
  const { data: order, isLoading } = useOrderTrackingQuery(tranId);
  const [riderPos, setRiderPos] = useState<[number, number] | null>(null);
  const queryClient = useQueryClient();

  useOrderTrackingSocket(
    tranId!,
    (updatedOrder: Order) => {
      queryClient.setQueryData(["orders", tranId], updatedOrder);
    },
    (coords) => setRiderPos(coords)
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

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tracking Order #{order.tranId}</h2>
        {isCancelled && (
          <Badge variant="destructive" className="text-sm">
            Order Cancelled
          </Badge>
        )}
      </div>

      {!isCancelled && (
        <p className="text-muted-foreground text-sm">
          Estimated Arrival:{" "}
          {new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString()}
        </p>
      )}

      {/* ✅ Stepper */}
      {!isCancelled && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-4">Delivery Progress</h3>
          <div className="relative flex flex-col space-y-4">
            {statusSteps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div key={step} className="flex items-center gap-3 relative">
                  <div className="flex items-center justify-center">
                    {isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="text-sm">
                    <span
                      className={`font-medium capitalize ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ✅ Map */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-2">Rider Location</h3>
        <div className="h-[300px] rounded overflow-hidden">
          <MapContainer
            center={[
              order.deliveryAddress.coordinates[1],
              order.deliveryAddress.coordinates[0]
            ]}
            zoom={16}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[
                order.deliveryAddress.coordinates[1],
                order.deliveryAddress.coordinates[0]
              ]}
            />
          </MapContainer>
        </div>
      </Card>
    </div>
  );
}
