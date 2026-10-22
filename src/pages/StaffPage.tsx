import { Ban, Car, Gavel, Package, Plus, ScrollText, Search, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { api } from '@/api'
import type { StaffPlayerDetail } from '@/api'
import {
  useMe,
  useStaffAudit,
  useStaffInventory,
  useStaffPenalties,
  useStaffPlayer,
  useStaffSearch,
  useStaffVehicles,
} from '@/hooks/api'
import { formatDateTime, formatMoney, relativeTime, VEHICLE_STATE_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, KeyVal, PageHeader, SectionTitle } from '@/components/ui/surfaces'

type Tab = 'resumen' | 'sanciones' | 'inventario' | 'vehiculos'

export function StaffPage() {
  const { data: me } = useMe()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('resumen')
  const search = useStaffSearch(me?.staff ? q : '')

  if (me && !me.staff) {
    return (
      <EmptyState
        icon={<ShieldCheck size={30} />}
        title="Sin acceso de staff"
        description="Esta sección requiere un rol de staff verificado en el Discord del servidor."
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de staff"
        subtitle="Búsqueda y gestión de jugadores: sanciones, inventario y vehículos."
      />

      {/* Búsqueda */}
      <Card className="p-4">
        <label htmlFor="staff-search" className="kicker mb-2 block">
          Buscar jugador
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            id="staff-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre, citizenid o cuenta…"
            className="w-full rounded-md border border-line bg-card-hover py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </div>

        {q.trim().length >= 2 && (
          <div className="mt-2 divide-y divide-line-soft">
            {search.isLoading ? (
              <Skeleton className="h-10" />
            ) : search.isError ? (
              <p className="py-2 text-sm text-danger-strong">Error al buscar.</p>
            ) : !search.data?.length ? (
              <p className="py-2 text-sm text-ink-faint">Sin resultados para «{q}».</p>
            ) : (
              search.data.map((p) => (
                <button
                  key={p.citizenid}
                  type="button"
                  onClick={() => {
                    setSelected(p.citizenid)
                    setTab('resumen')
                  }}
                  className={`flex w-full items-center justify-between px-2 py-2 text-left text-sm transition-colors hover:bg-card-hover ${
                    selected === p.citizenid ? 'text-accent-strong' : 'text-ink'
                  }`}
                >
                  <span>
                    {p.name}
                    <span className="ml-2 font-mono text-xs text-ink-faint">{p.citizenid}</span>
                  </span>
                  <span className="text-xs text-ink-faint">
                    {p.jobLabel ?? '—'} · {relativeTime(p.lastLoggedOut)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </Card>

      {selected ? (
        <PlayerPanel citizenid={selected} tab={tab} onTab={setTab} />
      ) : (
        <EmptyState
          icon={<ShieldCheck size={30} />}
          title="Selecciona un jugador"
          description="Busca un personaje para ver su ficha completa, inventario, vehículos y sanciones."
        />
      )}

      <AuditSection active={!selected} />
    </div>
  )
}

function PlayerPanel({
  citizenid,
  tab,
  onTab,
}: {
  citizenid: string
  tab: Tab
  onTab: (t: Tab) => void
}) {
  const detail = useStaffPlayer(citizenid)

  const tabs: { id: Tab; label: string; icon: typeof Gavel }[] = [
    { id: 'resumen', label: 'Resumen', icon: ShieldCheck },
    { id: 'sanciones', label: 'Sanciones', icon: Gavel },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'vehiculos', label: 'Vehículos', icon: Car },
  ]

  return (
    <section aria-label={`Ficha de ${citizenid}`} className="space-y-4">
      {detail.isLoading ? (
        <Skeleton className="h-28" />
      ) : detail.isError ? (
        <ErrorState description="No se pudo cargar el jugador." onRetry={() => void detail.refetch()} />
      ) : detail.data ? (
        <PlayerHeader player={detail.data} />
      ) : null}

      {/* Pestañas */}
      <div className="flex gap-1 border-b border-line-soft" role="tablist">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTab(id)}
            className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? 'border-accent text-accent-strong'
                : 'border-transparent text-ink-dim hover:text-ink'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'resumen' && detail.data && <SummaryTab player={detail.data} />}
      {tab === 'sanciones' && <PenaltiesTab citizenid={citizenid} />}
      {tab === 'inventario' && <InventoryTab citizenid={citizenid} />}
      {tab === 'vehiculos' && <VehiclesTab citizenid={citizenid} />}
    </section>
  )
}

function PlayerHeader({ player: p }: { player: StaffPlayerDetail }) {
  return (
    <Card className="flex flex-wrap items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold text-ink">{p.name}</p>
        <p className="font-mono text-xs text-ink-faint">
          {p.citizenid} · userId {p.userId ?? '—'} · {p.licenseMasked ?? 'sin licencia'}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.jobLabel && <Badge tone={p.onDuty ? 'accent' : 'neutral'}>{p.jobLabel} · {p.jobGrade}</Badge>}
          {p.inPrison && <Badge tone="danger">En prisión · {p.prisonRemaining} meses</Badge>}
          {p.bans.some((b) => b.active) && (
            <Badge tone="danger">
              <Ban size={11} /> Baneado
            </Badge>
          )}
        </div>
      </div>
      <div className="text-right text-sm">
        <p className="text-ink-faint">Efectivo <span className="text-ink">{formatMoney(p.cash)}</span></p>
        <p className="text-ink-faint">Banco <span className="text-ink">{formatMoney(p.bank)}</span></p>
        <p className="text-xs text-ink-faint">Últ. conexión {relativeTime(p.lastLoggedOut)}</p>
      </div>
    </Card>
  )
}

function SummaryTab({ player: p }: { player: StaffPlayerDetail }) {
  return (
    <Card className="p-5">
      <SectionTitle>Identidad</SectionTitle>
      <dl>
        <KeyVal label="Personaje" value={p.name} />
        <KeyVal label="Citizen ID" value={<span className="font-mono">{p.citizenid}</span>} />
        <KeyVal label="Teléfono" value={p.phone ?? '—'} />
        <KeyVal label="Trabajo" value={`${p.jobLabel ?? '—'} (${p.jobGrade ?? '—'})`} />
      </dl>
      {p.bans.length > 0 && (
        <>
          <SectionTitle>
            <span className="mt-4 inline-flex items-center gap-2">
              <Ban size={14} /> Bans
            </span>
          </SectionTitle>
          {p.bans.map((b, i) => (
            <KeyVal
              key={i}
              label={b.source === 'bans' ? 'Bans (qbox)' : 'Bans (qs-admin)'}
              value={
                <span className="inline-flex items-center gap-2">
                  {b.reason ?? '—'} · por {b.bannedBy ?? '—'}
                  <Badge tone={b.active ? 'danger' : 'neutral'}>{b.active ? 'Activo' : 'Revocado'}</Badge>
                </span>
              }
            />
          ))}
        </>
      )}
    </Card>
  )
}

function PenaltiesTab({ citizenid }: { citizenid: string }) {
  const { data: me } = useMe()
  const canMutate = me?.staffPermissions?.includes('sanctions') ?? false
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useStaffPenalties(citizenid)
  const [form, setForm] = useState({ fine: '500', months: '0', charges: '', job: 'police' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['staff-penalties', citizenid] })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const charges = form.charges.split(',').map((c) => c.trim()).filter(Boolean)
    if (!charges.length) {
      setError('Indica al menos un cargo.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await api.staffAddPenalty(citizenid, {
        fine: Number(form.fine) || 0,
        months: Number(form.months) || 0,
        charges,
        job: form.job || 'police',
      })
      setForm({ ...form, charges: '' })
      await invalidate()
    } catch {
      setError('No se pudo aplicar la sanción (¿escritura no configurada?)')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: number) {
    setBusy(true)
    try {
      await api.staffDeletePenalty(id)
      await invalidate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      {canMutate && (
      <Card className="p-4">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <Plus size={14} /> Nueva sanción
          </span>
        </SectionTitle>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-ink-faint">
            Multa ($)
            <input
              type="number" min="0" required value={form.fine}
              onChange={(e) => setForm({ ...form, fine: e.target.value })}
              className="mt-1 block w-28 rounded-md border border-line bg-card-hover px-2 py-1.5 text-sm text-ink"
            />
          </label>
          <label className="text-xs text-ink-faint">
            Meses
            <input
              type="number" min="0" value={form.months}
              onChange={(e) => setForm({ ...form, months: e.target.value })}
              className="mt-1 block w-20 rounded-md border border-line bg-card-hover px-2 py-1.5 text-sm text-ink"
            />
          </label>
          <label className="min-w-52 flex-1 text-xs text-ink-faint">
            Cargos (separados por coma)
            <input
              type="text" required value={form.charges}
              onChange={(e) => setForm({ ...form, charges: e.target.value })}
              placeholder="Conducción temeraria, resistencia"
              className="mt-1 block w-full rounded-md border border-line bg-card-hover px-2 py-1.5 text-sm text-ink"
            />
          </label>
          <button
            type="submit" disabled={busy}
            className="rounded-md border border-accent-deep/60 bg-accent-deep/25 px-3 py-1.5 text-sm font-medium text-accent-strong transition-colors hover:bg-accent-deep/40 disabled:opacity-50"
          >
            Aplicar
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-danger-strong">{error}</p>}
      </Card>
      )}
      {!canMutate && (
        <p className="text-xs text-ink-faint">
          Tu rol permite ver sanciones, no modificarlas.
        </p>
      )}

      {isLoading ? (
        <Skeleton className="h-24" />
      ) : isError ? (
        <ErrorState description="No se pudieron cargar las sanciones." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <p className="text-sm text-ink-faint">Sin sanciones registradas.</p>
      ) : (
        <div className="space-y-2">
          {data.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">
                  {(p.charges[0]?.label as string | undefined) ?? `Sanción #${p.id}`}
                  {p.charges.length > 1 ? ` (+${p.charges.length - 1})` : ''}
                </p>
                <p className="text-xs text-ink-faint">
                  {p.appliedBy ?? '—'} · {p.appliedAt ?? '—'}
                </p>
              </div>
              <span className="text-sm font-medium text-ink">{formatMoney(p.totalFine)}</span>
              {p.totalMonths > 0 && <Badge tone="danger">{p.totalMonths} meses</Badge>}
              <Badge tone={p.payed ? 'accent' : 'warm'}>{p.payed ? 'Pagada' : 'Pendiente'}</Badge>
              {canMutate && (
              <button
                type="button" onClick={() => void remove(p.id)} disabled={busy}
                aria-label={`Eliminar sanción ${p.id}`}
                className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-rust-500/15 hover:text-danger-strong disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function InventoryTab({ citizenid }: { citizenid: string }) {
  const { data, isLoading, isError, refetch } = useStaffInventory(citizenid)

  return (
    <div>
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : isError ? (
        <ErrorState description="No se pudo cargar el inventario." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <p className="text-sm text-ink-faint">Inventario vacío.</p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line-soft text-left text-xs text-ink-faint">
                <th className="px-4 py-2 font-medium">Slot</th>
                <th className="px-4 py-2 font-medium">Ítem</th>
                <th className="px-4 py-2 font-medium">Cantidad</th>
                <th className="hidden px-4 py-2 font-medium sm:table-cell">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {data.map((it, i) => (
                <tr key={`${it.name}:${it.slot ?? i}`}>
                  <td className="px-4 py-2 font-mono text-xs text-ink-faint">{it.slot ?? '—'}</td>
                  <td className="px-4 py-2 text-ink">
                    {it.label ?? it.name}
                    <span className="ml-2 font-mono text-xs text-ink-faint">{it.name}</span>
                  </td>
                  <td className="px-4 py-2 text-ink">×{it.amount}</td>
                  <td className="hidden max-w-48 truncate px-4 py-2 text-xs text-ink-faint sm:table-cell">
                    {Object.keys(it.info).length ? JSON.stringify(it.info) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

function VehiclesTab({ citizenid }: { citizenid: string }) {
  const { data: me } = useMe()
  const canMutate = me?.staffPermissions?.includes('vehicles') ?? false
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useStaffVehicles(citizenid)
  const [busy, setBusy] = useState<string | null>(null)

  async function setState(plate: string, state: number, garage?: string) {
    setBusy(plate)
    try {
      await api.staffUpdateVehicle(plate, { state, ...(garage ? { garage } : {}) })
      await queryClient.invalidateQueries({ queryKey: ['staff-vehicles', citizenid] })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      {isLoading ? (
        <Skeleton className="h-32" />
      ) : isError ? (
        <ErrorState description="No se pudieron cargar los vehículos." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <p className="text-sm text-ink-faint">Sin vehículos.</p>
      ) : (
        <div className="space-y-2">
          {data.map((v) => (
            <Card key={v.id} className="flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">
                  {v.tag ? `${v.tag} (${v.model})` : v.model}
                  <span className="ml-2 font-mono text-xs text-ink-faint">{v.plate}</span>
                </p>
                <p className="text-xs text-ink-faint">{v.garage ?? '—'}</p>
              </div>
              <Badge tone={v.state === 'impound' ? 'danger' : v.state === 'garage' ? 'accent' : 'neutral'}>
                {VEHICLE_STATE_LABEL[v.state]}
              </Badge>
              {canMutate && (
              <div className="flex gap-1.5">
                <button
                  type="button" disabled={busy === v.plate}
                  onClick={() => void setState(v.plate, 1)}
                  className="rounded-md border border-line px-2 py-1 text-xs text-ink-dim transition-colors hover:bg-card-hover disabled:opacity-50"
                >
                  A garaje
                </button>
                <button
                  type="button" disabled={busy === v.plate}
                  onClick={() => void setState(v.plate, 2)}
                  className="rounded-md border border-line px-2 py-1 text-xs text-ink-dim transition-colors hover:bg-card-hover disabled:opacity-50"
                >
                  Incautar
                </button>
                <button
                  type="button" disabled={busy === v.plate}
                  onClick={() => void setState(v.plate, 0)}
                  className="rounded-md border border-line px-2 py-1 text-xs text-ink-dim transition-colors hover:bg-card-hover disabled:opacity-50"
                >
                  Liberar
                </button>
              </div>
              )}
            </Card>
          ))}
        </div>
      )}
      {!canMutate && data && data.length > 0 && (
        <p className="mt-2 text-xs text-ink-faint">
          Tu rol permite ver vehículos, no moverlos de garaje.
        </p>
      )}
    </div>
  )
}

function AuditSection({ active }: { active: boolean }) {
  const { data } = useStaffAudit(active)
  if (!active || !data?.length) return null

  return (
    <section aria-label="Registro de acciones">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <ScrollText size={14} /> Registro de acciones del staff
        </span>
      </SectionTitle>
      <Card className="divide-y divide-line-soft">
        {data.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-2 px-4 py-2 text-sm">
            <Badge>{a.action}</Badge>
            <span className="font-mono text-xs text-ink-faint">{a.target}</span>
            {a.detail && <span className="truncate text-xs text-ink-faint">{a.detail}</span>}
            <span className="ml-auto text-xs text-ink-faint">
              {a.actorName ?? a.actorDiscordId} · {formatDateTime(a.createdAt)}
            </span>
          </div>
        ))}
      </Card>
    </section>
  )
}
