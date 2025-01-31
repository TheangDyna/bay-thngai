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
import { CheckCircleIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const Search = () => {
  const [isOpenProductDetails, setIsOpenProductDetails] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentProducts, setCurrentProducts] = useState(
    products.slice(0, ITEMS_PER_PAGE)
  );

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

    // Set hasMoreData based on whether there are still more products to load
    return newProducts.length < products.length;
  };

  const handleLoadMore = async () => {
    setIsLoading(true);
    const moreDataAvailable = await fetchMoreData();
    setHasMoreData(moreDataAvailable);
    setIsLoading(false);
  };

  useEffect(() => {
    const initialFetch = async () => {
      const moreDataAvailable = await fetchMoreData();
      setHasMoreData(moreDataAvailable);
    };

    // Initial data fetch when component mounts
    initialFetch();
  }, []); // Empty dependency array ensures this runs once when the component loads

  return (
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
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem
                      value="grid"
                      onClick={() => setSelectedValue("grid")}
                    >
                      Grid
                      {selectedValue === "grid" && <CheckCircleIcon />}
                    </SelectItem>
                    <SelectItem
                      value="list"
                      onClick={() => setSelectedValue("list")}
                    >
                      List
                      {selectedValue === "list" && <CheckCircleIcon />}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Select>
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
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 md:gap-4 2xl:gap-5 mt-5">
          {currentProducts.slice(0, 10).map((product, index) => (
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
