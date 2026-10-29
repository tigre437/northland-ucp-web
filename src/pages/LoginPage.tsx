import { Shield } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, useLocation } from 'react-router-dom'

import { api, ApiError } from '@/api'
import { isDemo } from '@/config/env'
import { useMe } from '@/hooks/api'
import { BrandLogo } from '@/components/layout/BrandMark'
import { PageLoader, ServiceUnavailable } from '@/components/ui/feedback'

export function LoginPage() {
  const { data: me, isLoading, isError, error, refetch } = useMe()
  const location = useLocation()
  const queryClient = useQueryClient()

  if (isLoading) return <PageLoader />
  // API caída → ni siquiera se puede iniciar el OAuth; el botón de
  // Discord apuntaría a un servidor muerto.
  if (isError && !(error instanceof ApiError && error.status === 401)) {
    return <ServiceUnavailable onRetry={() => void refetch()} />
  }
  if (me) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? '/'} replace />
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-base px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo className="mb-4 size-20 shadow-lg" />
          <h1 className="font-display text-xl font-bold uppercase tracking-[0.08em] text-ink">
            Northland community
          </h1>
          <p className="mt-1 text-sm text-ink-dim">Panel de usuario</p>
        </div>

        <div className="rounded-lg border border-line-soft bg-card p-6">
          <p className="mb-5 text-center text-sm leading-relaxed text-ink-dim">
            Accede con tu cuenta de Discord para ver tus personajes, propiedades y vehículos del
            servidor.
          </p>

          {isDemo ? (
            <>
              <button
                type="button"
                onClick={async () => {
                  await api.login?.()
                  await queryClient.invalidateQueries()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-deep px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-deep/80"
              >
                Entrar a la demo
              </button>
              <p className="mt-3 rounded-md border border-brand-600/50 bg-brand-600/10 px-3 py-2 text-center text-xs text-warm-strong">
                Modo demostración: los datos mostrados no son reales.
              </p>
            </>
          ) : (
            <a
              href={api.loginUrl()}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#5865F2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] focus-visible:outline-2"
            >
              <DiscordGlyph />
              Iniciar sesión con Discord
            </a>
          )}

          <div className="mt-5 flex items-start gap-2 text-[0.72rem] leading-relaxed text-ink-faint">
            <Shield size={13} className="mt-0.5 shrink-0" />
            <p>
              Solo solicitamos tu identidad de Discord. Tu cuenta de juego se vincula
              automáticamente con los identificadores de FiveM cuando te conectas al servidor.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
          Condado de Northland · Roleplay
        </p>
      </div>
    </div>
  )
}

function DiscordGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.946 2.418-2.157 2.418Z" />
    </svg>
  )
}
