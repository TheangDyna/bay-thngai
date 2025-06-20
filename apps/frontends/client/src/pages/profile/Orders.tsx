import { useGetOrdersQuery } from "@/api/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth.context";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

interface Order {
  _id: string;
  tranId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  amount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: number;
  tip: number;
  paymentMethod: string;
  deliveryAddress: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  deliveryTimeSlot: string;
  instructions: string;
  leaveAtDoor: boolean;
}

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "createdAt", label: "Oldest" },
  { value: "-amount", label: "Highest Amount" },
  { value: "amount", label: "Lowest Amount" }
];

export const Orders: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [sortBy, setSortBy] = useState("-createdAt");
  const { ref, inView } = useInView({ threshold: 0 });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error
  } = useGetOrdersQuery(
    { email: user?.email || "", sort: sortBy },
    { skip: !user?.email }
  );

  const allOrders = data?.pages.flatMap((pg) => pg.data) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Your Orders</CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {authLoading || (isFetching && !data) ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">
              Failed to load orders. Please try again later.
            </p>
          ) : !user ? (
            <p className="text-center text-gray-500 py-8">
              Please log in to view your orders.
            </p>
          ) : allOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No orders found.</p>
              <Button asChild>
                <Link to="/search">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div>
              <div className="space-y-6">
                {allOrders.map((order: Order) => (
                  <div
                    key={order.tranId}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.tranId}</p>
                        <p className="text-sm text-gray-500">
                          Placed on{" "}
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <p className="font-medium">${order.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-sm font-medium">Payment Status</p>
                          <p
                            className={`text-sm capitalize ${
                              order.paymentStatus === "approved"
                                ? "text-green-600"
                                : order.paymentStatus === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {order.paymentStatus}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Delivery Status</p>
                          <p
                            className={`text-sm capitalize ${
                              order.deliveryStatus === "delivered"
                                ? "text-green-600"
                                : order.deliveryStatus === "cancelled"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {order.deliveryStatus.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <Link to={`/order/${order.tranId}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={ref} className="h-6" />
              {isFetchingNextPage && (
                <div className="text-center text-sm text-muted-foreground">
                  <Loader2 className="animate-spin inline-block" />
                </div>
              )}
              {!hasNextPage && !isFetching && allOrders.length > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  — End of results —
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
