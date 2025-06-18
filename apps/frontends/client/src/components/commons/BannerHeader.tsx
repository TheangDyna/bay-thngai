interface BannerHeaderProps {
  title: string;
  subTitle: string;
}

const BannerHeader: React.FC<BannerHeaderProps> = ({ title, subTitle }) => {
  return (
    <div className="text-center">
      <h2 className="text-brand-dark text-lg lg:text-xl xl:text-[22px] xl:leading-8 font-bold font-manrope 3xl:text-[25px] 3xl:leading-9">
        {title}
      </h2>
      <p className="text-brand-muted text-sm leading-7 lg:text-15px xl:text-base pb-0.5 mt-1.5 lg:mt-2.5 xl:mt-3">
        {subTitle}
      </p>
    </div>
  );
};

export default BannerHeader;
