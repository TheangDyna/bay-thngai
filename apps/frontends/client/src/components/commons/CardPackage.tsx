interface ICardPackageProps {
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
}

const CardPackage: React.FC<ICardPackageProps> = ({
  title,
  description,
  imageUrl,
  backgroundColor
}) => {
  return (
    <div>
      <div
        className="relative flex items-center w-full overflow-hidden"
        style={{ backgroundColor: `${backgroundColor}` }}
      >
        <div className="flex shrink-0 w-36 lg:w-32 xl:w-40 2xl:w-36 3xl:w-[180px] ltr:pr-1.5 rtl:pl-1.5 2xl:ltr:pr-2.5 2xl:rtl:pl-2.5">
          <img
            alt="Spring cleaning for home appliance"
            loading="lazy"
            width="180"
            height="150"
            decoding="async"
            data-nimg="1"
            className="object-cover mx-auto p-8 transition duration-200 ease-in-out transform bg-sink-thumbnail group-hover:scale-105"
            src={imageUrl}
          />
        </div>
        <div className="py-3 px-1">
          <h2 className="text-brand-dark text-base xl:text-lg xl:leading-7 font-semibold font-manrope mb-[5px]">
            {title}
          </h2>
          <p className="text-sm leading-6 lg:text-13px xl:text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardPackage;
