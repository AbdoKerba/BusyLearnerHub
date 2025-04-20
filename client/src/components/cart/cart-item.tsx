import { CartItem as CartItemType } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateCartItemQuantity } = useCart();

  const incrementQuantity = () => {
    updateCartItemQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.imageUrl || "https://via.placeholder.com/100"}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
        {item.options && Object.keys(item.options).length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {Object.entries(item.options)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <button
              className="px-2 py-1 text-gray-600"
              onClick={decrementQuantity}
            >
              −
            </button>
            <span className="px-2 py-1 text-sm">{item.quantity}</span>
            <button
              className="px-2 py-1 text-gray-600"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              className="ml-4 text-gray-400 hover:text-red-500"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
