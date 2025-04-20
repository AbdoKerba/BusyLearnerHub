import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";

// Countdown timer component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const calculateTimeLeft = () => {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const padWithZero = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex space-x-4">
      <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
        <span className="block text-2xl font-bold">{padWithZero(timeLeft.days)}</span>
        <span className="text-xs text-gray-400">Days</span>
      </div>
      <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
        <span className="block text-2xl font-bold">{padWithZero(timeLeft.hours)}</span>
        <span className="text-xs text-gray-400">Hours</span>
      </div>
      <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
        <span className="block text-2xl font-bold">{padWithZero(timeLeft.minutes)}</span>
        <span className="text-xs text-gray-400">Minutes</span>
      </div>
      <div className="bg-gray-700 rounded-lg px-4 py-3 text-center">
        <span className="block text-2xl font-bold">{padWithZero(timeLeft.seconds)}</span>
        <span className="text-xs text-gray-400">Seconds</span>
      </div>
    </div>
  );
}

export default function SpecialOffer() {
  // Set the sale end date to 7 days from now
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 7);
  
  return (
    <section className="py-10 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <span className="inline-block bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-3xl font-bold mb-4">Get 25% Off on All Smart Home Devices</h2>
            <p className="text-gray-300 mb-6">
              Upgrade your home with our cutting-edge smart devices. Offer valid until September 30th.
            </p>
            
            <CountdownTimer targetDate={saleEndDate} />
            
            <Button 
              asChild
              className="mt-6 bg-white text-gray-900 hover:bg-gray-100 font-medium"
            >
              <Link href="/products?category=smart-home&sale=true">Shop The Sale</Link>
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1558089687-f282ffcbc0d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
              alt="Smart Home Devices"
              className="rounded-lg shadow-lg max-w-full"
              width="600"
              height="400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
