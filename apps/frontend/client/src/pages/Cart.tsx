import React, { useState } from "react";
import { ShoppingCart, TrashIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardProductCart from "@/components/base/home/card/CardProductCart";
import EmptyCartSection from "@/components/base/home/section/EmptyCartSection";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useAddToCartMutation
} from "@/api/cart.api";
import { toast } from "@/hooks/use-toast";
import { useCreateOrder } from "@/api/order.api";
import { usePurchasePayment } from "@/api/payment.api";
import axiosInstance from "@/utils/axiosInstance";
import { PaywayIframe } from "@/pages/PaywayIframe";

const Cart: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [config, setConfig] = useState<null | {
    endpoint: string;
    payload: Record<string, string>;
  }>(null);

  // 1) Fetch cart
  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError
  } = useGetCartQuery();
  const items = cart?.items ?? [];
  const cartId = cart?._id;

  // 2) Cart mutations
  const { mutate: removeFromCart, isPending: isRemoving } =
    useRemoveFromCartMutation();
  const { mutate: clearCart, isPending: isClearing } = useClearCartMutation();
  const { mutate: updateCart, isPending: isUpdating } = useAddToCartMutation();

  // 3) Order + Payment mutations
  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrder();
  const { mutateAsync: purchasePayment, isPending: isPaying } =
    usePurchasePayment();

  // UI toggles
  const toggleSidebar = () => setIsSidebarOpen((o) => !o);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Totals
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * i.product.price,
    0
  );

  // Handlers
  const handleRemove = (id: string) =>
    removeFromCart(id, {
      onSuccess: () => toast({ description: "Item removed" }),
      onError: () => toast({ description: "Failed", variant: "destructive" })
    });

  const handleClear = () =>
    clearCart(undefined, {
      onSuccess: () => toast({ description: "Cart cleared" }),
      onError: () => toast({ description: "Failed", variant: "destructive" })
    });

  const handleIncrement = (id: string) =>
    updateCart(
      { productId: id, quantity: 1 },
      {
        onError: () => toast({ description: "Failed", variant: "destructive" })
      }
    );

  const handleDecrement = (id: string, qty: number) => {
    if (qty <= 1) return;
    updateCart(
      { productId: id, quantity: -1 },
      {
        onError: () => toast({ description: "Failed", variant: "destructive" })
      }
    );
  };

  const MAX_TRAN_ID = 20;
  const rawTranId =
    cartId?.length > MAX_TRAN_ID ? cartId.substring(0, MAX_TRAN_ID) : cartId;

  // 4) Checkout → shadcn Dialog + iframe
  const handleCheckout = async () => {
    const payload = {
      orderId: rawTranId,
      amount: subtotal,
      items: items.map((i) => ({
        name: i.product.name,
        qty: i.quantity,
        price: i.product.price
      })),
      customer: {
        firstname: "Theang",
        lastname: "Dyna",
        email: "theangdyna365@gmail.com"
      }
    };
    const { data } = await axiosInstance.post("/payments/purchase", payload);
    setConfig(data);
  };

  return (
    <>
      <div>
        {/* Cart Icon */}
        <div
          onClick={toggleSidebar}
          className="relative flex items-center space-x-2 cursor-pointer"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>Cart</span>
          {totalQty > 0 && (
            <span className="absolute -top-1 right-8 flex h-4 w-4 items-center justify-center bg-emerald-500 text-white text-xs rounded-full">
              {totalQty}
            </span>
          )}
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
            onClick={closeSidebar}
          >
            <div
              className="w-[378px] h-full bg-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Shopping Cart</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={handleClear}
                    disabled={isClearing || items.length === 0}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" onClick={closeSidebar} size="icon">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-grow overflow-y-auto p-4">
                {isCartLoading ? (
                  <div>Loading…</div>
                ) : isCartError ? (
                  <div className="text-red-500">Failed to load cart.</div>
                ) : items.length === 0 ? (
                  <EmptyCartSection />
                ) : (
                  items.map((it) => (
                    <CardProductCart
                      key={it.product._id}
                      imageUrl={it.product.thumbnail}
                      title={it.product.name}
                      price={it.product.price}
                      quantity={it.quantity}
                      onRemove={() => handleRemove(it.product._id)}
                      onIncrement={() => handleIncrement(it.product._id)}
                      onDecrement={() =>
                        handleDecrement(it.product._id, it.quantity)
                      }
                      isRemoving={isRemoving}
                      isUpdatingQuantity={isUpdating}
                    />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isCreatingOrder || isPaying || items.length === 0}
                  className="w-full"
                >
                  {isCreatingOrder
                    ? "Creating Order…"
                    : isPaying
                      ? "Loading…"
                      : "Proceed to Checkout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {config && (
        <PaywayIframe
          endpoint={config.endpoint}
          payload={config.payload}
          onClose={() => setConfig(null)}
        />
      )}
    </>
  );
};

export default Cart;
