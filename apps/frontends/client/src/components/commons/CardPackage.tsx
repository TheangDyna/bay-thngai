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
    <div className="flex" style={{ backgroundColor: `${backgroundColor}` }}>
      <img
        alt="Spring cleaning for home appliance"
        className="w-32 h-auto object-cover mx-auto transition duration-200 ease-in-out transform bg-sink-thumbnail group-hover:scale-105"
        src={imageUrl}
      />
      <div className="w-full p-6">
        <h2 className="text-brand-dark text-base xl:text-lg xl:leading-7 font-semibold font-manrope mb-[5px]">
          {title}
        </h2>
        <p className="text-sm leading-6 lg:text-13px xl:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CardPackage;
