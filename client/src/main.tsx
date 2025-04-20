import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "./contexts/cart-context";
import { SearchProvider } from "./hooks/use-search";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <CartProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </CartProvider>
  </ThemeProvider>
);
