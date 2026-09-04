export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
}

export interface JwtPayloadData {
  sub: string;
  username: string;
  role: Role;
}
