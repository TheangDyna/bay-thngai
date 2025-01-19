import React from "react";
import CardProduct from "../../CardProduct";
import BannerHeader from "../../BannerHeader";
import { products } from "@/data/constants/data";


const GrocerySection: React.FC = () => {
  const handleAddToCart = (title: string) => {
    alert(`${title} added to cart!`);
  };

  const handleViewDetails = (title: string) => {
    alert(`Viewing details for ${title}`);
  };

  return (
    <div className="px-10">
      <BannerHeader
        title="Best seller grocery near you"
        subTitle="We provide best quality &amp; fresh grocery items near your location"
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

export default GrocerySection;
