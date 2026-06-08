import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import StockMovements from './pages/StockMovements'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Productos', end: false },
  { to: '/movements', label: 'Movimientos', end: false },
]

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex gap-6">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/movements" element={<StockMovements />} />
      </Routes>
    </BrowserRouter>
  )
}
