// Tipos globais do projeto

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  createdAt: string;
  sellerId: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
}

export interface User {
  id: string;
  email: string;
  role: "CLIENTE" | "VENDEDOR";
  active: boolean;
  products?: Product[];
}
