import SignIn from "@/pages/auth/SignIn";
import Cart from "@/pages/Cart";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@radix-ui/react-navigation-menu";

const NavigationBar = () => {
  return (
    <nav className="flex items-center justify-between w-full h-full mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 2xl:px-10 bg-white">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <a href="/">
          <img
            src="/bay-thngai-logo.svg"
            alt="logo"
            className="w-[100px] h-[100px]"
          />
        </a>

        {/* Categories Dropdown */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-800 hover:underline  hover:underline-offset-8 hover:text-primary">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute mt-2 z-50 bg-white shadow-md rounded-[16px] w-56 p-4">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Fresh Vegetable
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Diet Nutrition
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Healthy Food
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Organic Food
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Dietary Dropdown */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-800 hover:underline  hover:underline-offset-8 hover:text-primary">
                Dietary
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute mt-2 z-50 bg-white shadow-md rounded-[16px] w-56 p-4">
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Vegan
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Gluten-Free
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      className="block text-gray-700 hover:bg-gray-100 p-2 rounded-[12px]"
                      href="#"
                    >
                      Keto
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <span className="text-gray-800 hover:underline cursor-pointer  hover:underline-offset-8 hover:text-primary">
          Search
        </span>
        <span className="text-gray-800 hover:underline cursor-pointer  hover:underline-offset-8 hover:text-primary">
          Shop
        </span>
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
  );
};

export default NavigationBar;
