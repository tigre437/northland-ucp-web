import { Car, Star } from 'lucide-react'

import type { Vehicle } from '@/api'
import { useVehicles } from '@/hooks/api'
import { VEHICLE_STATE_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, PageHeader } from '@/components/ui/surfaces'

const STATE_TONE: Record<string, 'neutral' | 'accent' | 'warm' | 'danger'> = {
  garage: 'accent',
  out: 'warm',
  impound: 'danger',
  unknown: 'neutral',
}

export function VehiclesPage() {
  const { data, isLoading, isError, refetch } = useVehicles()

  return (
    <div>
      <PageHeader title="Vehículos" subtitle="Vehículos registrados de todos tus personajes." />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar los vehículos." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<Car size={30} />}
          title="Sin vehículos"
          description="Ninguno de tus personajes tiene vehículos registrados todavía."
        />
      ) : (
        <>
          {/* Tabla en pantallas medianas+ */}
          <Card className="hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="kicker px-4 py-3 font-semibold">Matrícula</th>
                  <th className="kicker px-4 py-3 font-semibold">Modelo</th>
                  <th className="kicker px-4 py-3 font-semibold">Propietario</th>
                  <th className="kicker px-4 py-3 font-semibold">Garaje</th>
                  <th className="kicker px-4 py-3 font-semibold">Estado</th>
                  <th className="kicker px-4 py-3 text-right font-semibold">Motor / Chasis</th>
                </tr>
              </thead>
              <tbody>
                {data.map((v) => (
                  <tr key={v.id} className="border-b border-line-soft last:border-b-0 hover:bg-card-hover/50">
                    <td className="px-4 py-3 font-mono font-medium text-ink">
                      {v.plate}
                      {v.favorite && (
                        <Star size={12} className="ml-1.5 inline fill-warm text-warm" aria-label="Favorito" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink">{v.model}</td>
                    <td className="px-4 py-3 text-ink-dim">{v.ownerName ?? '—'}</td>
                    <td className="px-4 py-3 text-ink-dim">{v.garage ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATE_TONE[v.state]}>{VEHICLE_STATE_LABEL[v.state]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-ink-dim">
                      {health(v.engine)} / {health(v.body)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Tarjetas en móvil */}
          <div className="space-y-3 md:hidden">
            {data.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function health(value: number | null): string {
  if (value == null) return '—'
  return `${Math.max(0, Math.round(value / 10))}%`
}

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono font-semibold text-ink">{v.plate}</p>
        <Badge tone={STATE_TONE[v.state]}>{VEHICLE_STATE_LABEL[v.state]}</Badge>
      </div>
      <p className="mt-1 text-sm text-ink">{v.model}</p>
      <dl className="mt-2 space-y-1 text-xs text-ink-faint">
        <div className="flex justify-between">
          <dt>Propietario</dt>
          <dd className="text-ink-dim">{v.ownerName ?? '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Garaje</dt>
          <dd className="text-ink-dim">{v.garage ?? '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Motor / Chasis</dt>
          <dd className="text-ink-dim">
            {health(v.engine)} / {health(v.body)}
          </dd>
        </div>
      </dl>
    </Card>
  )
}
