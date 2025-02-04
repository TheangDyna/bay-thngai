import ShopCard from "@/components/base/shop/ShopCard";
import DownloadBanner from "@/components/pages/DownloadBanner";
import { shops } from "@/data/constants/data";

const Shop = () => {
  return (
    <div className="px-4 pt-10 lg:pt-12 xl:pt-14 pb-14 lg:pb-16 xl:pb-20 md:px-8">
      <h2 className="text-brand-dark text-base lg:text-lg xl:text-[20px] font-semibold xl:leading-8 mb-4 lg:mb-6">
        All Shops
      </h2>
      <div>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:gap-10 xl:gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {shops.map((shopItem, index) => {
            return (
              <ShopCard
                key={index}
                link={shopItem.link}
                logo={shopItem.logo}
                title={shopItem.title}
                address={shopItem.address}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-32">
        <DownloadBanner />
      </div>
    </div>
  );
};

export default Shop;
