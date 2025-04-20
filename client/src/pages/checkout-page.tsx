import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddress } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SearchProvider } from "@/hooks/use-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Truck, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

// Stripe setup
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Shipping address schema
const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  saveAddress: z.boolean().optional(),
});

type ShippingFormValues = z.infer<typeof shippingAddressSchema>;

// Checkout steps
type CheckoutStep = "shipping" | "payment" | "confirmation";

// Shipping methods
const shippingMethods = [
  { id: "standard", name: "Standard", price: 9.99, days: "3-5" },
  { id: "express", name: "Express", price: 19.99, days: "1-2" },
  { id: "free", name: "Free Shipping", price: 0, days: "5-7", minAmount: 100 }
];

// Payment form component
function PaymentForm({ clientSecret, shippingAddress }: { clientSecret: string, shippingAddress: ShippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment error",
        description: "Stripe has not been properly initialized",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/order-history",
        payment_method_data: {
          billing_details: {
            name: shippingAddress.fullName,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing",
        variant: "destructive",
      });
      setIsSubmitting(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      // Clear cart and redirect to confirmation
      clearCart();
      navigate("/order-history");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox id="save-payment" />
        <label htmlFor="save-payment" className="text-sm text-gray-600">
          Save this payment method for future purchases
        </label>
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          disabled={!stripe || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...
            </>
          ) : (
            "Complete Order"
          )}
        </Button>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingMethod, setShippingMethod] = useState<string>("standard");

  // Form for shipping address
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      saveAddress: false,
    },
  });

  // Check if cart is empty and redirect to products
  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add products to your cart before checkout",
      });
      navigate("/products");
    }
  }, [cartItems.length]);

  // Calculate order totals
  const selectedShippingMethod = shippingMethods.find(method => method.id === shippingMethod) || shippingMethods[0];
  const subtotal = cartTotal;
  const shippingCost = (subtotal >= 100 && selectedShippingMethod.id === "free") 
    ? 0 
    : selectedShippingMethod.price;
  const tax = subtotal * 0.09; // 9% tax
  const total = subtotal + shippingCost + tax;

  // Handle shipping form submission
  const onShippingSubmit = async (data: ShippingFormValues) => {
    const { saveAddress, ...addressData } = data;
    setShippingAddress(addressData);

    // Create payment intent
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: total,
        shippingAddress: addressData,
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setCurrentStep("payment");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create the stripe options with the client secret
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main checkout flow */}
              <div className="lg:col-span-2">
                <Tabs value={currentStep} className="w-full" onValueChange={(value) => setCurrentStep(value as CheckoutStep)}>
                  <TabsList className="w-full grid grid-cols-3 mb-6">
                    <TabsTrigger value="shipping" disabled={currentStep !== "shipping"}>
                      1. Shipping
                    </TabsTrigger>
                    <TabsTrigger value="payment" disabled={currentStep !== "payment" && currentStep !== "confirmation"}>
                      2. Payment
                    </TabsTrigger>
                    <TabsTrigger value="confirmation" disabled={currentStep !== "confirmation"}>
                      3. Confirmation
                    </TabsTrigger>
                  </TabsList>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Shipping step */}
                    <TabsContent value="shipping">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle>Shipping Information</CardTitle>
                        <CardDescription>
                          Enter your shipping address where you want your order to be delivered.
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="px-0 pb-0">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onShippingSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123 Main St" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Anytown" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State / Province</FormLabel>
                                    <FormControl>
                                      <Input placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="12345" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="CA">Canada</SelectItem>
                                        <SelectItem value="UK">United Kingdom</SelectItem>
                                        <SelectItem value="AU">Australia</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="saveAddress"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Save this address for future orders
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <div className="pt-4">
                              <Separator className="mb-6" />
                              <div className="space-y-4">
                                <h3 className="font-medium text-lg">Shipping Method</h3>
                                <RadioGroup defaultValue="standard" value={shippingMethod} onValueChange={setShippingMethod}>
                                  {shippingMethods.map((method) => (
                                    <div key={method.id} className="flex items-center space-x-2 border p-4 rounded-md">
                                      <RadioGroupItem value={method.id} id={method.id} />
                                      <label htmlFor={method.id} className="flex flex-1 justify-between cursor-pointer">
                                        <div className="flex items-center">
                                          <Truck className="mr-2 h-5 w-5 text-primary" />
                                          <div>
                                            <span className="font-medium">{method.name}</span>
                                            <p className="text-sm text-gray-500">
                                              {method.days} business days
                                              {method.minAmount && ` (free on orders over $${method.minAmount})`}
                                            </p>
                                          </div>
                                        </div>
                                        <span className="font-medium">
                                          {method.price === 0 
                                            ? "Free" 
                                            : `$${method.price.toFixed(2)}`}
                                        </span>
                                      </label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                            </div>
                            
                            <div className="pt-6 flex justify-between">
                              <Button variant="outline" type="button" onClick={() => navigate("/cart")}>
                                Back to Cart
                              </Button>
                              <Button type="submit">
                                Continue to Payment
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </TabsContent>

                    {/* Payment step */}
                    <TabsContent value="payment">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle>Payment Information</CardTitle>
                        <CardDescription>
                          Complete your purchase by providing your payment details.
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="px-0 pb-0">
                        {clientSecret ? (
                          <Elements stripe={stripePromise} options={stripeOptions}>
                            <PaymentForm clientSecret={clientSecret} shippingAddress={shippingAddress} />
                          </Elements>
                        ) : (
                          <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                        
                        <div className="pt-6 flex justify-between">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setCurrentStep("shipping")}
                          >
                            Back to Shipping
                          </Button>
                        </div>
                      </CardContent>
                    </TabsContent>

                    {/* Confirmation step - would normally be shown after payment */}
                    <TabsContent value="confirmation">
                      <div className="flex flex-col items-center py-10 text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                        <p className="text-gray-600 mb-6">
                          Thank you for your purchase. Your order has been received and will be
                          processed shortly.
                        </p>
                        <p className="text-gray-600 mb-8">
                          A confirmation email has been sent to your email address.
                        </p>
                        <Button onClick={() => navigate("/order-history")}>
                          View Order History
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Order summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order items */}
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded overflow-hidden mr-3">
                                <img
                                  src={item.imageUrl || "https://via.placeholder.com/100"}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Totals */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">
                            {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (9%)</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security information */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Secure Checkout</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Your payment information is encrypted and secure. We never store your
                    full credit card details.
                  </p>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">We accept major credit cards and PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}
