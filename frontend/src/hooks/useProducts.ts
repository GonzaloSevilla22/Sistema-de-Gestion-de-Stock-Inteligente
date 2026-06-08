import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productApi'
import type { ProductCreate, ProductUpdate } from '../types'

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: getProducts })
}

export function useProduct(id: number) {
  return useQuery({ queryKey: ['products', id], queryFn: () => getProduct(id) })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductCreate) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductUpdate }) =>
      updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}
