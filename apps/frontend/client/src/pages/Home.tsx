import Banner from "@/components/base/home/Banner";
import CategorySection from "@/components/base/home/category/CategorySection";
import GrocerySection from "@/components/base/home/grocery/GrocerySection";
import Promotion from "@/components/base/home/Promotion";
import CardPackageSwiper from "@/components/base/home/swipper/CardPackageSwiper";

const Home = () => {
  return (
    <div className="flex justify-center flex-col space-y-10">
      <Banner />
      <CardPackageSwiper />
      <CategorySection />
      <GrocerySection />
      <Promotion />
    </div>
  );
};

export default Home;
