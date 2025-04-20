import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url")
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  imageUrl: true,
});

// Products schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  compareAtPrice: doublePrecision("compare_at_price"),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").references(() => categories.id),
  inStock: boolean("in_stock").default(true).notNull(),
  rating: doublePrecision("rating").default(0),
  numReviews: integer("num_reviews").default(0),
  isNew: boolean("is_new").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  compareAtPrice: true,
  imageUrl: true,
  categoryId: true,
  inStock: true,
  isNew: true,
  isFeatured: true,
});

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  items: jsonb("items").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status").default("pending").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  items: true,
  total: true,
  status: true,
  shippingAddress: true,
  paymentIntentId: true,
});

// Cart item definition for type purposes
export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  options?: Record<string, string>;
}

// Order with items definition
export interface OrderWithItems {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: string;
  shippingAddress: ShippingAddress;
  paymentIntentId?: string;
  createdAt: Date;
}

// Shipping address interface
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
