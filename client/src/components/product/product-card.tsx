import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "",
      quantity: 1
    });
  };

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= Math.floor(rating)
                ? "fill-current"
                : star <= rating
                ? "fill-current opacity-50"
                : "stroke-current fill-none"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      <Link href={`/products/${product.slug}`} className="block relative">
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
            New
          </span>
        )}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">
            {/* Display category name if available */}
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            {renderStars(product.rating || 0)}
            <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="text-primary hover:bg-primary hover:text-white border border-primary rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
