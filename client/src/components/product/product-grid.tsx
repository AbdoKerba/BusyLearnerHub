import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  queryKey: string;
  title?: string;
  viewAllUrl?: string;
  columns?: number;
  limit?: number;
}

export default function ProductGrid({
  queryKey,
  title,
  viewAllUrl,
  columns = 4,
  limit = 4
}: ProductGridProps) {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [queryKey],
  });

  // Create grid columns class based on prop
  const getColumnClass = () => {
    switch (columns) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
      default:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            {viewAllUrl && <Skeleton className="h-4 w-16" />}
          </div>
        )}
        <div className={`grid ${getColumnClass()} gap-4 md:gap-6`}>
          {Array(limit).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="w-full h-64" />
              <div className="p-4">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-5 w-44 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {viewAllUrl && (
            <a href={viewAllUrl} className="text-primary hover:underline text-sm font-medium">
              View All
            </a>
          )}
        </div>
      )}
      <div className={`grid ${getColumnClass()} gap-4 md:gap-6`}>
        {products.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
