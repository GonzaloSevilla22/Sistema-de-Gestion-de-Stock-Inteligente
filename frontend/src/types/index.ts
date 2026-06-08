export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  minimum_stock: number
  category: string | null
  created_at: string
  alert_status: 'normal' | 'low' | 'out_of_stock'
}

export interface ProductCreate {
  name: string
  description?: string
  price: number
  stock: number
  minimum_stock: number
  category?: string
}

export interface ProductUpdate {
  name?: string
  description?: string
  price?: number
  stock?: number
  minimum_stock?: number
  category?: string
}

export interface StockMovement {
  id: number
  product_id: number
  type: 'ENTRADA' | 'SALIDA'
  quantity: number
  date: string
  observation: string | null
}

export interface MovementCreate {
  product_id: number
  type: 'ENTRADA' | 'SALIDA'
  quantity: number
  observation?: string
}

export interface DashboardKPIs {
  total_products: number
  low_stock_count: number
  out_of_stock_count: number
}
