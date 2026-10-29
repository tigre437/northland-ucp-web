import { AlertTriangle, Loader2, RefreshCw, ServerOff } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

import { BrandLogo } from '@/components/layout/BrandMark'

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

/**
 * Página completa de «servicio caído»: la API no responde (túnel
 * cerrado, backend apagado, despliegue en curso). Reintenta sola
 * cada 20 s y ofrece reintento manual — el mensaje deja claro que
 * el fallo es nuestro, no del usuario.
 */
export function ServiceUnavailable({ onRetry }: { onRetry?: () => void }) {
  useEffect(() => {
    const t = setInterval(() => onRetry?.(), 20_000)
    return () => clearInterval(t)
  }, [onRetry])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-base px-4 py-10">
      <div className="w-full max-w-md text-center">
        <BrandLogo className="mx-auto mb-4 size-16" />
        <h1 className="font-display text-xl font-bold uppercase tracking-[0.08em] text-ink">
          Northland community
        </h1>
        <div className="mt-6 rounded-lg border border-line-soft bg-card p-8">
          <ServerOff size={34} strokeWidth={1.5} className="mx-auto mb-4 text-warm-strong" />
          <p className="font-display text-lg font-semibold text-ink">
            El panel no está disponible ahora mismo
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">
            Tranquilo: <strong className="text-ink">el fallo es nuestro, no tuyo</strong>. El
            servidor está apagado o en mantenimiento. Nada de tu cuenta ni de tus personajes está
            en riesgo — vuelve a intentarlo en unos minutos.
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            Reintentamos automáticamente cada 20 segundos.
          </p>
          <button
            type="button"
            onClick={() => onRetry?.()}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent-deep px-4 py-2 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-deep/80"
          >
            <RefreshCw size={14} /> Reintentar ahora
          </button>
        </div>
        <p className="mt-6 text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
          Condado de Northland · Roleplay
        </p>
      </div>
    </div>
  )
}
