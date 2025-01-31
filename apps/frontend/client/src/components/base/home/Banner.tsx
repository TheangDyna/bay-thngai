import { Search } from "lucide-react";

const Banner = () => {
  return (
    <div
      className="w-full bg-no-repeat bg-cover bg-center flex items-center bg-fill-thumbnail hero-banner-six min-h-[400px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[650px] py-20 py:pt-24 mb-5 2xl:bg-center"
      style={{
        backgroundImage: "url(/banner-4.webp)",
        backgroundPosition: "center center"
      }}
    >
      <div className="mx-auto h-full flex flex-col text-center px-6 xl:max-w-[750px] 2xl:max-w-[850px] max-w-[480px] md:max-w-[550px]">
        <div className="text-center">
          <h2 className=" text-3xl md:text-4xl font-manrope font-extrabold leading-snug md:leading-tight xl:leading-[1.3em] mb-3 md:mb-4 xl:mb-3 -mt-2 xl:-mt-3 2xl:-mt-4 text-brand-tree-dark xl:text-5xl 2xl:text-[55px]">
            Healthy vegetable that you deserve to eat fresh
          </h2>
          <p className=" text-base md:text-[17px] xl:text-lg leading-7 md:leading-8 xl:leading-[1.92em] xl:px-16 text-brand-dark text-opacity-80 2xl:px-32">
            We source and sell the very best beef, lamb and pork, sourced with
            the greatest care from farmer.
          </p>
          <div className="hidden lg:block max-w-[700px] mx-auto md:pt-1 lg:pt-3">
            <div className="lg:flex">
              <form
                className="relative flex w-full mt-6 rounded-md border border-gray-300 shadow-lg bg-white"
                noValidate
                role="search"
              >
                <label
                  htmlFor="hero-search"
                  className="flex flex-1 items-center py-0.5"
                >
                  <input
                    id="hero-search"
                    className="w-full pl-[20px] text-sm border-none outline-none text-gray-700 h-14 ltr:pl-5 rtl:pr-5 md:ltr:pl-6 md:rtl:pr-6 ltr:pr-14 rtl:pl-14 md:ltr:pr-16 md:rtl:pl-16 md:h-16 placeholder:text-gray-400 rounded-md lg:text-base focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    placeholder="What are you looking..."
                    aria-label="Search"
                    autoComplete="off"
                    value=""
                  />
                </label>
                <button
                  type="submit"
                  title="Search"
                  className="absolute top-0 right-1 flex items-center justify-center h-full transition duration-200 ease-in-out outline-none ltr:right-0 rtl:left-0 w-14 md:w-16 hover:text-primary focus:outline-none"
                >
                  <Search className="w-6 h-6 text-gray-500" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
