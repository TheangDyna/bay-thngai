interface IShopCardProps {
  link?: string;
  logo?: string;
  title?: string;
  address?: string;
}

const ShopCard: React.FC<IShopCardProps> = ({ link, logo, title, address }) => {
  return (
    <div>
      <a
        className="relative flex items-center space-x-4 px-5 py-5 transition-all bg-white border rounded-lg cursor-pointer xl:px-7 xl:py-7 border-border-base shadow-vendorCard hover:shadow-vendorCardHover"
        href={link}
      >
        <div className="relative flex items-center justify-center w-16 h-16 overflow-hidden rounded-full shrink-0 bg-fill-thumbnail xl:w-20 xl:h-20">
          <img
            alt="text-logo"
            loading="lazy"
            decoding="async"
            data-nimg="fill"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={logo}
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              inset: 0,
              objectFit: "cover",
              color: "transparent"
            }}
          />
        </div>
        <div className="flex flex-col ltr:ml-4 rtl:mr-4 xl:ltr:ml-5 xl:rtl:mr-5">
          <h3 className="text-primary text-base lg:text-[20px] lg:leading-7 font-medium pb-1.5">
            {title}
          </h3>
          <p className="text-muted text-md leading-7 lg:leading-[27px] lg:text-[16px] tracking-[1.2px] xl:leading-6">
            {address}
          </p>
        </div>
      </a>
    </div>
  );
};

export default ShopCard;
