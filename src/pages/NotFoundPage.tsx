import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/surfaces'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm p-8 text-center">
        <p className="kicker mb-2">Error 404</p>
        <p className="font-display text-lg font-semibold text-ink">Ruta no encontrada</p>
        <p className="mt-1 text-sm text-ink-dim">
          La página que buscas no existe o ha cambiado de sitio.
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-md border border-line bg-card-hover px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-card"
        >
          Volver al panel
        </Link>
      </Card>
    </div>
  )
}
