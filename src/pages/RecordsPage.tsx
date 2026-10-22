import { BadgeCheck, Gavel, IdCard, ScrollText, ShieldAlert } from 'lucide-react'

import type { CharacterRecord, LicenseDoc } from '@/api'
import { useLicenses, useRecords } from '@/hooks/api'
import { formatDate, formatDateTime, formatMoney } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Avatar, Badge, Card, KeyVal, PageHeader, SectionTitle } from '@/components/ui/surfaces'

const DOC_STATUS: Record<string, { label: string; tone: 'accent' | 'warm' | 'danger' | 'neutral' }> = {
  active: { label: 'Activo', tone: 'accent' },
  expired: { label: 'Caducado', tone: 'warm' },
  revoked: { label: 'Revocado', tone: 'danger' },
  cancelled: { label: 'Cancelado', tone: 'neutral' },
}

export function RecordsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Documentos y expediente"
        subtitle="Carnets emitidos y expediente policial de tus personajes."
      />
      <LicensesSection />
      <RecordsSection />
    </div>
  )
}

function LicensesSection() {
  const { data, isLoading, isError, refetch } = useLicenses()

  return (
    <section aria-label="Documentos">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <IdCard size={14} /> Documentos
        </span>
      </SectionTitle>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar los documentos." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<IdCard size={30} />}
          title="Sin documentos"
          description="No hay carnets emitidos a tus personajes."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((doc) => (
            <LicenseCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </section>
  )
}

function LicenseCard({ doc }: { doc: LicenseDoc }) {
  const status = DOC_STATUS[doc.status] ?? { label: doc.status, tone: 'neutral' as const }
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {doc.photoUrl ? (
          <img
            src={doc.photoUrl}
            alt="Foto del documento"
            className="size-14 rounded-md border border-line object-cover"
          />
        ) : (
          <span className="flex size-14 items-center justify-center rounded-md border border-line bg-card-hover text-accent-strong">
            <IdCard size={22} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-ink">
            {doc.templateName ?? doc.templateId ?? 'Documento'}
          </p>
          <p className="truncate font-mono text-xs text-ink-faint">{doc.generatedId ?? '—'}</p>
          <div className="mt-1.5">
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
        </div>
      </div>
      <dl className="mt-3">
        <KeyVal label="Emitido" value={formatDateTime(doc.issuedAt)} />
        <KeyVal label="Caduca" value={formatDate(doc.expiresAt)} />
        {doc.points > 0 && <KeyVal label="Puntos" value={doc.points} />}
      </dl>
    </Card>
  )
}

function RecordsSection() {
  const { data, isLoading, isError, refetch } = useRecords()

  return (
    <section aria-label="Expediente policial">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <Gavel size={14} /> Expediente policial
        </span>
      </SectionTitle>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudo cargar el expediente." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <EmptyState
          icon={<Gavel size={30} />}
          title="Sin expediente"
          description="Ninguno de tus personajes figura en el sistema policial."
        />
      ) : (
        <div className="space-y-4">
          {data.map((rec) => (
            <RecordCard key={rec.citizenid} record={rec} />
          ))}
        </div>
      )}
    </section>
  )
}

function RecordCard({ record: rec }: { record: CharacterRecord }) {
  const empty = !rec.penalties.length && !rec.reports.length && !rec.badges.length

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <Avatar url={rec.profilePic} name={rec.citizenid} />
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-ink">{rec.citizenid}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {rec.badges.map((b) => (
              <Badge key={`${b.job}:${b.badge}`} tone="accent">
                <BadgeCheck size={11} /> {b.badge}
              </Badge>
            ))}
            {rec.prison.inPrison && (
              <Badge tone="danger">
                En prisión{rec.prison.remainingMonths ? ` · ${rec.prison.remainingMonths} meses` : ''}
              </Badge>
            )}
            {rec.wanted && <Badge tone="danger">Buscado</Badge>}
            {rec.dangerous && (
              <Badge tone="danger">
                <ShieldAlert size={11} /> Peligroso
              </Badge>
            )}
          </div>
        </div>
      </div>

      {empty ? (
        <p className="mt-4 text-sm text-ink-faint">Sin antecedentes ni sanciones registradas.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {rec.penalties.length > 0 && (
            <div>
              <h3 className="kicker mb-2">Sanciones</h3>
              <div className="space-y-2">
                {rec.penalties.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line-soft px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">
                        {(p.charges[0]?.label as string | undefined) ?? `Sanción #${p.id}`}
                      </p>
                      <p className="text-xs text-ink-faint">
                        {p.appliedBy ?? '—'}
                        {p.appliedAt ? ` · ${p.appliedAt}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{formatMoney(p.totalFine)}</span>
                      {p.totalMonths > 0 && <Badge tone="danger">{p.totalMonths} meses</Badge>}
                      <Badge tone={p.payed ? 'accent' : 'warm'}>{p.payed ? 'Pagada' : 'Pendiente'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rec.reports.length > 0 && (
            <div>
              <h3 className="kicker mb-2 inline-flex items-center gap-1.5">
                <ScrollText size={12} /> Informes
              </h3>
              <div className="space-y-2">
                {rec.reports.map((r) => (
                  <details key={r.id} className="rounded-md border border-line-soft px-3 py-2">
                    <summary className="cursor-pointer text-sm text-ink">
                      {r.title}
                      <span className="ml-2 text-xs text-ink-faint">
                        {r.location ?? r.job} · {formatDate(r.createdAt)}
                      </span>
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-ink-dim">{r.content}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
