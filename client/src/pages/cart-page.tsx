import { useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SearchProvider } from "@/hooks/use-search";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal } = useCart();

  // Close the cart sidebar if open when navigating to this page
  useEffect(() => {
    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar && !cartSidebar.classList.contains("translate-x-full")) {
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
    }
  }, []);

  // Handler for quantity changes
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(itemId, newQuantity);
  };

  // Calculate total values
  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const tax = subtotal * 0.09; // 9% tax rate
  const total = subtotal + shipping + tax;

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <Card className="text-center py-10">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">
                      Looks like you haven't added any products to your cart yet.
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart items */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cartItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src={item.imageUrl || "https://via.placeholder.com/100"}
                                        alt={item.name}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <Link
                                        href={`/products/${item.id}`}
                                        className="font-medium text-gray-900 hover:text-primary"
                                      >
                                        {item.name}
                                      </Link>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  ${item.price.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center border rounded-md w-32">
                                    <button
                                      className="px-2 py-1 text-gray-600"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          Math.max(1, item.quantity - 1)
                                        )
                                      }
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 py-1 text-sm flex-1 text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      className="px-2 py-1 text-gray-600"
                                      onClick={() =>
                                        handleQuantityChange(item.id, item.quantity + 1)
                                      }
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <Link href="/products">Continue Shopping</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Order summary */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (9%)</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href="/checkout">
                          Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Promo code section */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Promo Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button variant="outline">Apply</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
  );
}
