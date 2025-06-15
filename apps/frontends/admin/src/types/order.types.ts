export interface Item {
  productId: string;
  quantity: number;
  price: number;
}

export interface Customer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
}

export type PaymentMethod = "abapay_khqr" | "cards" | "cod";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "declined"
  | "refunded"
  | "cancelled";

export type DeliveryStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  tranId: string;
  items: Item[];
  customer: Customer;
  shipping: number;
  tip: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  amount: number;
  deliveryAddress: {
    type: "Point";
    coordinates: [number, number];
    address?: string | undefined;
  };
  deliveryTimeSlot: string;
  instructions: string;
  leaveAtDoor: boolean;
  createdAt: Date;
  updatedAt: Date;
}
