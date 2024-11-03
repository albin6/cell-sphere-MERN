import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/ui-components";
import { useUserBanners } from "../../hooks/CustomHooks";

function Banner() {
  const autoSlideInterval = 3000;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [banners, setBanners] = useState([]);
  const { data, isLoading, isError } = useUserBanners();

  useEffect(() => {
    console.log(data);
    setBanners(data);
  }, [data]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners?.length);
  }, [banners?.length]);

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners?.length) % banners?.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!banners?.length || banners?.length === 1 || !isAutoPlaying) return;

    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [banners?.length, isAutoPlaying, autoSlideInterval, nextSlide]);

  if (isLoading) {
    return (
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 text-gray-400">
            Loading...
          </h1>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 text-gray-400">
            Error...
          </h1>
        </div>
      </section>
    );
  }
  if (!banners?.length) {
    // If no banners, return null or a placeholder
    return (
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 text-gray-400">
            Welcome to Our Store
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-gray-100 overflow-hidden">
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full" aria-live="polite">
        {banners &&
          banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${banners.length}`}
            >
              <img
                src={banner.image}
                alt={"Banner"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black bg-opacity-40">
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 text-white">
                  {banner.heading_one}
                </h1>
                <h4 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-white">
                  {banner.heading_four}
                </h4>
                <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-8 text-white">
                  {banner.description}
                </p>
                <Button
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  onClick={() => (window.location.href = "/products/list")}
                >
                  Shop
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={previousSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide ? "true" : "false"}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Banner;
