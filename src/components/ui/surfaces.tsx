import type { ReactNode } from 'react'

import { ZoomableImage } from './Lightbox'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line-soft bg-card ${className}`}>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="panel-title text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="kicker mb-3">{children}</h2>
}

export function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line-soft bg-card px-4 py-3">
      {icon && <div className="text-accent">{icon}</div>}
      <div className="min-w-0">
        <div className="kicker">{label}</div>
        <div className="mt-0.5 truncate font-display text-lg font-semibold text-ink">{value}</div>
      </div>
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'warm' | 'danger'
}) {
  const tones = {
    neutral: 'border-line bg-card-hover text-ink-dim',
    accent: 'border-accent-deep/50 bg-accent-deep/20 text-accent-strong',
    warm: 'border-brand-600/50 bg-brand-600/15 text-warm-strong',
    danger: 'border-rust-500/50 bg-rust-500/15 text-danger-strong',
  } as const
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function KeyVal({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2 last:border-b-0">
      <dt className="shrink-0 text-sm text-ink-faint">{label}</dt>
      <dd className="min-w-0 text-right text-sm text-ink">{value}</dd>
    </div>
  )
}

export function Avatar({
  url,
  name,
  size = 'md',
}: {
  url: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-16 text-xl' } as const
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (url) {
    return (
      <ZoomableImage
        src={url}
        alt={`Avatar de ${name}`}
        className={`${sizes[size]} rounded-full border border-line object-cover`}
      />
    )
  }
  return (
    <div
      aria-hidden
      className={`${sizes[size]} flex items-center justify-center rounded-full border border-line bg-accent-deep/25 font-display font-semibold text-accent-strong`}
    >
      {initials || '?'}
    </div>
  )
}
