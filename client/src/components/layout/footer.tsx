import { Link } from "wouter";
import { Facebook, Twitter, Instagram, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold text-white">ShopHub</span>
            </div>
            <p className="text-sm mb-4">Your one-stop shop for quality products at affordable prices.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link href="/products?sort=bestselling" className="hover:text-white transition">Best Sellers</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-white transition">Deals & Promotions</Link></li>
              <li><Link href="/products" className="hover:text-white transition">All Categories</Link></li>
              <li><Link href="/gift-cards" className="hover:text-white transition">Gift Cards</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition">Press</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 32 21" className="h-4">
                  <path fill="#3C58BF" d="M0,0h32v21H0z"/>
                  <path fill="#293688" d="M13.1,7.2h5.8l-1.3,6.9h-3.7L13.1,7.2z M26.4,7.2v6.9h3.2V7.2H26.4z"/>
                  <path fill="#FFBC00" d="M8.3,7.2H2.7l0,0.2c4.1,1,6.8,3.4,7.9,6.7h2.3l-4.6-6.9L8.3,7.2z"/>
                </svg>
              </div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 32 26" className="h-4">
                  <path fill="#FF5F00" d="M12,8.1h8v9.8h-8z"/>
                  <path fill="#EB001B" d="M12.5,13c0-2,0.9-3.8,2.4-5C14,7.4,13,7,11.8,7C8.8,7,6.4,9.7,6.4,13c0,3.3,2.4,6,5.4,6c1.2,0,2.2-0.4,3.1-1C13.4,16.8,12.5,15,12.5,13"/>
                  <path fill="#F79E1B" d="M25.6,13c0,3.3-2.4,6-5.4,6c-1.2,0-2.2-0.4-3.1-1c1.5-1.2,2.4-3,2.4-5c0-2-0.9-3.8-2.4-5c0.9-0.6,1.9-1,3.1-1C23.2,7,25.6,9.7,25.6,13"/>
                </svg>
              </div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 32 26" className="h-4">
                  <path fill="#253B80" d="M9.5,7.2C8.9,7.8,8.7,8.6,8.7,9.6c0,1.9,1,3.2,3.2,3.2h0.9l0.2,0.9c0,0.1,0.2,0.2,0.3,0.2h1.9c0.1,0,0.3-0.1,0.3-0.3l1-6.1c0-0.1-0.1-0.2-0.2-0.2h-3C10.9,7.2,10.1,7.2,9.5,7.2"/>
                  <path fill="#179BD7" d="M22.3,7.2h-3c-0.1,0-0.2,0.1-0.3,0.2l-1.6,10.1c0,0.1,0.1,0.2,0.2,0.2h1.6c0.1,0,0.3-0.1,0.3-0.3l0.4-2.6c0-0.2,0.2-0.3,0.3-0.3h0.9c2,0,3.5-1,3.8-3c0.1-0.9,0-1.6-0.4-2.1C23.9,7.7,23.2,7.2,22.3,7.2"/>
                </svg>
              </div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 32 26" className="h-4">
                  <path fill="#000000" d="M20.7,12.9c0,0.5-0.4,1.3-1,1.3c-0.5,0-0.8-0.4-0.8-1c0-0.5,0.4-1.3,1-1.3C20.4,12,20.7,12.4,20.7,12.9z M15.2,14.5l-0.2,1.4h1.4l0.2-1.4H15.2z M24,10.8c-0.4-0.4-1.1-0.6-2-0.6h-2.9l-0.7,4.3h0.8c1.3,0,2.2-0.2,2.7-0.7c0.5-0.4,0.9-1.1,1.1-2C24.3,11.8,24.3,11.2,24,10.8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
