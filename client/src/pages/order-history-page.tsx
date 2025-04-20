import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Order } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SearchProvider } from "@/hooks/use-search";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Clock,
  CheckCircle,
  MoreHorizontal,
  ShoppingBag,
  Eye,
  Download,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Order status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800 border-yellow-200";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "processing":
      color = "bg-blue-100 text-blue-800 border-blue-200";
      icon = <RefreshCw className="h-3 w-3 mr-1" />;
      break;
    case "shipped":
      color = "bg-purple-100 text-purple-800 border-purple-200";
      icon = <Package className="h-3 w-3 mr-1" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800 border-green-200";
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800 border-red-200";
      icon = <ClipboardList className="h-3 w-3 mr-1" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200";
  }

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1 font-normal", color)}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch order history
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  // Filter orders based on active tab
  const filteredOrders = orders?.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Format date
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Order History</h1>
                <p className="text-gray-600">View and track your orders</p>
              </div>
              <Button className="mt-4 md:mt-0" asChild>
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-5">
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                      </div>
                    ))}
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              {Array.isArray(order.items)
                                ? order.items.length
                                : JSON.parse(order.items as unknown as string).length}{" "}
                              {Array.isArray(order.items)
                                ? order.items.length === 1
                                  ? "item"
                                  : "items"
                                : JSON.parse(order.items as unknown as string).length === 1
                                ? "item"
                                : "items"}
                            </TableCell>
                            <TableCell className="text-right">
                              ${order.total.toFixed(2)}
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
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Download Invoice</span>
                                  </DropdownMenuItem>
                                  {order.status === "pending" && (
                                    <DropdownMenuItem className="text-red-600">
                                      <ClipboardList className="mr-2 h-4 w-4" />
                                      <span>Cancel Order</span>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details Section - when clicked on an order, this would show */}
            {false && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Order #12345</CardTitle>
                  <CardDescription>Placed on June 12, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        John Doe<br />
                        123 Main St<br />
                        Anytown, CA 12345<br />
                        United States
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Billing Address</h3>
                      <p className="text-sm text-gray-600">
                        Same as shipping address
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600">
                        Visa ending in 4242
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Shipping Method</h3>
                      <p className="text-sm text-gray-600">
                        Standard Shipping<br />
                        Delivered on June 15, 2023
                      </p>
                    </div>
                  </div>

                  <h3 className="font-medium mb-4">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded overflow-hidden mr-3">
                              <img
                                src="https://via.placeholder.com/50"
                                alt="Product"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">Wireless Headphones</p>
                              <p className="text-sm text-gray-500">Black</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">$199.99</TableCell>
                        <TableCell className="text-right">1</TableCell>
                        <TableCell className="text-right">$199.99</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded overflow-hidden mr-3">
                              <img
                                src="https://via.placeholder.com/50"
                                alt="Product"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">Smart Watch Series 5</p>
                              <p className="text-sm text-gray-500">Black</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">$299.99</TableCell>
                        <TableCell className="text-right">1</TableCell>
                        <TableCell className="text-right">$299.99</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="flex justify-end mt-6">
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between py-2">
                        <span>Subtotal</span>
                        <span>$499.98</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Shipping</span>
                        <span>$9.99</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Tax</span>
                        <span>$45.00</span>
                      </div>
                      <div className="flex justify-between py-2 font-bold border-t mt-2 pt-2">
                        <span>Total</span>
                        <span>$554.97</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
  );
}
