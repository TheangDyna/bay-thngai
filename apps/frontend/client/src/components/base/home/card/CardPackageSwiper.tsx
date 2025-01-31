import React, { useRef, useState, useEffect } from "react";
import CardPackage from "./CardPackage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperClass } from "swiper"; // Import Swiper class for typing
import NextButton from "../../NextButton";
import PrevButton from "../../PrevButton";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CardPackageSwiper: React.FC = () => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSwiperChange = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current;
      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
    }
  }, []);

  return (
    <div className="relative px-10">
      {/* Navigation Buttons */}
      {isBeginning ? null : (
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
          <PrevButton onClick={() => swiperRef.current?.slidePrev()} />
        </div>
      )}

      {isEnd ? null : (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 z-10">
          <NextButton onClick={() => swiperRef.current?.slideNext()} />
        </div>
      )}

      {/* Swiper */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSwiperChange}
        spaceBetween={50}
        slidesPerView={3}
        pagination={{
          dynamicBullets: true
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <CardPackage
            backgroundColor="#ffeed6"
            description="Get your clean on supplies."
            imageUrl="/package-banner/1.webp"
            title="Spring cleaning for home appliance"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardPackage
            backgroundColor="#d9ebd2"
            description="Get your clean on supplies."
            imageUrl="/package-banner/2.webp"
            title="Your pet choice for fresh healthy food"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardPackage
            backgroundColor="#dbe5ef"
            description="Get your clean on supplies."
            imageUrl="/package-banner/3.webp"
            title="Washing item with discount product"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardPackage
            backgroundColor="#EFD8D4"
            description="Get your clean on supplies."
            imageUrl="/package-banner/4.webp"
            title="Fresh quality meat item with discount"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default CardPackageSwiper;
