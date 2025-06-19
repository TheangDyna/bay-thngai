import { useCuisinesQuery } from "@/api/cuisine"; // adjust path to where your hooks live
import BannerHeader from "@/components/commons/BannerHeader";
import CardCategory from "@/components/commons/CardCategory";
import NextButton from "@/components/commons/NextButton";
import PrevButton from "@/components/commons/PrevButton";
import { useEffect, useRef, useState } from "react";
import { Swiper as SwiperClass } from "swiper";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CategorySection: React.FC = () => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // fetch cuisines
  const {
    data: cuisines,
    isLoading,
    isError
  } = useCuisinesQuery({
    sorting: [],
    columnFilters: []
  });

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [cuisines]);

  if (isLoading)
    return <div className="py-20 text-center">Loading categories…</div>;

  if (isError || !cuisines)
    return <div className="py-20 text-center">Failed to load categories</div>;

  return (
    <div className="space-y-6">
      <BannerHeader
        title="What food you love to order"
        subTitle="Here order your favorite foods from different categories"
      />

      <div className="relative px-10">
        {!isBeginning && (
          <div className="absolute left-5 top-[100px] transform -translate-y-1/2 z-10">
            <PrevButton onClick={() => swiperRef.current?.slidePrev()} />
          </div>
        )}
        {!isEnd && (
          <div className="absolute right-5 top-[100px] transform -translate-y-1/2 z-10">
            <NextButton onClick={() => swiperRef.current?.slideNext()} />
          </div>
        )}

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          spaceBetween={15}
          slidesPerView={7}
          modules={[SwiperPagination, Navigation]}
          className="mySwiper"
        >
          {cuisines.data.map((cuisine) => (
            <SwiperSlide key={cuisine._id}>
              <CardCategory
                imageUrl={cuisine.thumbnail}
                title={cuisine.name}
                path={`/search?cuisines=${cuisine._id}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySection;
