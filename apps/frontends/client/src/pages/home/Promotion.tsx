interface PromotionProps {
  src: string;
}

export const Promotion = ({ src }: PromotionProps) => {
  return (
    <div className="mx-auto px-10">
      <a className="h-full" href="#">
        <img
          alt="promotion"
          className="object-cover w-full"
          src={src}
          style={{ color: "transparent" }}
        />
      </a>
    </div>
  );
};
