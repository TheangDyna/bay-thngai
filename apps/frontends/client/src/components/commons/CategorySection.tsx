import BannerHeader from "@/components/commons/BannerHeader";
import CardCategory from "@/components/commons/CardCategory";
import NextButton from "@/components/commons/NextButton";
import PrevButton from "@/components/commons/PrevButton";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperClass } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

const CategorySection = () => {
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
        title="What food you love to order"
        subTitle="Here order your favorite foods from different categories"
      />

      <div className="relative px-10">
        {/* Navigation Buttons */}
        {isBeginning ? null : (
          <div className="absolute left-5 top-[100px] transform -translate-y-1/2 z-10">
            <PrevButton onClick={() => swiperRef.current?.slidePrev()} />
          </div>
        )}
        {isEnd ? null : (
          <div className="absolute right-5 top-[100px] transform -translate-y-1/2 z-10">
            <NextButton onClick={() => swiperRef.current?.slideNext()} />
          </div>
        )}

        {/* Swiper */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSwiperChange}
          spaceBetween={15}
          slidesPerView={7}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/fresh-vegetables.webp"
              title="Fresh Vegetables"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/diet-foods.webp"
              title="Diet Foods"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/diet-nutrition.webp"
              title="Diet Nutrition"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/fast-food.webp"
              title="Fast Food Items"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/fruits-items.webp"
              title="Fruits Items"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/healthy-foods.webp"
              title="Healthy Foods"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/grocery-items.webp"
              title="Grocery Items"
              path="#"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardCategory
              imageUrl="/category/quality-milk.webp"
              title="Quality Milk"
              path="#"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySection;
