import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, Category } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { SearchProvider } from "@/hooks/use-search";
import { useSearch } from "@/hooks/use-search";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  SlidersHorizontal, 
  X,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialFeatured = searchParams.get("featured") === "true";
  const initialSale = searchParams.get("sale") === "true";

  // Search context
  const searchContext = useSearch();
  
  useEffect(() => {
    if (initialSearch) {
      searchContext.setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState<string>("latest");
  const [showFeatured, setShowFeatured] = useState<boolean>(initialFeatured);
  const [showSaleItems, setShowSaleItems] = useState<boolean>(initialSale);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const itemsPerPage = 12;

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Build query parameters
  const buildQueryUrl = () => {
    let url = "/api/products?";
    
    const params = new URLSearchParams();
    
    if (searchContext.searchQuery) {
      params.append("search", searchContext.searchQuery);
    }
    
    if (categoryFilter) {
      params.append("category", categoryFilter);
    }
    
    if (showFeatured) {
      params.append("featured", "true");
    }
    
    return `/api/products?${params.toString()}`;
  };

  // Fetch products
  const { 
    data: allProducts, 
    isLoading: isProductsLoading,
    refetch
  } = useQuery<Product[]>({
    queryKey: [buildQueryUrl()],
  });

  // Re-fetch when filters change
  useEffect(() => {
    refetch();
  }, [categoryFilter, searchContext.searchQuery, showFeatured]);

  // Apply client-side filters and sorting
  const filteredProducts = allProducts?.filter(product => {
    // Price range filter
    const isInPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // Sale items filter
    const isSaleItem = showSaleItems 
      ? product.compareAtPrice && product.compareAtPrice > product.price 
      : true;
    
    return isInPriceRange && isSaleItem;
  }) || [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "latest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Paginate products
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, priceRange, sortOption, showFeatured, showSaleItems, searchContext.searchQuery]);

  // Find max price in products for range slider
  const maxProductPrice = allProducts?.reduce((max, product) => 
    product.price > max ? product.price : max, 0) || 1000;

  useEffect(() => {
    setPriceRange([0, maxProductPrice]);
  }, [maxProductPrice]);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Mobile filter toggle */}
              <div className="md:hidden mb-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={toggleMobileFilter}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Sidebar filters - desktop and mobile */}
              <div className={cn(
                "w-full md:w-64 md:block",
                isMobileFilterOpen ? "block" : "hidden"
              )}>
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden"
                      onClick={toggleMobileFilter}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Category filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    {isCategoriesLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-6 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="all-categories" 
                            checked={categoryFilter === ""} 
                            onCheckedChange={() => setCategoryFilter("")}
                          />
                          <label htmlFor="all-categories" className="ml-2 text-sm cursor-pointer">
                            All Categories
                          </label>
                        </div>
                        {categories?.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox 
                              id={`category-${category.id}`} 
                              checked={categoryFilter === category.slug}
                              onCheckedChange={() => setCategoryFilter(category.slug)}
                            />
                            <label 
                              htmlFor={`category-${category.id}`} 
                              className="ml-2 text-sm cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price range filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Price Range</h3>
                    <div className="pt-4 px-2">
                      <Slider
                        defaultValue={[0, maxProductPrice]}
                        value={priceRange}
                        max={maxProductPrice}
                        step={1}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Additional filters */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Product Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox 
                          id="featured" 
                          checked={showFeatured}
                          onCheckedChange={(checked) => setShowFeatured(!!checked)}
                        />
                        <label htmlFor="featured" className="ml-2 text-sm cursor-pointer">
                          Featured Products
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="sale" 
                          checked={showSaleItems}
                          onCheckedChange={(checked) => setShowSaleItems(!!checked)}
                        />
                        <label htmlFor="sale" className="ml-2 text-sm cursor-pointer">
                          On Sale
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Reset filters button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setCategoryFilter("");
                      setPriceRange([0, maxProductPrice]);
                      setShowFeatured(false);
                      setShowSaleItems(false);
                      setSortOption("latest");
                      searchContext.clearSearch();
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>

              {/* Product grid */}
              <div className="flex-1">
                {/* Header with results count and sorting */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold mb-1">
                      {searchContext.searchQuery 
                        ? `Search results for "${searchContext.searchQuery}"` 
                        : categoryFilter 
                          ? `${categories?.find(c => c.slug === categoryFilter)?.name || "Category"} Products`
                          : "All Products"}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"} found
                    </p>
                  </div>
                  <div className="flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products grid */}
                {isProductsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <Skeleton className="h-64 w-full" />
                        <div className="p-4">
                          <Skeleton className="h-4 w-1/4 mb-2" />
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : paginatedProducts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filter criteria.
                    </p>
                    <Button 
                      onClick={() => {
                        setCategoryFilter("");
                        setPriceRange([0, maxProductPrice]);
                        setShowFeatured(false);
                        setShowSaleItems(false);
                        searchContext.clearSearch();
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!isProductsLoading && sortedProducts.length > 0 && totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}
