import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useNavItems } from './nav'

/** Navegación inferior fija para móvil (< md). Las 4 primeras secciones
 * van en la barra; el resto se abre desde «Más». */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const navItems = useNavItems()

  const primary = navItems.slice(0, 4)
  const secondary = navItems.slice(4)

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <nav
            className="absolute inset-x-0 bottom-0 rounded-t-xl border-t border-line-soft bg-panel p-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
            aria-label="Más secciones"
          >
            <div className="mb-1 flex items-center justify-between px-2 py-1">
              <span className="kicker">Secciones</span>
              <button
                type="button"
                aria-label="Cerrar"
                className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-card-hover hover:text-ink"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            {secondary.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-accent-deep/20 text-accent-strong' : 'text-ink-dim hover:bg-card-hover'
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.9} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line-soft bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Secciones"
      >
        <div className="grid grid-cols-5">
          {primary.map(({ to, label, icon: Icon, ...rest }) => (
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
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium text-ink-faint transition-colors"
          >
            <Menu size={19} strokeWidth={1.9} />
            Más
          </button>
        </div>
      </nav>
    </>
  )
}
