export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  category: string;
  rating: number; // 0..5
  ratingCount?: number;
  stock: number;
}


