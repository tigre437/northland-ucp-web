import {
  AlertTriangle,
  Ban,
  Car,
  Gavel,
  KeyRound,
  LogOut,
  Package,
  Plus,
  ScrollText,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { api, STAFF_PERMS } from '@/api'
import type { NewSanction, SanctionType, StaffPlayerDetail } from '@/api'
import {
  useMe,
  useStaffAudit,
  useStaffInventory,
  useStaffPenalties,
  useStaffPlayer,
  useStaffSanctions,
  useStaffSearch,
  useStaffVehicles,
} from '@/hooks/api'
import { formatDateTime, formatMoney, relativeTime, VEHICLE_STATE_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, KeyVal, PageHeader, SectionTitle } from '@/components/ui/surfaces'

type Tab = 'resumen' | 'sanciones' | 'multas' | 'inventario' | 'vehiculos'
type MainTab = 'jugadores' | 'ajustes'

const inputCls =
  'rounded-md border border-line bg-card-hover px-2 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none'
const btnCls =
  'rounded-md border border-line px-2 py-1 text-xs text-ink-dim transition-colors hover:bg-card-hover disabled:opacity-50'

export function StaffPage() {
  const { data: me } = useMe()
  const perms = new Set(me?.staffPermissions ?? [])
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('resumen')
  const [mainTab, setMainTab] = useState<MainTab>('jugadores')
  const search = useStaffSearch(q, perms.has('players.view'))
  const canManage = perms.has('roles.manage')

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
        subtitle="Búsqueda y gestión de jugadores: sanciones, inventario, vehículos y permisos."
      />

      {canManage && (
        <div className="flex gap-1 border-b border-line-soft" role="tablist">
          {(
            [
              { id: 'jugadores', label: 'Jugadores', icon: Search },
              { id: 'ajustes', label: 'Ajustes', icon: KeyRound },
            ] as { id: MainTab; label: string; icon: typeof Search }[]
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mainTab === id}
              onClick={() => setMainTab(id)}
              className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                mainTab === id
                  ? 'border-accent text-accent-strong'
                  : 'border-transparent text-ink-dim hover:text-ink'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}

      {mainTab === 'ajustes' && canManage ? (
        <PermsSection perms={perms} />
      ) : (
      <>
      {perms.has('players.view') && (
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
            className={`w-full py-2 pl-9 pr-3 ${inputCls}`}
          />
        </div>

        {(
          <p className="mt-3 text-xs text-ink-faint">
            {q.trim() ? 'Resultados' : 'Últimos jugadores activos'} — pulsa uno para ver su ficha.
          </p>
        )}
        {(
          <div className="mt-1 divide-y divide-line-soft">
            {search.isLoading ? (
              <Skeleton className="h-10" />
            ) : search.isError ? (
              <p className="py-2 text-sm text-danger-strong">Error al cargar jugadores.</p>
            ) : !search.data?.length ? (
              <p className="py-2 text-sm text-ink-faint">
                {q.trim() ? `Sin resultados para «${q}».` : 'Sin jugadores.'}
              </p>
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
      )}

      {selected ? (
        <PlayerPanel citizenid={selected} tab={tab} onTab={setTab} perms={perms} />
      ) : (
        <EmptyState
          icon={<ShieldCheck size={30} />}
          title="Selecciona un jugador"
          description="Elige un personaje de la lista para ver su ficha completa, inventario, vehículos y sanciones."
        />
      )}

      <AuditSection active={perms.has('audit.view')} />
      </>
      )}
    </div>
  )
}

const SANCTION_PERM: Record<SanctionType, string> = {
  warn: 'admin.warn',
  kick: 'admin.kick',
  ban: 'bans.create',
}

function PlayerPanel({
  citizenid,
  tab,
  onTab,
  perms,
}: {
  citizenid: string
  tab: Tab
  onTab: (t: Tab) => void
  perms: Set<string>
}) {
  const detail = useStaffPlayer(citizenid)
  const [sanctionPreset, setSanctionPreset] = useState<SanctionType | null>(null)

  const quickSanction = (type: SanctionType) => {
    setSanctionPreset(type)
    onTab('sanciones')
  }

  const allTabs: { id: Tab; label: string; icon: typeof Gavel; perm: string }[] = [
    { id: 'resumen', label: 'Resumen', icon: ShieldCheck, perm: 'players.view' },
    { id: 'sanciones', label: 'Sanciones', icon: Ban, perm: 'players.view' },
    { id: 'multas', label: 'Multas', icon: Gavel, perm: 'penalties.view' },
    { id: 'inventario', label: 'Inventario', icon: Package, perm: 'inventory.view' },
    { id: 'vehiculos', label: 'Vehículos', icon: Car, perm: 'vehicles.view' },
  ]
  const tabs = allTabs.filter((t) => perms.has(t.perm))

  return (
    <section aria-label={`Ficha de ${citizenid}`} className="space-y-4">
      {detail.isLoading ? (
        <Skeleton className="h-28" />
      ) : detail.isError ? (
        <ErrorState description="No se pudo cargar el jugador." onRetry={() => void detail.refetch()} />
      ) : detail.data ? (
        <PlayerHeader player={detail.data} perms={perms} onQuickSanction={quickSanction} />
      ) : null}

      {tabs.length > 1 && (
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
      )}

      {tab === 'resumen' && detail.data && <SummaryTab player={detail.data} perms={perms} />}
      {tab === 'sanciones' && perms.has('players.view') && (
        <SanctionsTab
          key={sanctionPreset ?? 'default'}
          citizenid={citizenid}
          perms={perms}
          initialType={sanctionPreset}
        />
      )}
      {tab === 'multas' && perms.has('penalties.view') && (
        <PenaltiesTab citizenid={citizenid} perms={perms} />
      )}
      {tab === 'inventario' && perms.has('inventory.view') && <InventoryTab citizenid={citizenid} />}
      {tab === 'vehiculos' && perms.has('vehicles.view') && (
        <VehiclesTab citizenid={citizenid} perms={perms} />
      )}
    </section>
  )
}

function PlayerHeader({
  player: p,
  perms,
  onQuickSanction,
}: {
  player: StaffPlayerDetail
  perms: Set<string>
  onQuickSanction: (type: SanctionType) => void
}) {
  const quickBtns: { type: SanctionType; label: string; icon: typeof Ban; cls: string }[] = [
    {
      type: 'warn', label: 'Avisar', icon: AlertTriangle,
      cls: 'border-amber-500/40 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400',
    },
    {
      type: 'kick', label: 'Kick', icon: LogOut,
      cls: 'border-orange-500/40 text-orange-600 hover:bg-orange-500/10 dark:text-orange-400',
    },
    {
      type: 'ban', label: 'Ban', icon: Ban,
      cls: 'border-danger/40 text-danger-strong hover:bg-danger/10',
    },
  ]
  const allowed = quickBtns.filter((b) => perms.has(SANCTION_PERM[b.type]))

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
      <div className="flex flex-col items-end gap-2">
        <div className="text-right text-sm">
          <p className="text-ink-faint">Efectivo <span className="text-ink">{formatMoney(p.cash)}</span></p>
          <p className="text-ink-faint">Banco <span className="text-ink">{formatMoney(p.bank)}</span></p>
          <p className="text-xs text-ink-faint">Últ. conexión {relativeTime(p.lastLoggedOut)}</p>
        </div>
        {allowed.length > 0 && (
          <div className="flex gap-1.5">
            {allowed.map(({ type, label, icon: Icon, cls }) => (
              <button
                key={type}
                type="button"
                onClick={() => onQuickSanction(type)}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${cls}`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

function SummaryTab({ player: p, perms }: { player: StaffPlayerDetail; perms: Set<string> }) {
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['staff-player', p.citizenid] })

  async function revoke(banId: number) {
    setBusy(true)
    try {
      await api.staffRevokeBan(banId)
      await invalidate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="p-5">
      <SectionTitle>Identidad</SectionTitle>
      <dl>
        <KeyVal label="Personaje" value={p.name} />
        <KeyVal label="Citizen ID" value={<span className="font-mono">{p.citizenid}</span>} />
        <KeyVal label="Teléfono" value={p.phone ?? '—'} />
        <KeyVal label="Trabajo" value={`${p.jobLabel ?? '—'} (${p.jobGrade ?? '—'})`} />
      </dl>

      <SectionTitle>
        <span className="mt-4 inline-flex items-center gap-2">
          <Ban size={14} /> Bans
        </span>
      </SectionTitle>
      {p.bans.length === 0 && <p className="text-sm text-ink-faint">Sin bans registrados.</p>}
      {p.bans.map((b, i) => (
        <div key={b.id ?? i} className="flex items-center gap-2 py-1.5 text-sm">
          <span className="flex-1 text-ink">
            {b.reason ?? '—'}
            <span className="ml-2 text-xs text-ink-faint">
              {b.source === 'bans' ? 'qbox' : 'qs-admin'} · por {b.bannedBy ?? '—'}
            </span>
          </span>
          <Badge tone={b.active ? 'danger' : 'neutral'}>{b.active ? 'Activo' : 'Revocado'}</Badge>
          {perms.has('bans.revoke') && b.source === 'qs_admin_bans' && b.active && b.id != null && (
            <button type="button" className={btnCls} disabled={busy} onClick={() => void revoke(b.id!)}>
              Desbanear
            </button>
          )}
        </div>
      ))}
    </Card>
  )
}

/** Sanciones de administración: avisos, kicks y bans con duración. */
function SanctionsTab({
  citizenid,
  perms,
  initialType,
}: {
  citizenid: string
  perms: Set<string>
  /** Tipo preseleccionado por el botón rápido del header. */
  initialType?: SanctionType | null
}) {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useStaffSanctions(citizenid)
  const [form, setForm] = useState({
    type: (initialType ?? 'warn') as SanctionType,
    reason: '',
    value: '',
    unit: 'days',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const can = (p: string) => perms.has(p)
  const canAny = can('admin.warn') || can('admin.kick') || can('bans.create')

  const typeLabel = { warn: 'Aviso', kick: 'Kick', ban: 'Ban' } as const

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['staff-sanctions', citizenid] })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const value = Number(form.value)
      await api.staffAddSanction(citizenid, {
        type: form.type,
        reason: form.reason,
        durationValue: form.type === 'ban' && form.unit !== 'permanent' && value > 0 ? value : null,
        durationUnit: (form.type === 'ban' ? form.unit : 'permanent') as NewSanction['durationUnit'],
      })
      setForm({ ...form, reason: '' })
      await invalidate()
    } catch {
      setError('No se pudo aplicar (¿permiso o escritura no configurada?)')
    } finally {
      setBusy(false)
    }
  }

  async function revokeBan(banId: number) {
    setBusy(true)
    try {
      await api.staffRevokeBan(banId)
      await invalidate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      {canAny && (
        <Card className="p-4">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Plus size={14} /> Nueva sanción
            </span>
          </SectionTitle>
          <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-ink-faint">
              Tipo
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                className={`mt-1 block ${inputCls}`}
              >
                <option value="warn" disabled={!can('admin.warn')}>Aviso</option>
                <option value="kick" disabled={!can('admin.kick')}>Kick</option>
                <option value="ban" disabled={!can('bans.create')}>Ban</option>
              </select>
            </label>
            {form.type === 'ban' && (
              <>
                <label className="text-xs text-ink-faint">
                  Duración
                  <input
                    type="number" min="1" value={form.value}
                    disabled={form.unit === 'permanent'}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className={`mt-1 block w-20 ${inputCls}`}
                  />
                </label>
                <label className="text-xs text-ink-faint">
                  Unidad
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className={`mt-1 block ${inputCls}`}
                  >
                    <option value="minutes">Minutos</option>
                    <option value="hours">Horas</option>
                    <option value="days">Días</option>
                    <option value="months">Meses</option>
                    <option value="permanent">Permanente</option>
                  </select>
                </label>
              </>
            )}
            <label className="min-w-52 flex-1 text-xs text-ink-faint">
              Motivo
              <input
                type="text" required value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="RDM, VDM, NLR…"
                className={`mt-1 block w-full ${inputCls}`}
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
          {(form.type === 'warn' || form.type === 'kick') && (
            <p className="mt-2 text-xs text-ink-faint">
              Se ejecuta dentro del juego cuando el jugador esté conectado
              (resource ucp_bridge).
            </p>
          )}
        </Card>
      )}

      {isLoading ? (
        <Skeleton className="h-24" />
      ) : isError ? (
        <ErrorState description="No se pudo cargar el historial." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <p className="text-sm text-ink-faint">Sin sanciones de administración.</p>
      ) : (
        <div className="space-y-2">
          {data.map((s) => (
            <Card key={`${s.type}:${s.id}`} className="flex flex-wrap items-center gap-3 p-3">
              <Badge tone={s.type === 'ban' ? 'danger' : s.type === 'kick' ? 'warm' : 'neutral'}>
                {typeLabel[s.type]}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{s.reason ?? '—'}</p>
                <p className="text-xs text-ink-faint">
                  {s.appliedBy ?? '—'} · {s.createdAt?.slice(0, 19).replace('T', ' ') ?? '—'}
                  {s.type === 'ban' && s.expiresAt != null && (
                    <> · expira {formatDateTime(new Date(s.expiresAt * 1000).toISOString())}</>
                  )}
                </p>
              </div>
              {s.type === 'ban' && (
                <Badge tone={s.active ? 'danger' : 'neutral'}>
                  {s.active ? (s.expiresAt ? 'Activo' : 'Permanente') : 'Expirado/Revocado'}
                </Badge>
              )}
              {s.type !== 'ban' && (
                <Badge tone={s.pending ? 'warm' : s.result === 'ok' ? 'accent' : 'neutral'}>
                  {s.pending ? 'Pendiente' : s.result === 'offline' ? 'Offline' : 'Ejecutado'}
                </Badge>
              )}
              {s.type === 'ban' && s.active && can('bans.revoke') && (
                <button type="button" className={btnCls} disabled={busy} onClick={() => void revokeBan(s.id)}>
                  Desbanear
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function PenaltiesTab({ citizenid, perms }: { citizenid: string; perms: Set<string> }) {
  const canCreate = perms.has('penalties.create')
  const canDelete = perms.has('penalties.delete')
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
      {canCreate && (
        <Card className="p-4">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Plus size={14} /> Nueva multa
            </span>
          </SectionTitle>
          <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
            <label className="text-xs text-ink-faint">
              Multa ($)
              <input
                type="number" min="0" required value={form.fine}
                onChange={(e) => setForm({ ...form, fine: e.target.value })}
                className={`mt-1 block w-28 ${inputCls}`}
              />
            </label>
            <label className="text-xs text-ink-faint">
              Meses
              <input
                type="number" min="0" value={form.months}
                onChange={(e) => setForm({ ...form, months: e.target.value })}
                className={`mt-1 block w-20 ${inputCls}`}
              />
            </label>
            <label className="min-w-52 flex-1 text-xs text-ink-faint">
              Cargos (separados por coma)
              <input
                type="text" required value={form.charges}
                onChange={(e) => setForm({ ...form, charges: e.target.value })}
                placeholder="Conducción temeraria, resistencia"
                className={`mt-1 block w-full ${inputCls}`}
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
      {!canCreate && !canDelete && (
        <p className="text-xs text-ink-faint">Tu rol permite ver multas, no modificarlas.</p>
      )}

      {isLoading ? (
        <Skeleton className="h-24" />
      ) : isError ? (
        <ErrorState description="No se pudieron cargar las multas." onRetry={() => void refetch()} />
      ) : !data?.length ? (
        <p className="text-sm text-ink-faint">Sin multas registradas.</p>
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
              {canDelete && (
                <button
                  type="button" onClick={() => void remove(p.id)} disabled={busy}
                  aria-label={`Eliminar multa ${p.id}`}
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

function VehiclesTab({ citizenid, perms }: { citizenid: string; perms: Set<string> }) {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useStaffVehicles(citizenid)
  const [busy, setBusy] = useState<string | null>(null)
  const [transferTo, setTransferTo] = useState<Record<string, string>>({})

  const can = (p: string) => perms.has(p)
  const anyMutation = ['vehicles.garage', 'vehicles.impound', 'vehicles.release', 'vehicles.give', 'vehicles.delete'].some(can)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['staff-vehicles', citizenid] })

  async function setState(plate: string, state: number, garage?: string) {
    setBusy(plate)
    try {
      await api.staffUpdateVehicle(plate, { state, ...(garage ? { garage } : {}) })
      await invalidate()
    } finally {
      setBusy(null)
    }
  }

  async function transfer(plate: string) {
    const cid = transferTo[plate]?.trim()
    if (!cid) return
    setBusy(plate)
    try {
      await api.staffTransferVehicle(plate, cid)
      await invalidate()
    } finally {
      setBusy(null)
    }
  }

  async function remove(plate: string) {
    setBusy(plate)
    try {
      await api.staffDeleteVehicle(plate)
      await invalidate()
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
            <Card key={v.id} className="p-3">
              <div className="flex flex-wrap items-center gap-3">
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
              </div>
              {anyMutation && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-line-soft pt-2">
                  {can('vehicles.garage') && (
                    <button type="button" className={btnCls} disabled={busy === v.plate} onClick={() => void setState(v.plate, 1)}>
                      A garaje
                    </button>
                  )}
                  {can('vehicles.impound') && (
                    <button type="button" className={btnCls} disabled={busy === v.plate} onClick={() => void setState(v.plate, 2)}>
                      Incautar
                    </button>
                  )}
                  {can('vehicles.release') && (
                    <button type="button" className={btnCls} disabled={busy === v.plate} onClick={() => void setState(v.plate, 0)}>
                      Liberar
                    </button>
                  )}
                  {can('vehicles.give') && (
                    <span className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={transferTo[v.plate] ?? ''}
                        onChange={(e) => setTransferTo({ ...transferTo, [v.plate]: e.target.value })}
                        placeholder="citizenid destino"
                        className={`w-36 ${inputCls}`}
                      />
                      <button
                        type="button" className={btnCls} disabled={busy === v.plate}
                        onClick={() => void transfer(v.plate)}
                      >
                        <UserPlus size={13} className="mr-0.5 inline" /> Dar
                      </button>
                    </span>
                  )}
                  {can('vehicles.delete') && (
                    <button
                      type="button"
                      className={`${btnCls} border-rust-500/50 text-danger-strong hover:bg-rust-500/15`}
                      disabled={busy === v.plate}
                      onClick={() => {
                        if (window.confirm(`¿Quitar el vehículo ${v.plate} al jugador? No se puede deshacer.`)) {
                          void remove(v.plate)
                        }
                      }}
                    >
                      <Trash2 size={12} className="mr-0.5 inline" /> Quitar
                    </button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      {!anyMutation && data && data.length > 0 && (
        <p className="mt-2 text-xs text-ink-faint">
          Tu rol permite ver vehículos, no modificarlos.
        </p>
      )}
    </div>
  )
}

/** Editor de la matriz rol de Discord → permisos de staff. */
function PermsSection({ perms }: { perms: Set<string> }) {
  const enabled = perms.has('roles.manage')
  const queryClient = useQueryClient()
  const [dirty, setDirty] = useState<Record<string, Set<string>>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const guildRoles = useQuery({
    queryKey: ['staff-guild-roles'] as const,
    queryFn: () => api.staffGuildRoles(),
    enabled,
    retry: false,
  })
  const grants = useQuery({
    queryKey: ['staff-role-grants'] as const,
    queryFn: () => api.staffRoleGrants(),
    enabled,
  })

  if (!enabled) return null

  const groups = [...new Set(STAFF_PERMS.map((p) => p.group))]

  function permsOf(roleId: string): Set<string> {
    if (dirty[roleId]) return dirty[roleId]
    const g = grants.data?.find((x) => x.roleId === roleId)
    return new Set(g?.perms ?? [])
  }

  function toggle(roleId: string, perm: string) {
    const next = new Set(permsOf(roleId))
    if (next.has(perm)) next.delete(perm)
    else next.add(perm)
    setDirty({ ...dirty, [roleId]: next })
  }

  async function save(roleId: string, roleName: string | null) {
    setSaving(roleId)
    setMsg(null)
    try {
      await api.staffSetRoleGrant(roleId, { perms: [...permsOf(roleId)], roleName: roleName ?? undefined })
      const next = { ...dirty }
      delete next[roleId]
      setDirty(next)
      await queryClient.invalidateQueries({ queryKey: ['staff-role-grants'] })
      setMsg(`Permisos de «${roleName ?? roleId}» guardados.`)
    } catch {
      setMsg('No se pudieron guardar los permisos.')
    } finally {
      setSaving(null)
    }
  }

  const alwaysAll = new Set((grants.data ?? []).filter((g) => g.alwaysAll).map((g) => g.roleId))

  const allRoles = [
    ...(guildRoles.data ?? []).map((r) => ({ roleId: r.id, roleName: r.name })),
    ...(grants.data ?? [])
      .filter((g) => !(guildRoles.data ?? []).some((r) => r.id === g.roleId))
      .map((g) => ({ roleId: g.roleId, roleName: g.roleName ?? g.roleId })),
  ]

  return (
    <section aria-label="Permisos de roles" className="space-y-3">
      <SectionTitle>
        <span className="inline-flex items-center gap-2">
          <KeyRound size={14} /> Permisos por rol de Discord
        </span>
      </SectionTitle>
      <Card className="p-4">
        {guildRoles.isError && (
          <p className="mb-3 text-xs text-warm-strong">
            No se pudo leer la lista de roles del Discord (¿bot sin configurar?) — se muestran solo
            los roles ya asignados.
          </p>
        )}
        {allRoles.length === 0 && !guildRoles.isLoading ? (
          <p className="text-sm text-ink-faint">
            Sin roles disponibles. Configura el bot de Discord o asigna roles manualmente.
          </p>
        ) : (
          <div className="space-y-4">
            {allRoles.map(({ roleId, roleName }) => {
              const isAdmin = alwaysAll.has(roleId)
              const current = isAdmin
                ? new Set(STAFF_PERMS.map((p) => p.id))
                : permsOf(roleId)
              const isDirty = !isAdmin && roleId in dirty
              return (
                <div key={roleId} className="border-b border-line-soft pb-4 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{roleName}</span>
                    <span className="font-mono text-xs text-ink-faint">{roleId}</span>
                    {isAdmin && (
                      <Badge tone="accent">Admin · siempre todos los permisos</Badge>
                    )}
                    {isDirty && (
                      <button
                        type="button"
                        onClick={() => void save(roleId, roleName)}
                        disabled={saving === roleId}
                        className="ml-auto rounded-md border border-accent-deep/60 bg-accent-deep/25 px-2.5 py-1 text-xs font-medium text-accent-strong hover:bg-accent-deep/40 disabled:opacity-50"
                      >
                        {saving === roleId ? 'Guardando…' : 'Guardar'}
                      </button>
                    )}
                  </div>
                  <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((group) => (
                      <div key={group}>
                        <p className="kicker mb-1">{group}</p>
                        {STAFF_PERMS.filter((p) => p.group === group).map((p) => (
                          <label
                            key={p.id}
                            className={`flex items-center gap-2 py-0.5 text-sm text-ink-dim ${isAdmin ? 'opacity-60' : 'cursor-pointer'}`}
                          >
                            <input
                              type="checkbox"
                              checked={current.has(p.id)}
                              disabled={isAdmin}
                              onChange={() => toggle(roleId, p.id)}
                              className="h-3.5 w-3.5 rounded border-line accent-olive-400"
                            />
                            {p.label}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {msg && <p className="mt-3 text-xs text-ink-faint">{msg}</p>}
      </Card>
    </section>
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
