import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`animate-spin text-accent ${className}`} size={20} aria-label="Cargando" />
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-md bg-card-hover ${className}`} />
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <Spinner className="size-8" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line px-6 py-12 text-center">
      {icon && <div className="mb-3 text-ink-faint">{icon}</div>}
      <p className="font-display font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-ink-dim">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Algo ha fallado',
  description,
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-rust-500/40 bg-rust-500/10 px-6 py-10 text-center">
      <AlertTriangle className="mb-3 text-danger-strong" size={28} />
      <p className="font-display font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-ink-dim">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:bg-card-hover"
        >
          <RefreshCw size={14} /> Reintentar
        </button>
      )}
    </div>
  )
}
