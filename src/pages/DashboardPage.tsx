import { ArrowRight, Car, Home, Link2Off, Server, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCharacters, useMe, useProperties, useServerInfo, useVehicles } from '@/hooks/api'
import { formatMoney, fullName, relativeTime } from '@/lib/format'
import { ErrorState, Skeleton } from '@/components/ui/feedback'
import { Avatar, Badge, Card, PageHeader, SectionTitle, Stat } from '@/components/ui/surfaces'

export function DashboardPage() {
  const me = useMe()
  const characters = useCharacters()
  const properties = useProperties()
  const vehicles = useVehicles()
  const server = useServerInfo()

  const displayName = me.data?.discord.globalName ?? me.data?.discord.username ?? 'jugador'
  const chars = characters.data ?? []
  const lastSeen = chars
    .map((c) => c.lastLoggedOut ?? c.lastUpdated)
    .filter((v): v is string => Boolean(v))
    .sort()
    .at(-1)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hola, ${displayName}`}
        subtitle="Resumen de tu actividad en Northland community."
      />

      {/* Aviso de vinculación */}
      {me.data && !me.data.link.linked && (
        <Card className="flex items-start gap-3 border-brand-600/40 bg-brand-600/10 p-4">
          <Link2Off className="mt-0.5 shrink-0 text-warm-strong" size={18} />
          <div className="text-sm">
            <p className="font-medium text-ink">Cuenta aún no vinculada con el servidor</p>
            <p className="mt-0.5 text-ink-dim">
              Entra al servidor de FiveM con esta misma cuenta de Discord conectada para que
              podamos asociar tus personajes automáticamente.
            </p>
          </div>
        </Card>
      )}

      {/* Resumen */}
      <section aria-label="Resumen">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="Personajes"
            icon={<Users size={20} />}
            value={characters.isLoading ? <Skeleton className="h-6 w-10" /> : chars.length}
          />
          <Stat
            label="Propiedades"
            icon={<Home size={20} />}
            value={properties.isLoading ? <Skeleton className="h-6 w-10" /> : (properties.data?.length ?? 0)}
          />
          <Stat
            label="Vehículos"
            icon={<Car size={20} />}
            value={vehicles.isLoading ? <Skeleton className="h-6 w-10" /> : (vehicles.data?.length ?? 0)}
          />
          <Stat label="Última conexión" icon={<Server size={20} />} value={lastSeen ? relativeTime(lastSeen) : '—'} />
        </div>
      </section>

      {/* Personajes */}
      <section aria-label="Tus personajes">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Tus personajes</SectionTitle>
          <Link
            to="/personajes"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent-strong hover:underline"
          >
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        {characters.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : characters.isError ? (
          <ErrorState description="No se pudieron cargar los personajes." onRetry={() => void characters.refetch()} />
        ) : chars.length === 0 ? (
          <Card className="p-6 text-center text-sm text-ink-dim">
            Todavía no tienes personajes creados. Entra al servidor para crear el primero.
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {chars.slice(0, 4).map((c) => (
              <Link key={c.citizenid} to={`/personajes/${c.citizenid}`}>
                <Card className="flex h-full items-center gap-3 p-4 transition-colors hover:bg-card-hover">
                  <Avatar url={null} name={fullName(c.firstname, c.lastname)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-semibold text-ink">
                      {fullName(c.firstname, c.lastname)}
                    </p>
                    <p className="truncate text-xs text-ink-faint">{c.citizenid}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {c.job && <Badge tone={c.job.type === 'leo' ? 'accent' : 'neutral'}>{c.job.label}</Badge>}
                      <span className="text-xs text-ink-faint">{formatMoney(c.money.bank)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Accesos rápidos + info del servidor */}
      <section className="grid gap-3 md:grid-cols-2" aria-label="Información del servidor">
        <Card className="p-5">
          <SectionTitle>Servidor</SectionTitle>
          {server.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : server.isError ? (
            <p className="text-sm text-ink-dim">Información del servidor no disponible ahora mismo.</p>
          ) : (
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-ink">{server.data?.name}</p>
              {server.data?.description && <p className="text-ink-dim">{server.data.description}</p>}
              <p className="text-ink-dim">
                Jugadores conectados:{' '}
                <span className="text-ink">
                  {server.data?.onlinePlayers != null
                    ? `${server.data.onlinePlayers}${server.data.maxPlayers ? `/${server.data.maxPlayers}` : ''}`
                    : 'sin datos en tiempo real'}
                </span>
              </p>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <SectionTitle>Accesos rápidos</SectionTitle>
          <div className="grid grid-cols-1 gap-1.5">
            <QuickLink to="/personajes" label="Gestionar personajes" />
            <QuickLink to="/propiedades" label="Ver propiedades" />
            <QuickLink to="/vehiculos" label="Ver vehículos" />
            <QuickLink to="/cuenta" label="Mi cuenta y sesión" />
          </div>
        </Card>
      </section>
    </div>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-ink-dim transition-colors hover:bg-card-hover hover:text-ink"
    >
      {label}
      <ArrowRight size={14} />
    </Link>
  )
}
