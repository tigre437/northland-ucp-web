import { Building2, Home, Warehouse, BedDouble } from 'lucide-react'

import type { Property, PropertyKind } from '@/api'
import { useProperties } from '@/hooks/api'
import { formatMoney, PROPERTY_KIND_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, PageHeader, SectionTitle } from '@/components/ui/surfaces'

const KIND_ICON: Record<PropertyKind, typeof Home> = {
  house: Home,
  apartment: Building2,
  motel: BedDouble,
  garage: Warehouse,
}

const KIND_ORDER: PropertyKind[] = ['house', 'apartment', 'motel', 'garage']

export function PropertiesPage() {
  const { data, isLoading, isError, refetch } = useProperties()

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: (data ?? []).filter((p) => p.kind === kind),
  })).filter((g) => g.items.length > 0)

  return (
    <div>
      <PageHeader
        title="Propiedades"
        subtitle="Viviendas, apartamentos, habitaciones de motel y garajes de tus personajes."
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar las propiedades." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<Home size={30} />}
          title="Sin propiedades"
          description="Ninguno de tus personajes tiene viviendas, apartamentos, habitaciones de motel o garajes registrados."
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(({ kind, items }) => {
            const Icon = KIND_ICON[kind]
            return (
              <section key={kind}>
                <SectionTitle>
                  <span className="inline-flex items-center gap-2">
                    <Icon size={14} /> {PROPERTY_KIND_LABEL[kind]}s ({items.length})
                  </span>
                </SectionTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((p) => (
                    <PropertyCard key={`${p.kind}:${p.id}`} property={p} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PropertyCard({ property: p }: { property: Property }) {
  const Icon = KIND_ICON[p.kind]
  return (
    <Card className="flex items-start gap-3 p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-card-hover text-accent-strong">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-ink">{p.label}</p>
        <p className="truncate text-xs text-ink-faint">
          {PROPERTY_KIND_LABEL[p.kind]}
          {p.ownerName ? ` · ${p.ownerName}` : ''}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.rented === true && <Badge tone="warm">Alquilada · {formatMoney(p.rentPrice)}</Badge>}
          {p.rented === false && <Badge tone="accent">En propiedad</Badge>}
          {p.tier != null && <Badge>Tier {p.tier}</Badge>}
          {p.detail && p.detail !== PROPERTY_KIND_LABEL[p.kind] && <Badge>{p.detail}</Badge>}
        </div>
      </div>
    </Card>
  )
}
