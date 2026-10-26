import { BedDouble, Building, ClipboardList, Store, UtensilsCrossed, Users, Wallet, Wrench } from 'lucide-react'

import type { Business, BusinessKind, Workshop, WorkshopOrder } from '@/api'
import { useAgencies, useBusinesses, useWorkshops } from '@/hooks/api'
import { BUSINESS_KIND_LABEL, formatDate, formatDateTime, formatMoney } from '@/lib/format'
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
      <WorkshopsSection />
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

// ── Talleres mecánicos ──────────────────────────────────────────

const ORDER_STATUS: Record<string, { label: string; tone: 'accent' | 'warm' | 'neutral' | 'danger' }> = {
  pending: { label: 'Pendiente', tone: 'warm' },
  in_progress: { label: 'En curso', tone: 'accent' },
  completed: { label: 'Completada', tone: 'neutral' },
  cancelled: { label: 'Cancelada', tone: 'danger' },
}

const TX_TYPE: Record<string, { label: string; tone: 'accent' | 'warm' | 'neutral' | 'danger' }> = {
  sale: { label: 'Venta', tone: 'accent' },
  expense: { label: 'Gasto', tone: 'danger' },
  deposit: { label: 'Ingreso', tone: 'accent' },
  withdraw: { label: 'Retirada', tone: 'warm' },
  payroll: { label: 'Nómina', tone: 'neutral' },
}

function OrderRow({ order: o, showCustomer }: { order: WorkshopOrder; showCustomer?: boolean }) {
  const st = ORDER_STATUS[o.status] ?? { label: o.status, tone: 'neutral' as const }
  return (
    <li className="rounded-md border border-line-soft px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-ink">{o.vehiclePlate ?? '—'}</span>
        <span className="text-xs text-ink-faint">{o.vehicleModel ?? ''}</span>
        <Badge tone={st.tone}>{st.label}</Badge>
        <span className="ml-auto text-xs font-medium text-ink">{formatMoney(o.totalCost)}</span>
      </div>
      <p className="mt-1 text-xs text-ink-faint">
        {showCustomer && o.customerName ? `${o.customerName} · ` : ''}
        {o.mods.length > 0
          ? o.mods.map((m) => `${m.name} (${formatMoney(m.price)})`).join(', ')
          : 'Sin mods detalladas'}
        {o.createdAt && ` · ${formatDateTime(o.createdAt)}`}
      </p>
    </li>
  )
}

function WorkshopCard({ ws }: { ws: Workshop }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-md border border-line bg-card-hover text-accent-strong">
          <Wrench size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-ink">{ws.name}</p>
          <p className="text-xs text-ink-faint">
            {ws.boughtAt ? `Desde ${formatDate(ws.boughtAt)}` : `ID ${ws.id}`}
          </p>
        </div>
        <Badge tone={ws.role === 'owner' ? 'accent' : 'neutral'}>
          {ws.role === 'owner' ? 'Dueño' : 'Empleado'}
        </Badge>
        {ws.forSale && <Badge tone="warm">En venta</Badge>}
        {ws.balance != null && (
          <span className="text-sm font-medium text-ink">{formatMoney(ws.balance)}</span>
        )}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        <div>
          <p className="kicker mb-2 inline-flex items-center gap-1.5">
            <Users size={11} /> Empleados ({ws.employees.length})
          </p>
          {ws.employees.length === 0 ? (
            <p className="text-xs text-ink-faint">Sin empleados.</p>
          ) : (
            <ul className="space-y-1">
              {ws.employees.map((e) => (
                <li key={e.identifier} className="text-sm text-ink-dim">
                  {e.name ?? e.identifier}
                  {e.hiredAt && (
                    <span className="text-xs text-ink-faint"> · {formatDate(e.hiredAt)}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="kicker mb-2 inline-flex items-center gap-1.5">
            <Wallet size={11} /> Caja
          </p>
          {ws.transactions.length === 0 ? (
            <p className="text-xs text-ink-faint">Sin movimientos.</p>
          ) : (
            <ul className="space-y-1.5">
              {ws.transactions.slice(0, 8).map((t) => {
                const tt = TX_TYPE[t.type] ?? { label: t.type, tone: 'neutral' as const }
                return (
                  <li key={t.id} className="flex items-center gap-2 text-xs">
                    <Badge tone={tt.tone}>{tt.label}</Badge>
                    <span className="min-w-0 flex-1 truncate text-ink-dim">
                      {t.description ?? '—'}
                    </span>
                    <span className="font-medium text-ink">{formatMoney(t.amount)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div>
          <p className="kicker mb-2 inline-flex items-center gap-1.5">
            <ClipboardList size={11} /> Órdenes ({ws.orders.length})
          </p>
          {ws.orders.length === 0 ? (
            <p className="text-xs text-ink-faint">Sin órdenes.</p>
          ) : (
            <ul className="space-y-2">
              {ws.orders.slice(0, 6).map((o) => (
                <OrderRow key={o.id} order={o} showCustomer />
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  )
}

function WorkshopsSection() {
  const { data, isLoading, isError, refetch } = useWorkshops()

  if (isLoading) {
    return (
      <section aria-label="Talleres">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <Wrench size={14} /> Talleres mecánicos
          </span>
        </SectionTitle>
        <Skeleton className="h-48" />
      </section>
    )
  }
  if (isError) {
    return (
      <section aria-label="Talleres">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <Wrench size={14} /> Talleres mecánicos
          </span>
        </SectionTitle>
        <ErrorState description="No se pudieron cargar los talleres." onRetry={() => void refetch()} />
      </section>
    )
  }
  // pedidos como cliente solo en talleres ajenos (los propios ya se
  // ven en la ficha del taller → evita duplicados)
  const ownIds = new Set((data?.workshops ?? []).map((w) => w.id))
  const customerOrders = (data?.customerOrders ?? []).filter(
    (o) => !ownIds.has(o.mechanicId ?? '')
  )
  if (!data || (!data.workshops.length && !customerOrders.length)) return null

  return (
    <section className="space-y-4" aria-label="Talleres">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <Wrench size={14} /> Talleres mecánicos
        </span>
      </SectionTitle>

      {data.workshops.map((ws) => (
        <WorkshopCard key={ws.id} ws={ws} />
      ))}

      {customerOrders.length > 0 && (
        <Card className="p-5">
          <p className="kicker mb-2">Mis pedidos en talleres</p>
          <ul className="space-y-2">
            {customerOrders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </ul>
        </Card>
      )}
    </section>
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
