import React from "react";
import CardGrocery from "./CardGrocery";

const products = [
  {
    image: "/grocery/lettuce.png",
    title: "Fresh Green Leaf Lettuce",
    price: "2.64",
    originalPrice: "2.74",
    unit: "1 each",
    isOnSale: true
  },
  {
    image: "/grocery/fresh-carrots.png",
    title: "Fresh Carrots",
    price: "$3.50 - $5.00",
    unit: "1 lb",
    isOnSale: false
  },
  {
    image: "/grocery/orange.png",
    title: "Fresh Green Leaf Lettuce",
    price: "2.64",
    originalPrice: "2.74",
    unit: "1 each",
    isOnSale: true
  },
  {
    image: "/grocery/fresh-carrots.png",
    title: "Fresh Carrots",
    price: "$3.50 - $5.00",
    unit: "1 lb",
    isOnSale: false
  },
  {
    image: "/grocery/lettuce.png",
    title: "Fresh Green Leaf Lettuce",
    price: "2.64",
    originalPrice: "2.74",
    unit: "1 each",
    isOnSale: true
  },
  {
    image: "/grocery/fresh-carrots.png",
    title: "Fresh Carrots",
    price: "$3.50 - $5.00",
    unit: "1 lb",
    isOnSale: false
  },
  {
    image: "/grocery/lettuce.png",
    title: "Fresh Green Leaf Lettuce",
    price: "2.64",
    originalPrice: "2.74",
    unit: "1 each",
    isOnSale: true
  },
  {
    image: "/grocery/fresh-carrots.png",
    title: "Fresh Carrots",
    price: "$3.50 - $5.00",
    unit: "1 lb",
    isOnSale: false
  },
  {
    image: "/grocery/lettuce.png",
    title: "Fresh Green Leaf Lettuce",
    price: "2.64",
    originalPrice: "2.74",
    unit: "1 each",
    isOnSale: true
  },
  {
    image: "/grocery/fresh-carrots.png",
    title: "Fresh Carrots",
    price: "$3.50 - $5.00",
    unit: "1 lb",
    isOnSale: false
  }
];

const GrocerySection: React.FC = () => {
  const handleAddToCart = (title: string) => {
    alert(`${title} added to cart!`);
  };

  const handleViewDetails = (title: string) => {
    alert(`Viewing details for ${title}`);
  };

  return (
    <div className="px-10">
      <div className="mt-10  mb-5 xl:mb-6 text-center pb-2 lg:pb-3 xl:pb-4 3xl:pb-7">
        <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-bold font-manrope 3xl:text-[25px] 3xl:leading-9">
          Best seller grocery near you
        </h2>
        <p className="text-brand-muted text-sm leading-7 lg:text-15px xl:text-base pb-0.5 mt-1.5 lg:mt-2.5 xl:mt-3">
          We provide best quality &amp; fresh grocery items near your location
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 md:gap-4 2xl:gap-5">
        {products.map((product, index) => (
          <CardGrocery
            key={index}
            image={product.image}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            unit={product.unit}
            isOnSale={product.isOnSale}
            onAddToCart={() => handleAddToCart(product.title)}
            onViewDetails={() => handleViewDetails(product.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default GrocerySection;
