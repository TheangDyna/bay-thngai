import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import PrevButton from "@/components/base/PrevButton";
import NextButton from "@/components/base/NextButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Share, ShoppingBag, Tag } from "lucide-react";
import ShareLink from "@/components/base/ShareLink";
import { products } from "@/data/constants/data";
import CardProduct from "@/components/base/CardProduct";

interface ProductDetailModalProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpenModal,
  onCloseModal
}) => {
  const [isOpenShareLink, setIsOpenShareLink] = useState(false);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [relatedProductIndex, setRelatedProductIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const images = [
    "/grocery/orange.png",
    "/grocery/fresh-carrots.png",
    "/grocery/lettuce.png"
  ];

  const handleThumbnailClick = (index: number) => {
    setThumbnailIndex(index);
  };

  const handleThumbnailPrevious = () => {
    setThumbnailIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleThumbnailNext = () => {
    setThumbnailIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleRelatedProductPrevious = () => {
    setRelatedProductIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleRelatedProductNext = () => {
    setRelatedProductIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Group products into slides
  const groupedProducts = Array.from({ length: totalSlides }, (_, i) =>
    products.slice(i * itemsPerSlide, i * itemsPerSlide + itemsPerSlide)
  );

  const handleCloseShareLink = () => {
    setIsOpenShareLink(false);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Dialog open={isOpenModal} onOpenChange={(open) => !open && onCloseModal()}>
      <DialogContent className="sm:max-w-[80%]">
        <div className="h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-4">
            {/* Thumbnail Section */}
            <div className="w-[10%] h-[600px] flex items-center justify-start flex-col space-y-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`border ${
                    thumbnailIndex === index
                      ? "border-primary"
                      : "border-secondary/10"
                  } rounded-[16px] w-[100px] h-[100px] shrink-0 flex items-center justify-center cursor-pointer`}
                >
                  <img
                    src={image}
                    alt={`product_image_${index}`}
                    className="w-[80px] object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Preview Section */}
            <div className="w-[45%] h-[600px] relative">
              <Carousel
                className="w-full h-full"
                value={thumbnailIndex}
                onChange={(index: number) => setThumbnailIndex(index)}
              >
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className={`h-full rounded-[16px] ${
                        index === thumbnailIndex ? "" : "hidden"
                      }`}
                    >
                      <Card className="h-[450px] w-[450px] shrink-0 flex items-center justify-center bg-white rounded-[16px]">
                        <CardContent className="flex items-center justify-center">
                          <img
                            src={image}
                            alt={`product_image_${index}`}
                            className="object-cover w-[250px]"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Previous Button */}
                <PrevButton
                  onClick={handleThumbnailPrevious}
                  className="absolute top-[230px] left-4 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary"
                />

                {/* Next Button */}
                <NextButton
                  onClick={handleThumbnailNext}
                  className="absolute top-[230px] right-16 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary"
                />
              </Carousel>
            </div>

            {/* Product Info Section */}
            <div className="w-[45%] h-[600px]">
              {/* Product Title and Pricing */}
              <div className="pb-5">
                <div className="mb-2 md:mb-2.5 block -mt-1.5" role="button">
                  <h2 className="text-lg font-medium transition-colors duration-300  md:text-xl xl:text-2xl hover:text-primary">
                    Leafy Romaine Mixed Lettuce
                  </h2>
                </div>
                <div className="text-sm font-medium md:text-15px text-muted">
                  1 each
                </div>
                <div className="flex items-center mt-5 space-x-4">
                  <div className=" font-bold text-lg md:text-xl xl:text-[22px]">
                    $2.50
                  </div>
                  <del className="text-lg text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-muted">
                    $2.74
                  </del>
                  <Badge className="rounded-sm py-1 text-md hover:bg-[#E2F0E9] bg-[#E2F0E9] text-green-700/50 uppercase">
                    9% Off
                  </Badge>
                </div>
              </div>

              {/* Availability */}
              <div className="pb-2">
                <span className="text-sm font-medium text-warning">
                  Only 70 items left!
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-center gap-10 rounded overflow-hidden shrink-0 p-1 h-12 bg-gray-100 mb-4">
                <Button
                  onClick={decrement}
                  variant="link"
                  className="flex items-center justify-center shrink-0 h-full transition-all duration-300 focus:outline-none w-10 rounded-full  hover:bg-gray-200"
                >
                  <Minus size={20} />
                </Button>
                <span className="font-semibold  flex items-center justify-center h-full transition-colors duration-250 ease-in-out text-base md:text-[17px] w-12">
                  {quantity}
                </span>
                <Button
                  onClick={increment}
                  variant="link"
                  className="flex items-center justify-center shrink-0 transition-all duration-300 focus:outline-none w-10 h-10 rounded-full  hover:bg-gray-200"
                >
                  <Plus size={20} />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full h-12 bg-success gap-2 hover:bg-green-600 text-white font-medium rounded-md flex items-center justify-center mb-4">
                <ShoppingBag size={24} />
                Add to Cart
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button className="group text-[13px] space-x-2 flex items-center md:text-sm lg:text-15px leading-4  cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center  rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand-light -dark border border-border-four tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 group hover:text-primary">
                  <Heart size={24} />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setIsOpenShareLink(true)}
                  className="group text-[13px] space-x-2 flex items-center md:text-sm lg:text-15px leading-4  cursor-pointer transition ease-in-out duration-300 font-body font-semibold text-center justify-center  rounded placeholder-white focus-visible:outline-none focus:outline-none h-12 md:h-14 bg-brand-light -dark border border-border-four tracking-widest px-5 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 group hover:text-primary"
                >
                  <Share size={24} />
                  <span>Share</span>
                </button>
              </div>

              <ShareLink
                isOpenShareLink={isOpenShareLink}
                onCloseShareLink={handleCloseShareLink}
              />

              {/* Tags */}
              <div className="mt-5 flex items-center gap-4">
                <div className="text-md font-medium  flex items-center gap-2">
                  <Tag size={20} />
                  <span>Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Fresh food", "Organic", "Cilantro", "Dry Food"].map(
                    (tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="px-3 py-1 text-sm border cursor-pointer rounded-md text-muted hover:bg-gray-200"
                      >
                        {tag}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="pt-6 xl:pt-8">
                <h3 className="text-brand-dark text-15px sm:text-base font-semibold mb-3 lg:mb-3.5">
                  Product Details:
                </h3>
                <p className="text-brand-muted text-sm leading-7 lg:leading-[1.85em]">
                  Vegetables are parts of plants that are consumed by humans or
                  other animals as food. the first meaning remains commonly used
                  and is applied to plants collectively to ask all edible plant
                  matter, including the flowers, fruits, stems, leaves,
                  roots,...
                  <span
                    role="button"
                    className="text-primary ltr:ml-0.5 rtl:mr-0.5"
                  >
                    Read More
                  </span>
                </p>
              </div>
            </div>
          </div>

          <hr className="py-10 w-full" />

          <div className="-mt-1.5 mb-0">
            <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-bold font-manrope">
              Related products
            </h2>
          </div>
          <div className="relative">
            <Carousel
              opts={{
                align: "start"
              }}
              className="w-full max-w-6xl mx-auto  p-2 overflow-hidden"
              value={relatedProductIndex}
              onChange={(index: number) => setRelatedProductIndex(index)}
            >
              <CarouselContent
                className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25, 1, 0.5, 1)]"
                style={{
                  transform: `translateX(-${relatedProductIndex * 100}%)`
                }}
              >
                {groupedProducts.map((group, index) => (
                  <CarouselItem
                    key={index}
                    className="h-full rounded-[16px] shrink-0 w-full"
                  >
                    <div className="flex items-center justify-center gap-6 py-10">
                      {group.map((product, idx) => (
                        <CardProduct
                          className="w-[245px] h-[360px]"
                          key={idx}
                          image={product.image}
                          title={product.title}
                          price={product.price}
                          originalPrice={product.originalPrice}
                          unit={product.unit}
                          isOnSale={product.isOnSale}
                        />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Previous Button */}
              <PrevButton
                onClick={handleRelatedProductPrevious}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary"
              />

              {/* Next Button */}
              <NextButton
                onClick={handleRelatedProductNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary"
              />
            </Carousel>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
