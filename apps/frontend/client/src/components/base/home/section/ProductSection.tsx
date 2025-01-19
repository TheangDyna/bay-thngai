import React from "react";
import CardProduct from "../../CardProduct";
import BannerHeader from "../../BannerHeader";

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

const ProductSection: React.FC = () => {
  const handleAddToCart = (title: string) => {
    alert(`${title} added to cart!`);
  };

  const handleViewDetails = (title: string) => {
    alert(`Viewing details for ${title}`);
  };

  return (
    <div className="px-10">
      <BannerHeader
        title="Popular product that we sold"
        subTitle="We provide best quality & fresh grocery items near your location"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 md:gap-4 2xl:gap-5">
        {products.map((product, index) => (
          <CardProduct
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

export default ProductSection;
