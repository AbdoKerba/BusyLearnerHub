import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Product, insertProductSchema } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SearchProvider } from "@/hooks/use-search";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { Redirect } from "wouter";

// Extended product schema for the form
const productFormSchema = insertProductSchema.extend({
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  categoryId: z.coerce.number(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AdminProductsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Fetch products
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch categories for the form select
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Form for adding/editing product
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      compareAtPrice: null,
      imageUrl: "",
      categoryId: 0,
      inStock: true,
      isNew: false,
      isFeatured: false,
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/products", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      });
      setIsAddDialogOpen(false);
      refetchProducts();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    // Auto-generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // If compareAtPrice is empty or 0, set it to null
    if (!data.compareAtPrice) {
      data.compareAtPrice = null;
    }

    createProductMutation.mutate(data);
  };

  // Filter products based on search query
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle dialog open/close and form reset
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        compareAtPrice: product.compareAtPrice || null,
        imageUrl: product.imageUrl || "",
        categoryId: product.categoryId || 0,
        inStock: product.inStock,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
      });
    } else {
      setCurrentProduct(null);
      form.reset({
        name: "",
        slug: "",
        description: "",
        price: 0,
        compareAtPrice: null,
        imageUrl: "",
        categoryId: 0,
        inStock: true,
        isNew: false,
        isFeatured: false,
      });
    }
    setIsAddDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setCurrentProduct(null);
  };

  // Handle delete product (this would typically be a DELETE API call)
  const handleDeleteProduct = (id: number) => {
    toast({
      title: "Feature not implemented",
      description: "Product deletion is not implemented in this demo.",
      variant: "destructive",
    });
  };

  // If not an admin, redirect to home
  if (!isAuthLoading && user && !user.isAdmin) {
    return <Redirect to="/" />;
  }

  // If not logged in, redirect to auth page
  if (!isAuthLoading && !user) {
    return <Redirect to="/auth" />;
  }

  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Product Management</h1>
                <p className="text-gray-600">Add, edit, or remove products</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 min-w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {isProductsLoading ? (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredProducts?.length === 0 ? (
                <div className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery
                      ? `No products matching "${searchQuery}"`
                      : "You haven't added any products yet."}
                  </p>
                  <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Featured</TableHead>
                        <TableHead className="text-center">New</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                  <X className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            ${product.price.toFixed(2)}
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${product.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {categories?.find((c) => c.id === product.categoryId)?.name || "-"}
                          </TableCell>
                          <TableCell>
                            {product.inStock ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {product.isFeatured ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {product.isNew ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOpenDialog(product)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Add/Edit Product Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {currentProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                  <DialogDescription>
                    {currentProduct
                      ? "Update the product details below."
                      : "Fill in the product details below."}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter product name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="product-slug (auto-generated if empty)"
                              />
                            </FormControl>
                            <FormDescription>
                              Used in the product URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter product description"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="compareAtPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compare at Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={field.value === null ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Original price for sale items
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <FormDescription>
                            Enter a URL for the product image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>In Stock</FormLabel>
                              <FormDescription>
                                Is this product available?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isNew"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>New Product</FormLabel>
                              <FormDescription>
                                Mark as a new arrival
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                            <div>
                              <FormLabel>Featured</FormLabel>
                              <FormDescription>
                                Show in featured products
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseDialog}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createProductMutation.isPending}
                      >
                        {createProductMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {currentProduct ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          currentProduct ? "Update Product" : "Create Product"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}
