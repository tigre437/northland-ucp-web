import { BedDouble, Building, Store, UtensilsCrossed, Wrench } from 'lucide-react'

import type { Business, BusinessKind } from '@/api'
import { useAgencies, useBusinesses } from '@/hooks/api'
import { BUSINESS_KIND_LABEL, formatDate, formatMoney } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, KeyVal, PageHeader, SectionTitle } from '@/components/ui/surfaces'

const KIND_ICON: Record<BusinessKind, typeof Store> = {
  shop: Store,
  restaurant: UtensilsCrossed,
  mechanic: Wrench,
  motel: BedDouble,
  agency: Building,
}

export function BusinessesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Negocios"
        subtitle="Comercios, restaurantes, talleres y moteles donde eres dueño o empleado."
      />
      <BusinessesSection />
      <AgenciesSection />
    </div>
  )
}

function BusinessesSection() {
  const { data, isLoading, isError, refetch } = useBusinesses()

  return (
    <section aria-label="Negocios">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <Store size={14} /> Mis negocios
        </span>
      </SectionTitle>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar los negocios." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<Store size={30} />}
          title="Sin negocios"
          description="No eres dueño ni empleado de ningún comercio, restaurante, taller o motel."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((b) => (
            <BusinessCard key={`${b.kind}:${b.id}:${b.role}`} business={b} />
          ))}
        </div>
      )}
    </section>
  )
}

function BusinessCard({ business: b }: { business: Business }) {
  const Icon = KIND_ICON[b.kind]
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-card-hover text-accent-strong">
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-ink">{b.label}</p>
          <p className="truncate text-xs text-ink-faint">
            {BUSINESS_KIND_LABEL[b.kind]}
            {b.isOpen != null ? ` · ${b.isOpen ? 'abierto' : 'cerrado'}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone={b.role === 'owner' ? 'accent' : 'neutral'}>
              {b.role === 'owner' ? 'Dueño' : 'Empleado'}
            </Badge>
            {b.balance != null && (
              <span className="text-xs font-medium text-ink-dim">Caja: {formatMoney(b.balance)}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function AgenciesSection() {
  const { data, isLoading, isError, refetch } = useAgencies()

  if (isLoading) {
    return (
      <section aria-label="Inmobiliaria">
        <SectionTitle>Inmobiliaria</SectionTitle>
        <Skeleton className="h-40" />
      </section>
    )
  }
  if (isError) {
    return (
      <section aria-label="Inmobiliaria">
        <SectionTitle>Inmobiliaria</SectionTitle>
        <ErrorState description="No se pudieron cargar las agencias." onRetry={() => void refetch()} />
      </section>
    )
  }
  if (!data?.length) return null // no mostrar la sección si no trabaja en una inmobiliaria

  return (
    <section className="space-y-4" aria-label="Inmobiliaria">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <Building size={14} /> Inmobiliaria
        </span>
      </SectionTitle>

      {data.map((ag) => (
        <Card key={ag.id} className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display font-semibold text-ink">{ag.label}</p>
              <p className="text-xs text-ink-faint">
                {ag.rankName ?? 'Agente'}
                {ag.isBoss ? ' · Jefe' : ''}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-ink-dim">
                Ventas: <span className="font-medium text-ink">{ag.salesCount}</span>
              </span>
              <span className="text-ink-dim">
                Comisiones: <span className="font-medium text-ink">{formatMoney(ag.totalCommission)}</span>
              </span>
            </div>
          </div>

          {ag.listings.length > 0 && (
            <dl className="mt-4">
              {ag.listings.map((l) => (
                <KeyVal
                  key={l.id}
                  label={l.houseName}
                  value={
                    <span className="inline-flex items-center gap-2">
                      {l.status === 'sold' ? formatMoney(l.soldPrice) : formatMoney(l.listPrice)}
                      <Badge tone={l.status === 'sold' ? 'accent' : l.status === 'active' ? 'warm' : 'neutral'}>
                        {l.status === 'sold'
                          ? `Vendida ${formatDate(l.soldAt)}`
                          : l.status === 'active'
                            ? 'En venta'
                            : l.status}
                      </Badge>
                    </span>
                  }
                />
              ))}
            </dl>
          )}
        </Card>
      ))}
    </section>
  )
}
