import api from './api'
import type { Product, ProductCreate, ProductUpdate } from '../types'

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products')
  return data
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}

export async function createProduct(payload: ProductCreate): Promise<Product> {
  const { data } = await api.post<Product>('/products', payload)
  return data
}

export async function updateProduct(id: number, payload: ProductUpdate): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, payload)
  return data
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`)
}
