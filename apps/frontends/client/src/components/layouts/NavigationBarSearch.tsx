import SignIn from "@/components/commons/SignIn";
import Cart from "@/pages/Cart";
import SearchComponent from "../base/SearchComponent";

const NavigationBarSearch = () => {
  return (
    <div>
      <nav className="flex items-center justify-between w-full h-[10vh] mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 2xl:px-10 bg-[#F8F9FB]">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <a href="/">
            <img
              src="/bay-thngai-logo.svg"
              alt="logo"
              className="w-[100px] h-[100px]"
            />
          </a>
        </div>

        {/* Center Section */}
        <div className="flex items-center justify-center">
          <SearchComponent />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-10">
          {/* Language */}
          <div className="flex items-center space-x-2 cursor-pointer text-gray-800 hover:text-black">
            <img
              src="https://flagcdn.com/us.svg"
              alt="US Flag"
              className="w-5 h-5"
            />
            <span>English - EN</span>
          </div>

          {/* Cart */}
          <Cart />

          {/* Sign In */}
          <SignIn />
        </div>
      </nav>
    </div>
  );
};

export default NavigationBarSearch;
