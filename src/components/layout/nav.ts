import { Car, Home, LayoutDashboard, UserRound, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/personajes', label: 'Personajes', icon: Users },
  { to: '/propiedades', label: 'Propiedades', icon: Home },
  { to: '/vehiculos', label: 'Vehículos', icon: Car },
  { to: '/cuenta', label: 'Cuenta', icon: UserRound },
] as const
