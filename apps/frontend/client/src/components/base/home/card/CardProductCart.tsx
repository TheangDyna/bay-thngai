import { MinusIcon, Plus, X } from "lucide-react";

interface CardProductCartProps {
  imageUrl: string;
  title: string;
  price: number;
  quantity: number;
}

const CardProductCart: React.FC<CardProductCartProps> = ({
  imageUrl,
  title,
  price,
  quantity
}) => {
  return (
    <div>
      <div className="w-full px-5 md:px-7 h-[calc(100vh_-_300px)]">
        <div className="group w-full h-auto flex justify-start items-center text-brand-light gap-4 py-4 md:py-7 border-b border-border-one border-opacity-70 relative last:border-b-0">
          <div className="relative flex rounded-[16px] overflow-hidden shrink-0 cursor-pointer w-[90px] md:w-[100px] h-[90px] md:h-[100px]">
            <img
              alt="Fresh Green Leaf Lettuce"
              loading="eager"
              width="100"
              height="100"
              decoding="async"
              data-nimg="1"
              className="object-cover p-2"
              src={imageUrl}
              style={{ color: "transparent", width: "auto" }}
            />
            <div
              className="absolute top-0 flex items-center justify-center w-full h-full transition duration-200 ease-in-out bg-black ltr:left-0 rtl:right-0 bg-opacity-30 md:bg-opacity-0 md:group-hover:bg-opacity-30"
              role="button"
            >
              <X className="w-6 h-6 relative text-2xl text-white transition duration-300 ease-in-out transform md:scale-0 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100" />
            </div>
          </div>
          <div className="flex items-start justify-between w-full overflow-hidden">
            <div className="ltr:pl-3 rtl:pr-3 md:ltr:pl-4 md:rtl:pr-4">
              <a
                className="block leading-5 transition-all text-secondary text-13px sm:text-sm lg:text-15px hover:text-brand"
                href="/en/products/fresh-green-leaf-lettuce"
              >
                {title}
              </a>
              <div className="text-13px sm:text-sm text-brand-muted mt-1.5 block mb-2 text-gray-500">
                1 kg X {quantity}
              </div>
              <div className="flex items-center justify-between rounded overflow-hidden shrink-0 p-1 ">
                <button className="flex items-center justify-center shrink-0  transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none !w-6 !h-6 pr-0 border border-border-three hover:bg-brand text-brand-muted hover:border-brand rounded-full hover:text-brand-light">
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="font-semibold text-secondary flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default shrink-0 text-15px w-9">
                  {quantity}
                </span>
                <button
                  className="group flex items-center justify-center shrink-0 transition-all ease-in-out duration-300 focus:outline-none focus-visible:outline-none pr-2 !w-6 !h-6 border text-brand-muted border-border-three hover:bg-brand hover:border-brand rounded-full hover:text-brand-light !pr-0"
                  title=""
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex font-semibold text-sm md:text-base text-secondary leading-5 shrink-0 min-w-[65px] md:min-w-[80px] justify-end">
              $ {price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProductCart;
