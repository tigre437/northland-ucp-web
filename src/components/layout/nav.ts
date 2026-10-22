import {
  Activity,
  BadgeCheck,
  Car,
  Home,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Store,
  UserRound,
  Users,
} from 'lucide-react'

import { useMe } from '@/hooks/api'

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

export const STAFF_ITEM = { to: '/staff', label: 'Staff', icon: ShieldCheck } as const

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }

/** NAV_ITEMS + enlace al panel de staff cuando /auth/me lo confirma. */
export function useNavItems(): readonly NavItem[] {
  const { data: me } = useMe()
  return me?.staff ? [...NAV_ITEMS, STAFF_ITEM] : NAV_ITEMS
}
