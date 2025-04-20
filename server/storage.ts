import { 
  User, 
  InsertUser, 
  Product, 
  InsertProduct, 
  Category, 
  InsertCategory, 
  Order, 
  InsertOrder,
  OrderWithItems 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with any CRUD methods you need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(options?: ProductSearchOptions): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  
  // Order methods
  getOrdersByUserId(userId: number): Promise<OrderWithItems[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(orderId: number, status: string): Promise<Order | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export interface ProductSearchOptions {
  search?: string;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  
  sessionStore: session.SessionStore;
  userIdCounter: number;
  categoryIdCounter: number;
  productIdCounter: number;
  orderIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product methods
  async getProducts(options: ProductSearchOptions = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    // Filter by search term
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by category
    if (options.categorySlug) {
      const category = await this.getCategoryBySlug(options.categorySlug);
      if (category) {
        products = products.filter(product => product.categoryId === category.id);
      } else {
        return []; // If category doesn't exist, return empty array
      }
    }
    
    // Filter by featured
    if (options.featured) {
      products = products.filter(product => product.isFeatured);
    }
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      products = products.slice(0, options.limit);
    }
    
    return products;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      rating: 0,
      numReviews: 0,
      createdAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  async getNewArrivals(limit: number = 4): Promise<Product[]> {
    // Get all products, sort by created date, and limit
    return Array.from(this.products.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async getFeaturedProducts(limit: number = 3): Promise<Product[]> {
    // Get featured products and limit
    return Array.from(this.products.values())
      .filter(product => product.isFeatured)
      .slice(0, limit);
  }
  
  // Order methods
  async getOrdersByUserId(userId: number): Promise<OrderWithItems[]> {
    const orders = Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    // Cast to OrderWithItems since our in-memory implementation already stores full item data
    return orders as unknown as OrderWithItems[];
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const order: Order = { ...insertOrder, id, createdAt: now };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(orderId: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }
  
  private async seedData() {
    // Create admin user
    const adminUser = await this.createUser({
      username: "admin",
      password: "$2b$10$TxTTGQaLX/sNAm8NQxRtB.kdQVEGTi3icy1qdF0FfKOaOTJ3z4o5O", // hashed "admin123"
      email: "admin@example.com",
      fullName: "Admin User"
    });
    
    // Update admin flag
    this.users.set(adminUser.id, { ...adminUser, isAdmin: true });
    
    // Create categories
    const electronics = await this.createCategory({
      name: "Electronics",
      slug: "electronics",
      imageUrl: "https://images.unsplash.com/photo-1661961112835-ca6f5811d2af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
    });
    
    const clothing = await this.createCategory({
      name: "Clothing",
      slug: "clothing",
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
    });
    
    const homeKitchen = await this.createCategory({
      name: "Home & Kitchen",
      slug: "home-kitchen",
      imageUrl: "https://images.unsplash.com/photo-1583845112203-29329902332e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
    });
    
    const beauty = await this.createCategory({
      name: "Beauty",
      slug: "beauty",
      imageUrl: "https://images.unsplash.com/photo-1512418490979-92798cec1380?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
    });
    
    // Create products
    await this.createProduct({
      name: "Smart Watch Series 5",
      slug: "smart-watch-series-5",
      description: "Premium smartwatch with heart rate monitor, GPS, and fitness tracking features.",
      price: 299.99,
      compareAtPrice: 349.99,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80",
      categoryId: electronics.id,
      inStock: true,
      isNew: true,
      isFeatured: false
    });
    
    await this.createProduct({
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Noise-cancelling wireless headphones with 30-hour battery life and premium sound quality.",
      price: 199.99,
      compareAtPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80",
      categoryId: electronics.id,
      inStock: true,
      isNew: true,
      isFeatured: false
    });
    
    await this.createProduct({
      name: "Ultra Boost Running Shoes",
      slug: "ultra-boost-running-shoes",
      description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
      price: 129.99,
      compareAtPrice: 159.99,
      imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80",
      categoryId: clothing.id,
      inStock: true,
      isNew: false,
      isFeatured: false
    });
    
    await this.createProduct({
      name: "Smart Video Doorbell",
      slug: "smart-video-doorbell",
      description: "HD video doorbell with motion detection, two-way audio, and night vision.",
      price: 159.99,
      compareAtPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80",
      categoryId: electronics.id,
      inStock: true,
      isNew: true,
      isFeatured: false
    });
    
    await this.createProduct({
      name: "Professional Coffee Maker",
      slug: "professional-coffee-maker",
      description: "Premium coffee maker with programmable settings and built-in grinder for the perfect brew every time.",
      price: 349.99,
      compareAtPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1585565804112-f201f68c48b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
      categoryId: homeKitchen.id,
      inStock: true,
      isNew: false,
      isFeatured: true
    });
    
    await this.createProduct({
      name: "Wireless Bluetooth Earbuds",
      slug: "wireless-bluetooth-earbuds",
      description: "True wireless earbuds with active noise cancellation and 8-hour battery life for immersive audio experience.",
      price: 129.99,
      compareAtPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
      categoryId: electronics.id,
      inStock: true,
      isNew: false,
      isFeatured: true
    });
    
    await this.createProduct({
      name: "Premium Denim Jacket",
      slug: "premium-denim-jacket",
      description: "Classic denim jacket with premium stitching and comfortable fit, perfect for any casual occasion.",
      price: 89.99,
      compareAtPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
      categoryId: clothing.id,
      inStock: true,
      isNew: false,
      isFeatured: true
    });
  }
}

export const storage = new MemStorage();
