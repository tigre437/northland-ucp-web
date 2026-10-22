import { NavLink } from 'react-router-dom'

import { NAV_ITEMS } from './nav'

/** Navegación inferior fija para móvil (< md). */
export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line-soft bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Secciones"
    >
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, ...rest }) => (
          <NavLink
            key={to}
            to={to}
            end={'end' in rest && rest.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium transition-colors ${
                isActive ? 'text-accent-strong' : 'text-ink-faint'
              }`
            }
          >
            <Icon size={19} strokeWidth={1.9} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
