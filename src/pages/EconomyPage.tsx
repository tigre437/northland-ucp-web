import { CreditCard, Landmark, ReceiptText, ScrollText } from 'lucide-react'

import type { Invoice } from '@/api'
import { useFinances, useInvoices } from '@/hooks/api'
import { formatDate, formatDateTime, formatMoney, INVOICE_STATUS_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, KeyVal, PageHeader, SectionTitle } from '@/components/ui/surfaces'

export function EconomyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Economía"
        subtitle="Facturas, cuentas bancarias, tarjetas y préstamos de tus personajes."
      />
      <InvoicesSection />
      <FinancesSection />
    </div>
  )
}

function invoiceTone(status: string): 'neutral' | 'accent' | 'warm' | 'danger' {
  if (status === 'paid') return 'accent'
  if (status === 'pending' || status === 'partially_paid') return 'warm'
  return 'neutral'
}

function InvoicesSection() {
  const { data, isLoading, isError, refetch } = useInvoices()

  return (
    <section aria-label="Facturas">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <ReceiptText size={14} /> Facturas
        </span>
      </SectionTitle>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar las facturas." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<ReceiptText size={30} />}
          title="Sin facturas"
          description="No tienes facturas emitidas a tus personajes."
        />
      ) : (
        <div className="space-y-2">
          {data.map((inv) => (
            <InvoiceRow key={inv.id} invoice={inv} />
          ))}
        </div>
      )}
    </section>
  )
}

function InvoiceRow({ invoice: inv }: { invoice: Invoice }) {
  const firstLine = inv.lines[0] as Record<string, unknown> | undefined
  const lineLabel =
    (firstLine?.label ?? firstLine?.description ?? firstLine?.name) as string | undefined

  return (
    <Card className="flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-ink">
          {inv.reference}
          <span className="ml-2 font-normal text-ink-faint">· {inv.issuerName ?? inv.society ?? 'Desconocido'}</span>
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-faint">
          {lineLabel ?? inv.category}
          {inv.targetName ? ` · ${inv.targetName}` : ''}
          {inv.dueAt ? ` · vence ${formatDate(inv.dueAt)}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-display font-semibold text-ink">{formatMoney(inv.total)}</span>
        <Badge tone={invoiceTone(inv.status)}>{INVOICE_STATUS_LABEL[inv.status] ?? inv.status}</Badge>
      </div>
    </Card>
  )
}

function FinancesSection() {
  const { data, isLoading, isError, refetch } = useFinances()

  if (isLoading) {
    return (
      <section aria-label="Banca">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <Landmark size={14} /> Banca
          </span>
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </section>
    )
  }
  if (isError) {
    return (
      <section aria-label="Banca">
        <SectionTitle>Banca</SectionTitle>
        <ErrorState description="No se pudieron cargar los datos bancarios." onRetry={() => void refetch()} />
      </section>
    )
  }
  if (!data || (!data.accounts.length && !data.cards.length && !data.loans.length && !data.history.length)) {
    return (
      <section aria-label="Banca">
        <SectionTitle>Banca</SectionTitle>
        <EmptyState
          icon={<Landmark size={30} />}
          title="Sin datos bancarios"
          description="No hay cuentas, tarjetas, préstamos ni movimientos asociados a tus personajes."
        />
      </section>
    )
  }

  return (
    <section className="space-y-6" aria-label="Banca">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <Landmark size={14} /> Banca
        </span>
      </SectionTitle>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Cuentas */}
        {data.accounts.length > 0 && (
          <Card className="p-5">
            <h3 className="kicker mb-3">Cuentas</h3>
            <dl>
              {data.accounts.map((a) => (
                <div key={a.id} className="border-b border-line-soft py-2 last:border-b-0">
                  <div className="flex items-baseline justify-between">
                    <dt className="font-mono text-xs text-ink-faint">{a.id}</dt>
                    <dd className="font-display font-semibold text-ink">{formatMoney(a.amount)}</dd>
                  </div>
                  {a.isFrozen && <Badge tone="danger">Congelada</Badge>}
                </div>
              ))}
            </dl>
          </Card>
        )}

        {/* Tarjetas */}
        {data.cards.length > 0 && (
          <Card className="p-5">
            <h3 className="kicker mb-3 inline-flex items-center gap-2">
              <CreditCard size={13} /> Tarjetas
            </h3>
            <dl>
              {data.cards.map((c) => (
                <KeyVal
                  key={c.id}
                  label={`${c.cardType ?? 'tarjeta'} ${c.cardNumber}`}
                  value={
                    <span className="inline-flex items-center gap-2">
                      {c.valid ?? '—'}
                      {!c.active && <Badge tone="danger">Inactiva</Badge>}
                    </span>
                  }
                />
              ))}
            </dl>
          </Card>
        )}

        {/* Préstamos */}
        {data.loans.length > 0 && (
          <Card className="p-5">
            <h3 className="kicker mb-3 inline-flex items-center gap-2">
              <ScrollText size={13} /> Préstamos
            </h3>
            {data.loans.map((l) => (
              <div key={l.id} className="border-b border-line-soft py-2 last:border-b-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm text-ink">{l.reason ?? 'Préstamo'}</p>
                  <Badge tone={l.missed > 0 ? 'danger' : 'accent'}>{l.status}</Badge>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-card-hover">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min(100, (l.paid / Math.max(1, l.total)) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-ink-faint">
                  {formatMoney(l.paid)} de {formatMoney(l.total)} · {l.paidInstalments}/{l.instalments} cuotas
                  {l.missed > 0 ? ` · ${l.missed} impagada(s)` : ''}
                  {l.nextPayment ? ` · próxima ${formatDate(l.nextPayment)}` : ''}
                </p>
              </div>
            ))}
          </Card>
        )}

        {/* Movimientos */}
        {data.history.length > 0 && (
          <Card className="p-5">
            <h3 className="kicker mb-3">Movimientos recientes</h3>
            <dl>
              {data.history.map((t) => (
                <KeyVal
                  key={t.id}
                  label={formatDateTime(t.date)}
                  value={
                    <span className={t.amount >= 0 ? 'text-accent-strong' : 'text-danger-strong'}>
                      {t.amount >= 0 ? '+' : ''}
                      {formatMoney(t.amount)}
                    </span>
                  }
                />
              ))}
            </dl>
          </Card>
        )}
      </div>
    </section>
  )
}
