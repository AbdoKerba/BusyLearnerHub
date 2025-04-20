import { useState, createContext, useContext, ReactNode } from "react";

interface SearchContextType {
  searchQuery: string | null;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const clearSearch = () => {
    setSearchQuery(null);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  
  return context;
}
