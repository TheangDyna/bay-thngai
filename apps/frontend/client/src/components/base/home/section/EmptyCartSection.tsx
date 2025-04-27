const EmptyCartSection = () => {
  return (
    <div>
      <div className="flex-grow flex flex-col items-center justify-center px-5 pt-8 pb-5">
        <div className="flex mx-auto w-[220px]">
          <img
            alt="Your cart is empty."
            loading="lazy"
            width="190"
            height="190"
            className="aspect-square"
            src="/empty-cart.webp"
            style={{ color: "transparent" }}
          />
        </div>
        <h3 className="text-gray-900 font-semibold text-xl mb-1.5 pt-8">
          Your cart is empty.
        </h3>
        <p className="text-gray-600 text-sm text-center">
          Please add product to your cart list
        </p>
      </div>
    </div>
  );
};

export default EmptyCartSection;
