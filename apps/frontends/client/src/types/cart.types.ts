export interface CartItemDto {
  productId: string;
  qty: number;
}

export interface RawCartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  qty: number;
}

export interface RawCart {
  items: RawCartItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
