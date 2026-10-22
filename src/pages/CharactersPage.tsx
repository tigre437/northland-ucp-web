import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCharacters } from '@/hooks/api'
import { formatMoney, fullName, relativeTime } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Avatar, Badge, Card, PageHeader } from '@/components/ui/surfaces'

export function CharactersPage() {
  const { data, isLoading, isError, refetch } = useCharacters()

  return (
    <div>
      <PageHeader title="Personajes" subtitle="Todos los personajes asociados a tu cuenta." />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar tus personajes." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<Users size={30} />}
          title="Sin personajes"
          description="Tu cuenta de Discord está vinculada, pero todavía no hay personajes creados en el servidor."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <Link key={c.citizenid} to={`/personajes/${c.citizenid}`}>
              <Card className="flex h-full flex-col p-4 transition-colors hover:bg-card-hover">
                <div className="flex items-center gap-3">
                  <Avatar url={null} name={fullName(c.firstname, c.lastname)} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold text-ink">
                      {fullName(c.firstname, c.lastname)}
                    </p>
                    <p className="truncate font-mono text-xs text-ink-faint">{c.citizenid}</p>
                  </div>
                </div>

                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-faint">Trabajo</dt>
                    <dd className="truncate text-ink">
                      {c.job ? `${c.job.label} · ${c.job.gradeName}` : '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-faint">Banco</dt>
                    <dd className="text-ink">{formatMoney(c.money.bank)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-faint">Última conexión</dt>
                    <dd className="text-ink">{relativeTime(c.lastLoggedOut ?? c.lastUpdated)}</dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                  {c.job?.onDuty && <Badge tone="accent">De servicio</Badge>}
                  {c.job?.type === 'leo' && <Badge tone="accent">LEO</Badge>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
