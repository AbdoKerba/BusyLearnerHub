import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import SearchBar from "@/components/search/search-bar";
import CartSidebar from "@/components/cart/cart-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Heart, ChevronDown, User, LogOut, Package, ShoppingBag } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartItems, toggleCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const cartItemCount = cartItems.length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">ShopHub</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products/favorites" className="text-gray-600 hover:text-primary transition">
              <Heart className="h-5 w-5" />
            </Link>

            <div className="relative">
              <button
                onClick={toggleCartOpen}
                className="text-gray-600 hover:text-primary transition"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-primary transition">
                  <span className="mr-1">{user ? user.username : "Account"}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2">
                  {user ? (
                    <>
                      <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/order-history" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/products" className="cursor-pointer">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Manage Products</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/auth" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Login / Register</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
            <button
              onClick={toggleCartOpen}
              className="ml-4 text-gray-600 hover:text-primary relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className={`block px-3 py-2 rounded text-sm font-medium ${
                location === "/" ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`block px-3 py-2 rounded text-sm font-medium ${
                location === "/products" ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              Products
            </Link>
            {user ? (
              <>
                <Link
                  href="/order-history"
                  className={`block px-3 py-2 rounded text-sm font-medium ${
                    location === "/order-history" ? "text-primary" : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    href="/admin/products"
                    className={`block px-3 py-2 rounded text-sm font-medium ${
                      location === "/admin/products" ? "text-primary" : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    Manage Products
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className={`block px-3 py-2 rounded text-sm font-medium ${
                  location === "/auth" ? "text-primary" : "text-gray-700 hover:text-primary"
                }`}
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Categories Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-3 space-x-6 text-gray-600 whitespace-nowrap">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition">
              New Arrivals
            </Link>
            <Link href="/products?category=electronics" className="text-sm font-medium hover:text-primary transition">
              Electronics
            </Link>
            <Link href="/products?category=clothing" className="text-sm font-medium hover:text-primary transition">
              Clothing
            </Link>
            <Link href="/products?category=home-kitchen" className="text-sm font-medium hover:text-primary transition">
              Home & Kitchen
            </Link>
            <Link href="/products?category=beauty" className="text-sm font-medium hover:text-primary transition">
              Beauty
            </Link>
            <Link href="/products?category=sports" className="text-sm font-medium hover:text-primary transition">
              Sports
            </Link>
            <Link href="/products?category=books" className="text-sm font-medium hover:text-primary transition">
              Books
            </Link>
            <Link href="/products?sale=true" className="text-sm font-medium hover:text-primary transition">
              Sale
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  );
}
