import { LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { api } from '@/api'
import { isDemo } from '@/config/env'
import { useMe } from '@/hooks/api'

import { Avatar } from '../ui/surfaces'
import { BrandMark } from './BrandMark'

export function TopBar() {
  const { data: me } = useMe()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const displayName = me?.discord.globalName ?? me?.discord.username ?? '…'

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await api.logout()
    } finally {
      queryClient.clear()
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line-soft bg-panel/90 px-4 backdrop-blur md:pl-6">
      <div className="md:hidden">
        <BrandMark />
      </div>
      <div className="hidden items-center gap-3 md:flex">
        {isDemo && (
          <span className="rounded border border-brand-600/50 bg-brand-600/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-warm-strong">
            Demo
          </span>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex items-center gap-2.5 rounded-full border border-line-soft bg-card py-1 pl-1 pr-3 transition-colors hover:bg-card-hover"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <Avatar url={me?.discord.avatarUrl ?? null} name={displayName} size="sm" />
          <span className="max-w-32 truncate text-sm font-medium text-ink">{displayName}</span>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1.5 w-52 overflow-hidden rounded-lg border border-line bg-card shadow-lg shadow-black/30"
          >
            <div className="border-b border-line-soft px-4 py-3">
              <p className="truncate text-sm font-medium text-ink">{displayName}</p>
              {me && <p className="truncate text-xs text-ink-faint">@{me.discord.username}</p>}
            </div>
            <Link
              to="/cuenta"
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-dim transition-colors hover:bg-card-hover hover:text-ink"
              onClick={() => setOpen(false)}
            >
              <UserRound size={15} /> Mi cuenta
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-danger-strong transition-colors hover:bg-card-hover disabled:opacity-50"
            >
              <LogOut size={15} /> {loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
