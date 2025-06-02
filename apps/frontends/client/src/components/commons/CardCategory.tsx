interface ICardCategoryProps {
  title: string;
  imageUrl: string;
  path: string;
}

const CardCategory: React.FC<ICardCategoryProps> = ({
  imageUrl,
  path,
  title
}) => {
  return (
    <div>
      <a className="group block w-full text-center" href={path}>
        <div className="flex max-w-[200px] max-h-[200px] mb-3.5 xl:mb-4 mx-auto rounded-full overflow-hidden bg-[#F3F6FA]">
          <div className="flex shrink-0 transition-all duration-700 w-full h-full transform scale-50 group-hover:scale-100 -translate-x-full group-hover:translate-x-0">
            <img
              alt="Fresh Vegetables"
              loading="lazy"
              width="200"
              height="200"
              decoding="async"
              data-nimg="1"
              className="object-cover rounded-full aspect-square"
              src={imageUrl}
              style={{ color: "transparent" }}
            />
          </div>
          <div className="flex shrink-0 transition-all duration-700 w-full h-full transform scale-100 group-hover:scale-50 -translate-x-full group-hover:translate-x-0">
            <img
              alt="Fresh Vegetables"
              loading="lazy"
              width="200"
              height="200"
              decoding="async"
              data-nimg="1"
              className="object-cover rounded-full aspect-square"
              style={{ color: "transparent" }}
              src={imageUrl}
            />
          </div>
        </div>
        <h3 className="text-sm capitalize truncate text-brand-dark sm:text-15px lg:text-base">
          {title}
        </h3>
      </a>
    </div>
  );
};

export default CardCategory;
