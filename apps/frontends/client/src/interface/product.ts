export interface Product {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  unit: string;
  isOnSale: boolean;
  createdAt: string; // Added createdAt
}

