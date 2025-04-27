import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import BannerHeader from "../../BannerHeader";
import CardCollections from "../card/CardCollections";
import PrevButton from "../../PrevButton";
import NextButton from "../../NextButton";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CollectionSection = () => {
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
    <div>
      <BannerHeader
        title="Curated collections"
        subTitle="We have categories the best quality grocery items"
      />

      <div className="relative px-10">
        {/* Navigation Buttons */}
        {isBeginning ? null : (
          <div className="absolute left-5 top-[165px] transform -translate-y-1/2 z-10">
            <PrevButton onClick={() => swiperRef.current?.slidePrev()} />
          </div>
        )}
        {isEnd ? null : (
          <div className="absolute right-5 top-[165px] transform -translate-y-1/2 z-10">
            <NextButton onClick={() => swiperRef.current?.slideNext()} />
          </div>
        )}

        {/* Swiper */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSwiperChange}
          spaceBetween={15}
          slidesPerView={3}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <CardCollections
              title="Feel the Thirst in summer anytime"
              description="Your body's way of telling you that it's make strong"
              imageUrl="/collections/1.webp"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCollections
              title="Most popular item for Fast food"
              description="Tasty and spicy fast food with different flavors."
              imageUrl="/collections/2.webp"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCollections
              title="Authentic japanese food in real taste"
              description="Your body's way of telling you that it's make strong"
              imageUrl="/collections/3.webp"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCollections
              title="Explore our family of freshest Foods"
              description="Your pet’s way of telling you that it's make taste"
              imageUrl="/collections/4.webp"
              path="#"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default CollectionSection;
