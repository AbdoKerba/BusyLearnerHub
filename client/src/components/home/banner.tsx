import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Banner() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Summer Sale</h1>
            <p className="text-lg mb-4">Get up to 50% off on selected items</p>
            <Button
              asChild
              className="bg-white text-primary hover:bg-gray-100 font-medium"
            >
              <Link href="/products?sale=true">Shop Now</Link>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <img
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80"
              alt="Summer Sale promotion"
              className="w-full max-w-sm rounded-lg shadow-lg"
              width="400"
              height="300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
