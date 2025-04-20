import { createContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCartOpen: () => void;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shophub-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shophub-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };

        toast({
          title: "Cart updated",
          description: `Updated quantity of ${item.name} in your cart.`,
        });

        return updatedItems;
      } else {
        // Add new item
        toast({
          title: "Item added",
          description: `${item.name} has been added to your cart.`,
        });

        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find((item) => item.id === itemId);
      
      if (removedItem) {
        toast({
          title: "Item removed",
          description: `${removedItem.name} has been removed from your cart.`,
        });
      }
      
      return prevItems.filter((item) => item.id !== itemId);
    });
  };

  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const toggleCartOpen = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        isCartOpen,
        toggleCartOpen,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
