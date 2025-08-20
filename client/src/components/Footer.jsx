// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaPhone } from "react-icons/fa";
import { SiX, SiGmail } from "react-icons/si"; // ✅ X (Twitter) & Gmail
import devImage from "../assets/3.jpg"; // ✅ Developer image

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      {/* Top Section */}
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Logo & Description */}
        <div>
          <h2 className="text-3xl font-bold tracking-wide">TopNews</h2>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Stay informed with the latest updates, breaking news, and in-depth
            articles from around the world. Your trusted source for daily
            stories.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/categories" className="hover:text-white transition">Categories</a></li>
            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Social & Contact Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-700 p-3 rounded-full hover:bg-blue-600 transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a 
              href="https://x.com/vainqueur117" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-700 p-3 rounded-full hover:bg-black transition"
            >
              <SiX size={18} />
            </a>
            <a 
              href="https://www.instagram.com/vainqueuruten/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-700 p-3 rounded-full hover:bg-pink-500 transition"
            >
              <FaInstagram size={18} />
            </a>
            <a 
              href="https://www.youtube.com/@U.Vainqueur" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-700 p-3 rounded-full hover:bg-red-600 transition"
            >
              <FaYoutube size={18} />
            </a>
            <a 
              href="tel:+250795251475" 
              className="bg-gray-700 p-3 rounded-full hover:bg-green-600 transition"
            >
              <FaPhone size={18} />
            </a>
            <a 
              href="mailto:vainqueur117@gmail.com" 
              className="bg-gray-700 p-3 rounded-full hover:bg-orange-500 transition"
            >
              <SiGmail size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Developer & Contact Line */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-300">
          {/* Dev Info */}
          <div className="flex items-center gap-4">
            <img
              src={devImage}
              alt="Developer"
              className="w-14 h-14 object-cover rounded-full border-2 border-gray-600 shadow-md"
            />
            <div>
              <p className="font-semibold text-lg">Uwumuremyi Vainqueur</p>
              <p className="text-sm text-gray-400">Fullstack Developer</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>📍 Kigali, Rwanda</p>
            <p>📧 <a href="mailto:vainqueur117@gmail.com" className="hover:text-white">vainqueur117@gmail.com</a></p>
            <p>📞 <a href="tel:+250795251475" className="hover:text-white">+250 795 251 475</a></p>
          </div>
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
