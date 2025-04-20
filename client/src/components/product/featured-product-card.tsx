import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FeaturedProductCardProps {
  product: Product;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
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
      <Link href={`/products/${product.slug}`} className="flex flex-col md:flex-row">
        <div className="md:w-2/5">
          <img
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="p-4 md:w-3/5">
          <div className="text-sm text-gray-500 mb-1">
            {/* Display category name if available */}
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            {renderStars(product.rating || 0)}
            <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <Button
              onClick={handleAddToCart}
              className="text-white bg-primary hover:bg-primary/90 px-3 py-1 rounded text-sm transition"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
