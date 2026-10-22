import { NavLink } from 'react-router-dom'

import { isDemo } from '@/config/env'
import { useServerInfo } from '@/hooks/api'

import { BrandMark } from './BrandMark'
import { useNavItems } from './nav'

export function Sidebar() {
  const { data: server } = useServerInfo()
  const navItems = useNavItems()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line-soft bg-panel md:flex">
      <div className="border-b border-line-soft px-5 py-5">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Secciones">
        {navItems.map(({ to, label, icon: Icon, ...rest }) => (
          <NavLink
            key={to}
            to={to}
            end={'end' in rest && rest.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-deep/25 text-accent-strong'
                  : 'text-ink-dim hover:bg-card-hover hover:text-ink'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.9} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line-soft px-5 py-4">
        {isDemo && (
          <p className="mb-2 rounded border border-brand-600/50 bg-brand-600/10 px-2 py-1 text-center text-[0.65rem] font-semibold uppercase tracking-widest text-warm-strong">
            Modo demo
          </p>
        )}
        <p className="kicker">Servidor</p>
        <p className="mt-1 truncate text-sm text-ink-dim">{server?.name ?? 'Northland community'}</p>
      </div>
    </aside>
  )
}
