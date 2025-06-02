import BannerHeader from "@/components/commons/BannerHeader";
import CardProduct from "@/components/commons/CardProduct";
import { products } from "@/utils/data/constants/data";
import React, { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

const ProductSection: React.FC = () => {
  const [isOpenProductDetails, setIsOpenProductDetails] = useState(false);

  const handleAddToCart = (title: string) => {
    alert(`${title} added to cart!`);
  };

  const handleViewDetails = (title: string) => {
    alert(`Viewing details for ${title}`);
  };

  const handleProductModalDetails = () => {
    setIsOpenProductDetails(true);
  };

  const handleProductModalDetailsClose = () => {
    setIsOpenProductDetails(false);
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
            onClickProductModalDetails={handleProductModalDetails} // Correct event handler
          />
        ))}
      </div>
      <ProductDetailModal
        isOpenModal={isOpenProductDetails}
        onCloseModal={handleProductModalDetailsClose}
      />
    </div>
  );
};

export default ProductSection;
