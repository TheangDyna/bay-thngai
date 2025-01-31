import CardProduct from "@/components/base/CardProduct";
import ProductDetailModal from "@/components/base/home/section/Product/ProductDetailModal";
import { categories, products } from "@/data/constants/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/interface/product";

const ITEMS_PER_PAGE = 10;

const Search = () => {
  const [isOpenProductDetails, setIsOpenProductDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentProducts, setCurrentProducts] = useState(
    products.slice(0, ITEMS_PER_PAGE)
  );
  const [sortBy, setSortBy] = useState("");

  const handleAddToCart = () => {
    setIsOpenProductDetails(true);
  };

  const handleViewDetails = () => {
    setIsOpenProductDetails(true);
  };

  const handleProductModalDetails = () => {
    setIsOpenProductDetails(true);
  };

  const handleProductModalDetailsClose = () => {
    setIsOpenProductDetails(false);
  };

  const fetchMoreData = async () => {
    const newPage = currentPage + 1;
    const newProducts = products.slice(0, newPage * ITEMS_PER_PAGE);
    setCurrentPage(newPage);
    setCurrentProducts(newProducts);
    setHasMoreData(newProducts.length < products.length);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    await fetchMoreData();
    setIsLoading(false);
  };

  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const parsePrice = (price: string) => {
      return parseFloat(price.replace(/[^0-9.]/g, ""));
    };

    switch (sortBy) {
      case "lowest-price":
        return [...products].sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        );
      case "highest-price":
        return [...products].sort(
          (a, b) => parsePrice(b.price) - parsePrice(a.price)
        );
      case "newest":
        return [...products].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return [...products].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return products;
    }
  };

  // Reset currentPage when sortBy changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // Update currentProducts whenever sortBy or currentPage changes
  useEffect(() => {
    const sortedProducts = sortProducts(products, sortBy);
    setCurrentProducts(sortedProducts.slice(0, currentPage * ITEMS_PER_PAGE));
    setHasMoreData(sortedProducts.length > currentPage * ITEMS_PER_PAGE);
  }, [sortBy, currentPage]);

  // Initial data fetch when component mounts
  useEffect(() => {
    setHasMoreData(currentProducts.length < products.length);
  }, []);

  return (
    <div>
      <div className="flex items-start justify-center space-x-6 p-10">
        <div className="h-full w-[25%]">
          <span className="font-semibold text-md">Categories</span>
          <div className="mt-5 border rounded-lg">
            {categories.map((categoryItem, index) => {
              return (
                <CategoriesList
                  key={index}
                  imageURL={categoryItem.image}
                  title={categoryItem.title}
                  isLastItem={index === categories.length - 1}
                />
              );
            })}
          </div>
        </div>
        <div className="h-[100vh] w-[75%]">
          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">
              Showing {currentProducts.length} of {products.length} results
            </span>
            <div className="flex items-center space-x-2">
              <Select onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="lowest-price">Lowest Price</SelectItem>
                    <SelectItem value="highest-price">Highest Price</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 md:gap-4 2xl:gap-5 mt-5">
            {currentProducts.map((product, index) => (
              <CardProduct
                key={index}
                image={product.image}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                unit={product.unit}
                isOnSale={product.isOnSale}
                onAddToCart={() => handleAddToCart()}
                onViewDetails={() => handleViewDetails()}
                onClickProductModalDetails={handleProductModalDetails}
              />
            ))}
          </div>
          <div className="flex justify-center w-full mt-10">
            {hasMoreData && (
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 rounded-full"
              >
                Load More
                {isLoading && <Loader2 className="animate-spin" />}
              </Button>
            )}
          </div>

          <ProductDetailModal
            isOpenModal={isOpenProductDetails}
            onCloseModal={handleProductModalDetailsClose}
          />
        </div>
      </div>
      <div className="bg-fill-two overflow-hidden pt-1.5 md:pt-0">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-5 md:px-6 lg:px-16 xl:px-28 2xl:px-32 3xl:px-40 md:flex justify-between items-center">
          <div className="shrink-0 mx-auto md:ltr:ml-0 md:rtl:mr-0 lg:flex lg:items-center pb-5 pt-1.5 md:pt-4 max-w-[350px] md:max-w-[340px] lg:max-w-[485px] xl:max-w-[540px] 2xl:max-w-[680px] 3xl:ltr:pl-10 3xl:rtl:pr-10">
            <div className="py-8 text-left xl:py-10 2xl:py-14 md:ltr:text-left md:rtl:text-right">
              <h2 className="text-[22px] md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px] leading-9 lg:leading-[1.4em] xl:leading-[1.45em] text-brand-dark font-bold font-manrope -tracking-[0.2px] mb-3 lg:mb-4">
                Make your online shop easier with our mobile app
              </h2>
              <p className="text-15px xl:text-base 2xl:text-[17px] leading-7 xl:leading-9 text-brand-dark text-opacity-70 pb-5 lg:pb-7 ltr:pr-0 rtl:pl-0 xl:ltr:pr-8 xl:rtl:pl-8 2xl:ltr:pr-20 2xl:rtl:pl-20">
                BoroBazar makes online grocery shopping fast and easy. Get
                groceries delivered and order the best of seasonal farm fresh
                food.
              </p>
              <div className="flex justify-center md:justify-start -mx-1 md:-mx-1.5 pt-0.5 px-7 sm:px-0">
                <a
                  className="inline-flex transition duration-200 ease-in hover:box-shadow hover:opacity-80 mx-1 md:mx-1.5"
                  href="https://www.apple.com/app-store/"
                >
                  <img
                    alt="App Store"
                    width="170"
                    height="56"
                    decoding="async"
                    data-nimg="1"
                    className="rounded-md w-36 lg:w-44"
                    src="/play-store.webp"
                    style={{ color: "transparent" }}
                  />
                </a>
                <a
                  className="inline-flex transition duration-200 ease-in hover:box-shadow hover:opacity-80 mx-1 md:mx-1.5"
                  href="https://play.google.com/store/games"
                >
                  <img
                    alt="Play Store"
                    width="170"
                    height="56"
                    decoding="async"
                    data-nimg="1"
                    className="rounded-md w-36 lg:w-44"
                    src="/app-store.png"
                    style={{ color: "transparent" }}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-end ltr:pl-4 rtl:pr-4 2xl:ltr:pl-0 2xl:rtl:pr-0 md:max-w-[480px] lg:max-w-[540px] xl:max-w-auto ltr:-mr-16 rtl:-ml-16 lg:ltr:-mr-8 lg:rtl:-ml-8 3xl:ltr:mr-24 3xl:rtl:ml-24">
            <img
              alt="App Thumbnail"
              width="597"
              height="500"
              decoding="async"
              data-nimg="1"
              src="/app-thumbnail.webp"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

interface ICategoriesListProps {
  imageURL: string;
  title: string;
  isLastItem: boolean; // Add isLastItem prop
}

const CategoriesList: React.FC<ICategoriesListProps> = ({
  imageURL,
  title,
  isLastItem // Destructure isLastItem
}) => {
  return (
    <ul>
      <li
        className={`flex justify-between items-center transition text-sm hover:bg-gray-200 cursor-pointer md:text-15px ${isLastItem ? "" : "border-b"} px-3.5 2xl:px-4 py-3 xl:py-3.5 2xl:py-2.5 3xl:py-3`}
      >
        <button className="flex items-center w-full cursor-pointer group ltr:text-left rtl:text-right">
          <div className="flex space-x-4 items-center shrink-0 2xl:w-12 2xl:h-12 3xl:w-auto 3xl:h-auto ltr:mr-2.5 rtl:ml-2.5 md:ltr:mr-4 md:rtl:ml-4 2xl:ltr:mr-3 2xl:rtl:ml-3 3xl:ltr:mr-4 3xl:rtl:ml-4">
            <img
              alt="Fresh Vegetables"
              loading="lazy"
              width="40"
              height="40"
              decoding="async"
              data-nimg="1"
              src={imageURL}
              style={{ color: "transparent", width: "auto" }}
            />
            <span className="text-brand-dark capitalize py-0.5">{title}</span>
          </div>
        </button>
      </li>
    </ul>
  );
};
