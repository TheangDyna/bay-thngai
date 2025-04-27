// Helper function to generate random prices
const generateRandomPrice = (min: number = 1, max: number = 15) => {
  const price = Math.random() * (max - min) + min;
  return {
    numeric: Number(price.toFixed(2)),       // For sorting
    formatted: `${price.toFixed(2)}`,      // For display
    range: () => {
      const higher = price + Math.random() * 3;
      return `$${price.toFixed(2)} - $${higher.toFixed(2)}`;
    }
  };
};

export const products = [
  {
    id: 1,
    image: "/grocery/lettuce.png",
    title: "Fresh Green Leaf Lettuce",
    price: generateRandomPrice(2, 4).formatted,
    originalPrice: generateRandomPrice(3, 5).formatted,
    unit: "1 each",
    isOnSale: true,
    createdAt: "2025-02-01T12:00:00Z",
  },
  {
    id: 2,
    image: "/grocery/fresh-carrots.png",
    title: "Fresh Carrots",
    price: generateRandomPrice(1.5, 3.5).range(),
    unit: "1 lb",
    isOnSale: false,
    createdAt: "2025-02-28T09:30:00Z",
  },
  {
    id: 3,
    image: "/grocery/orange.png",
    title: "Organic Valencia Oranges",
    price: generateRandomPrice(3, 6).range(),
    unit: "1 lb",
    isOnSale: true,
    createdAt: "2025-02-02T14:15:00Z",
  },
  {
    id: 4,
    image: "/grocery/apple.png",
    title: "Baby Carrots",
    price: generateRandomPrice(2.2, 3.8).formatted,
    originalPrice: generateRandomPrice(3, 4).formatted,
    unit: "1 pack",
    isOnSale: true,
    createdAt: "2025-02-30T16:45:00Z",
  },
  {
    id: 5,
    image: "/grocery/avocado.png",
    title: "Organic Romaine Lettuce",
    price: generateRandomPrice(3.25, 4.75).formatted,
    unit: "1 each",
    isOnSale: false,
    createdAt: "2025-02-03T08:00:00Z",
  },
  {
    id: 6,
    image: "/grocery/banana.png",
    title: "Rainbow Carrots",
    price: generateRandomPrice(2.9, 4.2).range(),
    unit: "1 lb",
    isOnSale: true,
    createdAt: "2025-02-29T11:20:00Z",
  },
  {
    id: 7,
    image: "/grocery/cabbage.png",
    title: "Butterhead Lettuce",
    price: generateRandomPrice(2.4, 3.1).formatted,
    originalPrice: generateRandomPrice(3, 3.5).formatted,
    unit: "1 each",
    isOnSale: true,
    createdAt: "2025-02-04T10:10:00Z",
  },
  {
    id: 8,
    image: "/grocery/fresh-carrots.png",
    title: "Heirloom Carrots",
    price: generateRandomPrice(4, 6).range(),
    unit: "1 lb",
    isOnSale: false,
    createdAt: "2025-02-27T13:50:00Z",
  },
  {
    id: 9,
    image: "/grocery/lettuce.png",
    title: "Iceberg Lettuce",
    price: generateRandomPrice(1.9, 2.5).formatted,
    unit: "1 each",
    isOnSale: false,
    createdAt: "2025-02-05T07:30:00Z",
  },
  {
    id: 10,
    image: "/grocery/fresh-carrots.png",
    title: "Organic Carrots",
    price: generateRandomPrice(3.75, 5.25).formatted,
    originalPrice: generateRandomPrice(4.5, 6).formatted,
    unit: "1 lb",
    isOnSale: true,
    createdAt: "2025-02-26T15:00:00Z",
  },
  {
    id: 11,
    image: "/grocery/lettuce.png",
    title: "Red Leaf Lettuce",
    price: generateRandomPrice(2.8, 3.4).formatted,
    unit: "1 each",
    isOnSale: true,
    createdAt: "2025-02-06T12:45:00Z",
  },
  {
    id: 12,
    image: "/grocery/fresh-carrots.png",
    title: "Purple Carrots",
    price: generateRandomPrice(4.2, 5.8).range(),
    unit: "1 lb",
    isOnSale: false,
    createdAt: "2025-02-25T18:20:00Z",
  },
];

export const categories = [
    {
        id: 1,
        title: "Fresh Vegetables",
        image: "/search-categories/fresh-vegetables.svg"
    },
    {
        id: 2,
        title: "Fresh Fruits",
        image: "/search-categories/diet-foods.svg"
    },
    {
        id: 3,
        title: "Fresh Meat",
        image: "/search-categories/diet-nutrition.svg"
    },
    {
        id: 4,
        title: "Fast Food",
        image: "/search-categories/fast-food.svg"
    },
    {
        id: 5,
        title: "Fruits Item",
        image: "/search-categories/fruits-items.svg"
    },
    {
        id: 6,
        title: "Heathy Food",
        image: "/search-categories/healthy-foods.svg"
    },
    {
        id: 7,
        title: "Grocery Items",
        image: "/search-categories/grocery-items.svg"
    },
    {
        id: 8,
        title: "Quality Milk",
        image: "/search-categories/quality-milk.svg"
    },
    {
        id: 9,
        title: "Cold Drinks",
        image: "/search-categories/cold-drinks.svg"
    },
    {
        id: 10,
        title: "Beef Steak",
        image: "/search-categories/beaf-steak.svg"
    },
    {
        id: 11,
        title: "Fresh Vegetables",
        image: "/search-categories/fresh-vegetables.svg"
    },
    {
        id: 12,
        title: "Fresh Fruits",
        image: "/search-categories/diet-foods.svg"
    },
    {
        id: 13,
        title: "Fresh Meat",
        image: "/search-categories/diet-nutrition.svg"
    },
    {
        id: 14,
        title: "Fast Food",
        image: "/search-categories/fast-food.svg"
    },
    {
        id: 15,
        title: "Fruits Item",
        image: "/search-categories/fruits-items.svg"
    },
    {
        id: 16,
        title: "Heathy Food",
        image: "/search-categories/healthy-foods.svg"
    },
    {
        id: 17,
        title: "Grocery Items",
        image: "/search-categories/grocery-items.svg"
    },
    {
        id: 18,
        title: "Quality Milk",
        image: "/search-categories/quality-milk.svg"
    },
    {
        id: 19,
        title: "Cold Drinks",
        image: "/search-categories/cold-drinks.svg"
    },
    {
        id: 20,
        title: "Beef Steak",
        image: "/search-categories/beaf-steak.svg"
    }
   
]

export const shops = [
  {
    id: 1,
    link: "/shops/1",
    logo: "/shop/shop-logo-1.webp",
    title: "Fresh Market",
    address: "1234 Market St, San Francisco, CA 94102"
  },
  {
    id: 2,
    link: "/shops/2",
    logo: "/shop/shop-logo-2.webp",
    title: "Organic Foods",
    address: "5678 Organic St, San Francisco, CA 94102"
  },
  {
    id: 3,
    link: "/shops/3",
    logo: "/shop/shop-logo-3.webp",
    title: "Farm Fresh",
    address: "91011 Farm St, San Francisco, CA 94102"
  },
  {
    id: 4,
    link: "/shops/4",
    logo: "/shop/shop-logo-4.webp",
    title: "Healthy Living",
    address: "121314 Health St, San Francisco, CA 94102"
  },
  {
    id: 5,
    link: "/shops/5",
    logo: "/shop/shop-logo-5.webp",
    title: "Fresh Produce",
    address: "151617 Produce St, San Francisco, CA 94102"
  },
  {
    id: 6,
    link: "/shops/6",
    logo: "/shop/shop-logo-6.webp",
    title: "Farmers Market",
    address: "181920 Farmer St, San Francisco, CA 94102"
  },
]