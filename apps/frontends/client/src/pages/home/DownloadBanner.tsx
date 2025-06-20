const DownloadBanner = () => {
  return (
    <div>
      <div className="bg-gray-100 overflow-hidden">
        <div className="max-w-[1920px] mx-auto md:flex justify-between items-center">
          <div className="shrink-0 mx-auto md:ltr:ml-0 md:rtl:mr-0 lg:flex lg:items-center pb-5 pt-1.5 md:pt-4 max-w-[350px] md:max-w-[340px] lg:max-w-[485px] xl:max-w-[540px] 2xl:max-w-[680px] 3xl:ltr:pl-10 3xl:rtl:pr-10">
            <div className="py-8 text-left xl:py-10 2xl:py-14 md:ltr:text-left md:rtl:text-right">
              <h2 className="text-[22px] md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[42px] leading-9 lg:leading-[1.4em] xl:leading-[1.45em] text-brand-dark font-bold font-manrope -tracking-[0.2px] mb-3 lg:mb-4">
                Make your online dining easier with the Baythngai mobile app
              </h2>
              <p className="text-15px xl:text-base 2xl:text-[17px] leading-7 xl:leading-9 text-brand-dark text-opacity-70 pb-5 lg:pb-7 ltr:pr-0 rtl:pl-0 xl:ltr:pr-8 xl:rtl:pl-8 2xl:ltr:pr-20 2xl:rtl:pl-20">
                Baythngai makes online meal ordering fast and easy. Get
                delicious chef-prepared dishes delivered and enjoy the best of
                culinary excellence.
              </p>
              <div className="flex justify-center md:justify-start -mx-1 md:-mx-1.5 pt-0.5 px-7 sm:px-0">
                <a
                  className="inline-flex transition duration-200 ease-in hover:box-shadow hover:opacity-80 mx-1 md:mx-1.5"
                  href="https://play.google.com/store/games"
                >
                  <img
                    alt="App Store"
                    width="170"
                    height="56"
                    decoding="async"
                    data-nimg="1"
                    className="rounded-md w-36 lg:w-44"
                    src="/play-store.webp"
                    style={{ color: "transparent" }}
                  />
                </a>
                <a
                  className="inline-flex transition duration-200 ease-in hover:box-shadow hover:opacity-80 mx-1 md:mx-1.5"
                  href="https://www.apple.com/app-store/"
                >
                  <img
                    alt="Play Store"
                    width="170"
                    height="56"
                    decoding="async"
                    data-nimg="1"
                    className="rounded-md w-36 lg:w-44"
                    src="/app-store.webp"
                    style={{ color: "transparent" }}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-end ltr:pl-4 rtl:pr-4 2xl:ltr:pl-0 2xl:rtl:pr-0 md:max-w-[480px] lg:max-w-[540px] xl:max-w-auto ltr:-mr-16 rtl:-ml-16 lg:ltr:-mr-8 lg:rtl:-ml-8 3xl:ltr:mr-24 3xl:rtl:ml-24">
            <img
              alt="App Thumbnail"
              width="597"
              height="500"
              decoding="async"
              data-nimg="1"
              src="/app-thumbnail.webp"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadBanner;
