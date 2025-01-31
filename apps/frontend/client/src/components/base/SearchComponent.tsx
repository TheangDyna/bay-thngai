import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { products } from "@/data/constants/data";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products based on the query
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="relative">
      <div className="flex items-center border w-80 z-50 focus-within:border-primary transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchIcon className="w-5 h-5" />
      </div>
      {/* Product Results */}
      {searchQuery && (
        <div className="mt-75">
          {filteredProducts.length > 0 ? (
            <div className="absolute top-14 flex flex-col space-y-4 bg-white p-2 w-80 h-[400px] overflow-y-scroll  overflow-hidden rounded-[16px] shadow-md">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 shrink-0 hover:bg-gray-100 py-2  px-2 rounded-[16px] cursor-pointer"
                >
                  <div className="bg-white rounded-[16px] py-2 px-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-14 h-14 object-contain flex-shrink-0"
                    />
                  </div>
                  <p className="text-sm mt-2">{product.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute top-14 bg-white p-2 w-80 h-[400px] overflow-y-scroll  overflow-hidden rounded-[16px] shadow-md">
              <div className="flex items-center justify-center h-full flex-col space-y-4">
                <img
                  src="/not-found.png"
                  alt="not-found"
                  className="w-20 h-20 object-cover"
                />
                <span>
                  No results found for
                  <span className="font-semibold ml-2">{searchQuery}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
