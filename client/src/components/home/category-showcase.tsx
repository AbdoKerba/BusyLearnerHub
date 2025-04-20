import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryShowcase() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-56 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative">
                <img
                  src={category.imageUrl || "https://via.placeholder.com/300"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
