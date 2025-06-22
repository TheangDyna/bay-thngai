import { Apple, ChefHat, Coffee, Cookie, Pizza, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Preparing your feast...");

  const loadingMessages = [
    "Preparing your feast...",
    "Selecting fresh ingredients...",
    "Cooking with love...",
    "Almost ready to serve...",
    "Very fun!"
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Food Icons */}
        <div className="relative">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="animate-bounce delay-0">
              <Pizza className="w-8 h-8 text-red-500" />
            </div>
            <div className="animate-bounce delay-150">
              <ChefHat className="w-10 h-10 text-orange-600" />
            </div>
            <div className="animate-bounce delay-300">
              <Coffee className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          {/* Floating Food Elements */}
          <div className="absolute -top-4 -left-4 animate-float">
            <Cookie className="w-6 h-6 text-amber-500 opacity-60" />
          </div>
          <div className="absolute -top-2 -right-6 animate-float-delayed">
            <Apple className="w-5 h-5 text-red-400 opacity-60" />
          </div>
        </div>

        {/* Main Loading Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 border-2 border-red-300 rounded-full border-b-transparent animate-spin-slow"></div>
            <Utensils className="absolute inset-0 m-auto w-8 h-8 text-orange-600 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
            {loadingText}
          </h2>
        </div>
      </div>
    </div>
  );
}
