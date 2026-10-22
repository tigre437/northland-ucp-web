import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { ApiError } from '@/api'
import { useMe } from '@/hooks/api'
import { ErrorState, PageLoader } from '@/components/ui/feedback'

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
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ErrorState
            title="No se pudo verificar tu sesión"
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        </div>
      </div>
    )
  }

  if (!data) return <Navigate to="/login" replace />
  return children
}
