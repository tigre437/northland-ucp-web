import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { ApiError } from '@/api'
import { useMe } from '@/hooks/api'
import { PageLoader, ServiceUnavailable } from '@/components/ui/feedback'

/**
 * Protege las rutas privadas: sin sesión válida redirige a /login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, error, refetch } = useMe()
  const location = useLocation()

  if (isLoading) return <PageLoader />

  if (isError) {
    if (error instanceof ApiError && error.status === 401) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }
    // Cualquier error que no sea 401 = API caída/ilegible (ngrok off,
    // 502, HTML del túnel…) — /auth/me nunca devuelve otra cosa.
    return <ServiceUnavailable onRetry={() => void refetch()} />
  }

  if (!data) return <Navigate to="/login" replace />
  return children
}
