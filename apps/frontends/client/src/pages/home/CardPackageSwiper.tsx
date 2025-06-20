import NextButton from "@/components/commons/NextButton";
import PrevButton from "@/components/commons/PrevButton";
import React, { useEffect, useRef, useState } from "react";
import { Swiper as SwiperClass } from "swiper"; // Import Swiper class for typing
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CardPackage from "../../components/commons/CardPackage";

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
            description="Savor authentic Italian dishes."
            imageUrl="/package-banner/1.png"
            title="Chef’s Italian Feast Package"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardPackage
            backgroundColor="#d9ebd2"
            description="Enjoy spicy Asian culinary delights."
            imageUrl="/package-banner/2.png"
            title="Asian Fusion Chef Special"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardPackage
            backgroundColor="#dbe5ef"
            description="Taste gourmet French cuisine."
            imageUrl="/package-banner/3.png"
            title="French Gourmet Meal Set"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardPackage
            backgroundColor="#EFD8D4"
            description="Indulge in savory Mediterranean flavors."
            imageUrl="/package-banner/4.png"
            title="Mediterranean Chef’s Delight"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default CardPackageSwiper;
