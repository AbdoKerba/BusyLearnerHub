import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  text: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Verified Customer",
    text: "The checkout process was incredibly smooth and my order arrived faster than expected. Definitely will be shopping here again!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60&q=80"
  },
  {
    id: 2,
    name: "Michael Roberts",
    title: "Verified Customer",
    text: "Great selection of products and the quality is amazing. Customer service was excellent when I needed to make a return. 10/10 would recommend.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60&q=80"
  },
  {
    id: 3,
    name: "Emily Chen",
    title: "Verified Customer",
    text: "I've been shopping here for over a year and have never been disappointed. The prices are competitive and the shipping is always reliable.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&h=60&q=80"
  }
];

export default function Testimonials() {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="fill-amber-400 text-amber-400 h-4 w-4" />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="fill-amber-400 text-amber-400 h-4 w-4 fill-[50%]" />
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-amber-400 h-4 w-4" />
      );
    }
    
    return stars;
  };
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-amber-400 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
