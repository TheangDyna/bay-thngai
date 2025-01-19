import React, { useState } from "react";
import { ShoppingCart, TrashIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardProductCart from "@/components/base/home/card/CardProductCart";
import EmptyCartSection from "@/components/base/home/section/EmptyCartSection";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {/* Cart Icon */}
      <div
        onClick={toggleSidebar}
        className="relative flex items-center space-x-2 cursor-pointer text-gray-800 hover:text-black"
      >
        <ShoppingCart className="w-6 h-6" />
        <span>Cart</span>
        <span className="absolute -top-1 right-8 -mt-1 -mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold">
          {/* Calculate total quantity */}
          {Object.values(cart).reduce((acc, item) => acc + item.quantity, 0)}
        </span>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
          onClick={closeSidebar}
        >
          <div
            className="w-[378px] h-full bg-white shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
          >
            {/* Header */}
            <div className="relative flex items-center justify-between w-full border-b p-5">
              <h3 className="text-gray-900 font-semibold text-xl">
                Shopping Cart
              </h3>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="flex items-center text-md cursor-pointer hover:bg-transparent hover:text-primary rounded-full px-3 py-2"
                  onClick={() => setCart({})}
                >
                  <TrashIcon className="w-8 h-8" />
                  Clear All
                </Button>

                <Button
                  aria-label="close"
                  onClick={closeSidebar}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 hover:text-primary rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Content */}

            <div className="flex-grow overflow-y-auto">
              <CardProductCart
                title="Fresh Green Leaf Lettuce"
                imageUrl="/grocery/lettuce.png"
                quantity={1}
                price={2.99}
              />
            </div>

            {/* <div>
              <EmptyCartSection />
            </div> */}

            {/* Footer */}
            <div className="p-5 border-t">
              <div className="flex pb-5">
                <div className="pr-3">
                  <h3 className="text-gray-900 text-sm font-semibold mb-2">
                    Subtotal:
                  </h3>
                  <p className="text-gray-600 text-sm leading-6">
                    Final price and discounts will be determined at the time of
                    payment processing.
                  </p>
                </div>
                <div className="shrink-0 font-semibold text-base text-gray-900 min-w-[80px] text-right">
                  $0.00
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  className="w-full px-5 py-3 bg-gray-200 text-gray-400 font-semibold text-sm rounded cursor-not-allowed"
                  disabled
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
