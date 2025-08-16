// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold">TopNews</h2>
          <p className="mt-3 text-gray-400">
            Stay informed with the latest updates, breaking news, and in-depth
            articles from around the world. Your trusted source for daily
            stories.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/categories" className="hover:text-white">
                Categories
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-gray-700 p-2 rounded-full hover:bg-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-gray-700 p-2 rounded-full hover:bg-blue-400"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="bg-gray-700 p-2 rounded-full hover:bg-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-gray-700 p-2 rounded-full hover:bg-red-600"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4 text-sm">
        &copy; {new Date().getFullYear()} TopNews. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
