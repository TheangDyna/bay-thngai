import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/bay-thngai-logo.svg"
                alt="Bay Thngai logo"
                className="w-16 h-16"
              />
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              We offer high-quality foods and the best delivery service, and the
              food market you can blindly trust
            </p>
            <div className="flex gap-3">
              <Link to="#">
                <img
                  src="/social-media/facebook.webp"
                  alt="facebook"
                  className="w-8 h-8"
                />
              </Link>
              <Link to="#">
                <img
                  src="/social-media/twitter.webp"
                  alt="twitter"
                  className="w-8 h-8"
                />
              </Link>
              <Link to="#">
                <img
                  src="/social-media/instagram.webp"
                  alt="instagram"
                  className="w-8 h-8"
                />
              </Link>
              <Link to="#">
                <img
                  src="/social-media/youtube.webp"
                  alt="youtube"
                  className="w-8 h-8"
                />
              </Link>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
            <div className="space-y-3">
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                About us
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Contact us
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                About team
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Customer Support
              </Link>
            </div>
          </div>

          {/* Our Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Our Information
            </h3>
            <div className="space-y-3">
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Privacy policy update
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Terms & conditions
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Return Policy
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Site Map
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <div className="space-y-3">
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Announcements
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Answer center
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Discussion boards
              </Link>
              <Link
                to="#"
                className="block text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Giving works
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Subscribe Now</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Subscribe your email for newsletter and featured news based on
              your interest
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Write your email here"
                className="flex-1 text-sm"
              />
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © Copyright 2025 REDQ All rights reserved
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <img
              src="/payments/mc.png"
              alt="mc"
              className="h-9 w-h-9 object-contain"
            />
            <img
              src="/payments/visa.png"
              alt="visa"
              className="h-10 w-10 object-contain"
            />
            <img
              src="/payments/pp.png"
              alt="pp"
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
