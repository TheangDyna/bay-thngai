import axiosInstance from "@/utils/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import CardProduct from "@/components/commons/CardProduct";
import DownloadBanner from "@/components/commons/DownloadBanner";
import ProductDetailModal from "@/components/commons/ProductDetailModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import type { Product } from "@/interface/product";
import { categories } from "@/utils/data/constants/data";

const ITEMS_PER_PAGE = 12;

function getSortParam(sortBy: string): string | undefined {
  switch (sortBy) {
    case "lowest-price":
      return "price";
    case "highest-price":
      return "-price";
    case "newest":
      return "-createdAt";
    case "oldest":
      return "createdAt";
    default:
      return undefined;
  }
}

interface ICategoriesListProps {
  imageURL: string;
  title: string;
  isLastItem: boolean;
}

const CategoriesList: React.FC<ICategoriesListProps> = ({
  imageURL,
  title,
  isLastItem
}) => {
  return (
    <ul>
      <li
        className={`flex justify-between items-center transition text-sm hover:bg-gray-200 cursor-pointer ${
          isLastItem ? "" : "border-b"
        } px-3.5 py-3 md:text-[15px]`}
      >
        <button className="flex items-center w-full">
          <div className="flex space-x-4 items-center shrink-0 w-12 h-12 md:mr-4">
            <img
              alt="Category"
              loading="lazy"
              width="40"
              height="40"
              decoding="async"
              src={imageURL}
              style={{ color: "transparent", width: "auto" }}
            />
            <span className="text-gray-800 capitalize py-0.5">{title}</span>
          </div>
        </button>
      </li>
    </ul>
  );
};

const Search: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<string>("");

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<{ data: Product[]; total: number }, Error>({
      queryKey: ["products", sortBy],
      queryFn: async ({ pageParam = 1 }) => {
        const sortParam = getSortParam(sortBy);
        const params: Record<string, any> = {
          page: pageParam,
          limit: ITEMS_PER_PAGE
        };
        if (sortParam) {
          params.sort = sortParam;
        }
        const response = await axiosInstance.get("/products", { params });
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        const fetchedSoFar = pages.length * ITEMS_PER_PAGE;
        return fetchedSoFar < lastPage.total ? pages.length + 1 : undefined;
      }
    });

  // Flatten all fetched pages into one array
  const allProducts: Product[] = data
    ? data.pages.flatMap((pg) => pg.data)
    : [];

  // When the user scrolls near the bottom, load the next page
  useEffect(() => {
    const handleScroll = () => {
      // Scroll position + viewport height
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100; // 100px threshold

      if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Modal state
  const [isOpenProductDetails, setIsOpenProductDetails] = useState(false);
  const handleProductModalDetails = () => {
    setIsOpenProductDetails(true);
  };
  const handleProductModalDetailsClose = () => {
    setIsOpenProductDetails(false);
  };

  return (
    <div className="flex items-start justify-center space-x-6 p-10">
      {/* Left Sidebar: Categories */}
      <div className="w-1/4">
        <span className="font-semibold text-md">Categories</span>
        <div className="mt-5 border rounded-lg">
          {categories.map((categoryItem, index) => (
            <CategoriesList
              key={index}
              imageURL={categoryItem.image}
              title={categoryItem.title}
              isLastItem={index === categories.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Right: Product List */}
      <div className="w-3/4 flex flex-col">
        {/* Header: count + sort dropdown */}
        <div className="flex justify-between items-center">
          <span className="text-md font-semibold">
            Showing {allProducts.length} results
          </span>
          <div className="flex items-center space-x-2">
            <Select onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-44">
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

        {/* Grid of Products */}
        <div className="mt-5 grid grid-cols-3 gap-4 px-2">
          {allProducts.map((product, idx) => (
            <CardProduct
              key={product._id || idx}
              image={product.thumbnail || product.image}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              unit={product.unit}
              isOnSale={product.isOnSale}
              onClickProductModalDetails={handleProductModalDetails}
              onAddToCart={() => {}}
              onViewDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {/* Loading indicator at bottom of page */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-gray-500" size={24} />
          </div>
        )}

        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
        <DownloadBanner />
      </div>
    </div>
  );
};

export default Search;
