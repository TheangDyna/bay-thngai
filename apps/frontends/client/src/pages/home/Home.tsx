import Banner from "@/pages/home/Banner";
import { BestSellersSection } from "@/pages/home/BestSellersSection";
import CardPackageSwiper from "@/pages/home/CardPackageSwiper";
import CategorySection from "@/pages/home/CategorySection";
import CollectionSection from "@/pages/home/CollectionSection";
import DownloadBanner from "@/pages/home/DownloadBanner";
import { NewArrivalsSection } from "@/pages/home/NewArrivalsSection";
import Promotion from "@/pages/home/Promotion";
import { TopRatedsSection } from "@/pages/home/TopRatedsSection";

const Home: React.FC = () => {
  return (
    <div className="flex justify-center flex-col space-y-14">
      <Banner />
      <CardPackageSwiper />
      <CategorySection />
      <BestSellersSection />
      <NewArrivalsSection />
      <TopRatedsSection />
      <CollectionSection />
      <Promotion />
      <DownloadBanner />
    </div>
  );
};

export default Home;
