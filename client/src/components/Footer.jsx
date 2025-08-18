// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import devImage from "../assets/3.jpg"; // ✅ Import image from assets

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      {/* Top Section */}
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-10 text-center md:text-left">
        
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
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/categories" className="hover:text-white">Categories</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-blue-600"><FaFacebookF /></a>
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-blue-400"><FaTwitter /></a>
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-pink-500"><FaInstagram /></a>
            <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-red-600"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Developer & Contact Line */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-4 text-gray-300">
          <span className="font-semibold">Fullstack Developer : Uwumuremyi Vainqeur</span>
          <img
            src={devImage}
            alt="Developer"
            className="w-20 h-20 object-cover rounded-full border-2 border-gray-600"
          />
          <span className="text-gray-400">📞 0795251475</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-500 border-t border-gray-700 py-4 text-sm">
        &copy; {new Date().getFullYear()} TopNews. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
