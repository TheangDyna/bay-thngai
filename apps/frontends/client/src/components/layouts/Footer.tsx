import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Send, Twitter, Youtube } from "lucide-react";
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
              <Link
                to="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </Link>
              <Link
                to="#"
                className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </Link>
              <Link
                to="#"
                className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </Link>
              <Link
                to="#"
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <Youtube className="w-4 h-4 text-white" />
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
            <div className="w-10 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded text-white text-xs font-bold flex items-center justify-center">
              MC
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
              VISA
            </div>
            <div className="w-10 h-6 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
              PP
            </div>
            <div className="w-10 h-6 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center">
              JCB
            </div>
            <div className="w-10 h-6 bg-red-600 rounded text-white text-xs font-bold flex items-center justify-center">
              SK
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
