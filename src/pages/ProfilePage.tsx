import { Gavel, Link2, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { api } from '@/api'
import { useCharacters, useMe, useMySanctions } from '@/hooks/api'
import { formatDateTime } from '@/lib/format'
import { PageLoader } from '@/components/ui/feedback'
import { Avatar, Badge, Card, KeyVal, PageHeader, SectionTitle } from '@/components/ui/surfaces'

export function ProfilePage() {
  const { data: me, isLoading } = useMe()
  const characters = useCharacters()
  const sanctions = useMySanctions(Boolean(me?.link.linked))
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  if (isLoading || !me) return <PageLoader />

  const displayName = me.discord.globalName ?? me.discord.username

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await api.logout()
    } finally {
      queryClient.clear()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div>
      <PageHeader title="Mi cuenta" subtitle="Tu cuenta de Discord y su vinculación con el servidor." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle>Discord</SectionTitle>
          <div className="mb-4 flex items-center gap-3">
            <Avatar url={me.discord.avatarUrl} name={displayName} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-display font-semibold text-ink">{displayName}</p>
              <p className="truncate text-sm text-ink-faint">@{me.discord.username}</p>
            </div>
          </div>
          <dl>
            <KeyVal label="ID de Discord" value={<span className="font-mono text-xs">{me.discord.id}</span>} />
          </dl>
        </Card>

        <Card className="p-5">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Link2 size={14} /> Vinculación con el servidor
            </span>
          </SectionTitle>
          {me.link.linked ? (
            <>
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-accent-strong" />
                <p className="text-sm font-medium text-accent-strong">Cuenta vinculada</p>
              </div>
              <dl>
                <KeyVal label="Usuario FiveM" value={me.link.fivemUsername ?? '—'} />
                <KeyVal
                  label="Licencia"
                  value={<span className="font-mono text-xs">{me.link.license ?? '—'}</span>}
                />
                <KeyVal
                  label="Personajes"
                  value={characters.data ? String(characters.data.length) : '…'}
                />
              </dl>
            </>
          ) : (
            <div className="space-y-2 text-sm text-ink-dim">
              <Badge tone="warm">Sin vincular</Badge>
              <p>
                Todavía no hay una cuenta de FiveM asociada a tu Discord. Conéctate al servidor con
                Discord vinculado en tu cliente de FiveM para completar la asociación.
              </p>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <SectionTitle>Sesión</SectionTitle>
          <dl>
            <KeyVal label="Inicio de sesión" value={formatDateTime(me.session.createdAt)} />
            <KeyVal label="Caduca" value={formatDateTime(me.session.expiresAt)} />
          </dl>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-rust-500/50 bg-rust-500/10 px-3.5 py-2 text-sm font-medium text-danger-strong transition-colors hover:bg-rust-500/20 disabled:opacity-50"
          >
            <LogOut size={15} />
            {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </Card>

        {me.link.linked && (
          <Card className="p-5 lg:col-span-2">
            <SectionTitle>
              <span className="inline-flex items-center gap-2">
                <Gavel size={14} /> Historial de sanciones
              </span>
            </SectionTitle>
            {sanctions.isLoading ? (
              <p className="text-sm text-ink-faint">Cargando…</p>
            ) : !sanctions.data?.length ? (
              <p className="text-sm text-ink-faint">
                Sin sanciones — tu expediente administrativo está limpio.
              </p>
            ) : (
              <ul className="space-y-2">
                {sanctions.data.map((s) => (
                  <li
                    key={`${s.type}-${s.id}`}
                    className="flex flex-wrap items-center gap-2 rounded-md border border-line-soft px-3 py-2 text-sm"
                  >
                    <Badge
                      tone={s.type === 'ban' ? 'danger' : s.type === 'kick' ? 'warm' : 'neutral'}
                    >
                      {s.type === 'ban' ? 'Ban' : s.type === 'kick' ? 'Kick' : 'Aviso'}
                    </Badge>
                    <span className="min-w-0 flex-1 text-ink">
                      {s.reason ?? '—'}
                      {s.characterName && (
                        <span className="text-ink-faint"> · {s.characterName}</span>
                      )}
                      <span className="text-ink-faint">
                        {s.createdAt && <> · {formatDateTime(s.createdAt)}</>}
                        {s.type === 'ban' && s.expiresAt != null && (
                          <> · expira {formatDateTime(new Date(s.expiresAt * 1000).toISOString())}</>
                        )}
                      </span>
                    </span>
                    {s.type === 'ban' && (
                      <Badge tone={s.active ? 'danger' : 'neutral'}>
                        {s.active
                          ? s.expiresAt
                            ? 'Activo'
                            : 'Permanente'
                          : s.revoked
                            ? 'Revocado'
                            : 'Cumplido'}
                      </Badge>
                    )}
                    {s.type !== 'ban' && (
                      <Badge tone={s.pending ? 'warm' : 'neutral'}>
                        {s.pending ? 'Pendiente' : s.result === 'offline' ? 'Offline' : 'Ejecutado'}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
