import { useCart } from "@/hooks/use-cart";
import CartItem from "./cart-item";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartSidebar() {
  const { cartItems, isCartOpen, toggleCartOpen, clearCart, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);
  
  // To prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Calculate subtotal, shipping, and tax
  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const tax = subtotal * 0.09; // 9% tax rate
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleCartOpen}
          />
          
          {/* Cart sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Cart ({cartItems.length})
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={toggleCartOpen}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-6 text-center">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <Button onClick={toggleCartOpen} className="bg-primary text-white">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto p-4">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Shipping</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-sm text-gray-600">Tax</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium mb-6">
                      <span className="text-base text-gray-900">Total</span>
                      <span className="text-base text-gray-900">${total.toFixed(2)}</span>
                    </div>
                    <Link
                      href="/checkout"
                      onClick={toggleCartOpen}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
