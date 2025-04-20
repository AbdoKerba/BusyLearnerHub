import { useState, useEffect } from "react";
import { useSearch } from "@/hooks/use-search";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

export default function SearchBar() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const [inputValue, setInputValue] = useState("");
  const [, navigate] = useLocation();

  // Initialize input value from search query
  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      navigate(`/products?search=${encodeURIComponent(inputValue.trim())}`);
    } else {
      clearSearch();
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:border-primary focus:bg-white"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
    </form>
  );
}
