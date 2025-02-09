import Banner from "@/components/base/home/Banner";
import CategorySection from "@/components/base/home/section/CategorySection";
import GrocerySection from "@/components/base/home/section/GrocerySection";
import ProductSection from "@/components/base/home/section/Product/ProductSection";
import Promotion from "@/components/base/home/Promotion";
import CardPackageSwiper from "@/components/base/home/card/CardPackageSwiper";
import CollectionSection from "@/components/base/home/section/CollectionSection";
import DownloadBanner from "@/components/DownloadBanner";

const Home = () => {
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
