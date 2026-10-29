import { Link } from 'react-router-dom'

import logo from '@/assets/logo.jpg'

/** Logo circular de Northland community (Paleto Bay). */
export function BrandLogo({ className = 'size-9' }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Northland community"
      className={`${className} shrink-0 rounded-full border border-line object-cover`}
    />
  )
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Northland community — inicio">
      <BrandLogo />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[0.95rem] font-bold uppercase tracking-[0.08em] text-ink">
            Northland
          </span>
          <span className="block text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink-faint">
            community
          </span>
        </span>
      )}
    </Link>
  )
}
