import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, CartItem } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SearchProvider } from "@/hooks/use-search";
import { useCart } from "@/hooks/use-cart";
import ProductGrid from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("description");

  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  // Fetch product category for breadcrumbs
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    enabled: !!product?.categoryId,
  });

  const category = categories?.find((c) => c.id === product?.categoryId);

  // Handle quantity changes
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || "",
        quantity: quantity,
      };
      addToCart(cartItem);
    }
  };

  // Calculate discount percentage if on sale
  const discountPercentage =
    product?.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : 0;

  // Generate stars based on rating
  const renderStars = (rating: number = 0) => {
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

  // Error state
  if (error) {
    return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <p className="text-gray-600 mb-6">
                  Sorry, we couldn't find the product you're looking for.
                </p>
                <Button onClick={() => navigate("/products")}>
                  Back to Products
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                </BreadcrumbItem>

                {category && (
                  <>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/products?category=${category.slug}`}>
                        {category.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}

                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-medium text-gray-900 max-w-[200px] truncate">
                    {isLoading ? <Skeleton className="h-4 w-32" /> : product?.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>

            {/* Product details section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product image */}
                <div>
                  {isLoading ? (
                    <Skeleton className="aspect-square rounded-lg" />
                  ) : (
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product?.imageUrl || "https://via.placeholder.com/500"}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex flex-col">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-20 mr-2" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {product?.name}
                      </h1>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {renderStars(product?.rating || 0)}
                          <span className="text-sm text-gray-500 ml-2">
                            ({product?.numReviews || 0} reviews)
                          </span>
                        </div>
                        {product?.isNew && (
                          <span className="ml-4 bg-primary text-white text-xs px-2 py-1 rounded">
                            New
                          </span>
                        )}
                        {discountPercentage > 0 && (
                          <span className="ml-2 bg-secondary text-white text-xs px-2 py-1 rounded">
                            {discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product?.price.toFixed(2)}
                        </span>
                        {product?.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-lg text-gray-500 line-through ml-2">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-8">
                        {product?.description}
                      </p>
                      
                      <div className="flex items-center mb-6">
                        <span className="text-gray-700 mr-4">Quantity:</span>
                        <div className="flex items-center border rounded-md">
                          <button
                            className="px-3 py-1 text-gray-600"
                            onClick={decrementQuantity}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1 text-sm">{quantity}</span>
                          <button
                            className="px-3 py-1 text-gray-600"
                            onClick={incrementQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="ml-4 text-sm text-gray-500">
                          {product?.inStock ? (
                            <span className="text-green-600">In Stock</span>
                          ) : (
                            <span className="text-red-600">Out of Stock</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
                        <Button
                          className="flex items-center justify-center"
                          size="lg"
                          onClick={handleAddToCart}
                          disabled={!product?.inStock}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="flex items-center justify-center"
                          size="lg"
                        >
                          <Heart className="h-5 w-5 mr-2" />
                          Add to Wishlist
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Truck className="h-4 w-4 mr-2 text-primary" />
                          <span>Free shipping over $50</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                          <span>2-year warranty</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <RefreshCw className="h-4 w-4 mr-2 text-primary" />
                          <span>30-day returns</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <span className="text-gray-600 text-sm mr-4">Share:</span>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-blue-600 transition">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product details tabs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full justify-start border-b pb-0">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="pt-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <p className="mb-4">{product?.description}</p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <ul className="list-disc pl-5 mt-4">
                        <li>High-quality materials</li>
                        <li>Designed for durability</li>
                        <li>Easy to use and maintain</li>
                        <li>Versatile and practical</li>
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="specifications" className="pt-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">ShopHub</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Model</span>
                        <span className="font-medium">SH-{product?.id || "X123"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-medium">0.5 kg</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Dimensions</span>
                        <span className="font-medium">25 × 10 × 5 cm</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Color</span>
                        <span className="font-medium">Black</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Material</span>
                        <span className="font-medium">Premium</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Warranty</span>
                        <span className="font-medium">2 Years</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Origin</span>
                        <span className="font-medium">United States</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="pt-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((item) => (
                        <div key={item} className="border-b pb-4 mb-4">
                          <div className="flex items-center mb-2">
                            <Skeleton className="h-10 w-10 rounded-full mr-3" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                        <div className="flex items-center mb-4">
                          <div className="mr-4">
                            <span className="text-3xl font-bold">{product?.rating || 0}</span>
                            <span className="text-gray-500">/5</span>
                          </div>
                          <div>
                            {renderStars(product?.rating || 0)}
                            <p className="text-sm text-gray-500">
                              Based on {product?.numReviews || 0} reviews
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {product?.numReviews === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">There are no reviews yet.</p>
                          <Button>Be the first to write a review</Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Sample reviews - in a real app these would come from the API */}
                          <div className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                              <div>
                                <h4 className="font-medium">Sarah J.</h4>
                                <p className="text-sm text-gray-500">Verified Purchase</p>
                              </div>
                            </div>
                            <div className="flex items-center mb-2">
                              {renderStars(5)}
                              <span className="text-sm text-gray-500 ml-2">1 month ago</span>
                            </div>
                            <p className="text-gray-600">
                              Really happy with this purchase! The quality is excellent and it
                              arrived quickly. Would definitely recommend to others.
                            </p>
                          </div>
                          
                          <div className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                              <div>
                                <h4 className="font-medium">Michael R.</h4>
                                <p className="text-sm text-gray-500">Verified Purchase</p>
                              </div>
                            </div>
                            <div className="flex items-center mb-2">
                              {renderStars(4)}
                              <span className="text-sm text-gray-500 ml-2">2 months ago</span>
                            </div>
                            <p className="text-gray-600">
                              Good product for the price. Delivery was fast and the packaging was
                              secure. Four stars because there were a few minor imperfections, but
                              overall I'm satisfied.
                            </p>
                          </div>
                          
                          <Button variant="outline" className="mt-4">
                            Load More Reviews
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Related products */}
            <ProductGrid
              queryKey={`/api/products?category=${category?.slug}&limit=4`}
              title="You May Also Like"
              columns={4}
              limit={4}
            />
          </div>
        </main>
        <Footer />
      </div>
  );
}
