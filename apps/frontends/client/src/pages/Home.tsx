import Banner from "@/components/commons/Banner";
import CardPackageSwiper from "@/components/commons/CardPackageSwiper";
import CategorySection from "@/components/commons/CategorySection";
import CollectionSection from "@/components/commons/CollectionSection";
import DownloadBanner from "@/components/commons/DownloadBanner";
import { GrocerySection } from "@/components/commons/GrocerySection";
import ProductSection from "@/components/commons/ProductSection";
import Promotion from "@/components/commons/Promotion";

const Home: React.FC = () => {
  return (
    <div className="flex justify-center flex-col space-y-10">
      <Banner />
      <CardPackageSwiper />
      <CategorySection />
      <GrocerySection />
      <Promotion />
      <ProductSection />
      <CollectionSection />
      <DownloadBanner />
    </div>
  );
};

export default Home;
