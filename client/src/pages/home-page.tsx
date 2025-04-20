import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Banner from "@/components/home/banner";
import CategoryShowcase from "@/components/home/category-showcase";
import ProductGrid from "@/components/product/product-grid";
import SpecialOffer from "@/components/home/special-offer";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";
//import { SearchProvider } from "@/hooks/use-search";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  // Prefetch data for the homepage
  const { refetch: prefetchNewArrivals } = useQuery({
    queryKey: ["/api/products/new-arrivals"],
    enabled: false,
  });

  const { refetch: prefetchFeaturedProducts } = useQuery({
    queryKey: ["/api/products/featured"],
    enabled: false,
  });

  const { refetch: prefetchCategories } = useQuery({
    queryKey: ["/api/categories"],
    enabled: false,
  });

  // Prefetch data on mount
  useEffect(() => {
    prefetchNewArrivals();
    prefetchFeaturedProducts();
    prefetchCategories();
  }, []);

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Banner />
          <CategoryShowcase />
          <ProductGrid
            queryKey="/api/products/new-arrivals"
            title="New Arrivals"
            viewAllUrl="/products"
            columns={4}
            limit={4}
          />
          <SpecialOffer />
          <ProductGrid
            queryKey="/api/products/featured"
            title="Featured Products"
            viewAllUrl="/products?featured=true"
            columns={3}
            limit={3}
          />
          <Testimonials />
          <Newsletter />
        </main>
        <Footer />
      </div>
  );
}
