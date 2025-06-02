export type PlaceOrderDto = {
  items: { productId: string; qty: number; price: number }[];
  address: string;
  addressNotes?: string;
  label?: "Home" | "Work" | "Partner" | "Other";
  contactless: boolean;
  deliveryOption: "standard" | "priority";
  paymentMethod: "cod" | "card" | "aba";
  tip: number;
};
export type Order = {
  _id: string;
  status: string;
  items: Array<{ productId: string; qty: number; price: number }>;
  createdAt: string;
  // …etc
};
