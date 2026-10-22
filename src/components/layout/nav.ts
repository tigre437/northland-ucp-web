import {
  Activity,
  BadgeCheck,
  Car,
  Home,
  LayoutDashboard,
  ReceiptText,
  Store,
  UserRound,
  Users,
} from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/personajes', label: 'Personajes', icon: Users },
  { to: '/propiedades', label: 'Propiedades', icon: Home },
  { to: '/vehiculos', label: 'Vehículos', icon: Car },
  { to: '/economia', label: 'Economía', icon: ReceiptText },
  { to: '/documentos', label: 'Documentos', icon: BadgeCheck },
  { to: '/negocios', label: 'Negocios', icon: Store },
  { to: '/actividad', label: 'Actividad', icon: Activity },
  { to: '/cuenta', label: 'Cuenta', icon: UserRound },
] as const
