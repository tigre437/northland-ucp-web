import { Activity, Briefcase, Dumbbell, Flag } from 'lucide-react'

import { useStats } from '@/hooks/api'
import { formatDuration, formatMoney, JOB_STAT_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/feedback'
import { Badge, Card, PageHeader, SectionTitle } from '@/components/ui/surfaces'

export function ActivityPage() {
  const { data, isLoading, isError, refetch } = useStats()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Actividad"
        subtitle="Progresión en trabajos, gimnasio, carreras y horas de servicio."
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : isError ? (
        <ErrorState description="No se pudieron cargar las estadísticas." onRetry={() => void refetch()} />
      ) : !data || (!data.jobs.length && !data.gym && !data.racing && !data.workHours.length) ? (
        <EmptyState
          icon={<Activity size={30} />}
          title="Sin actividad registrada"
          description="Aún no hay progresión en trabajos ni estadísticas para tus personajes."
        />
      ) : (
        <div className="space-y-6">
          {/* Progresión de minijuegos */}
          {data.jobs.length > 0 && (
            <section aria-label="Trabajos">
              <SectionTitle>
                <span className="inline-flex items-center gap-2">
                  <Briefcase size={14} /> Progresión en trabajos
                </span>
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.jobs.map((j) => (
                  <Card key={`${j.kind}:${j.citizenid}`} className="p-4">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display font-semibold text-ink">
                        {JOB_STAT_LABEL[j.kind] ?? j.kind}
                      </p>
                      <Badge tone="accent">Nivel {j.level}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">{j.citizenid}</p>
                    <dl className="mt-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-ink-faint">XP total</dt>
                        <dd className="text-ink">{j.totalExperience.toLocaleString('es-ES')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-ink-faint">Ganancias</dt>
                        <dd className="text-ink">{formatMoney(j.totalEarnings)}</dd>
                      </div>
                      {j.dailyEarnings > 0 && (
                        <div className="flex justify-between">
                          <dt className="text-ink-faint">Hoy</dt>
                          <dd className="text-ink">{formatMoney(j.dailyEarnings)}</dd>
                        </div>
                      )}
                    </dl>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Horas por empleo */}
          {data.workHours.length > 0 && (
            <section aria-label="Horas de servicio">
              <SectionTitle>Horas de servicio</SectionTitle>
              <Card className="divide-y divide-line-soft">
                {data.workHours.map((w) => (
                  <div
                    key={`${w.citizenid}:${w.job}`}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{w.job}</p>
                      <p className="text-xs text-ink-faint">
                        {w.citizenid} · {w.sessions} sesiones
                      </p>
                    </div>
                    <span className="font-display font-semibold text-ink">
                      {formatDuration(w.totalSeconds)}
                    </span>
                  </div>
                ))}
              </Card>
            </section>
          )}

          {/* Gym + carreras */}
          {(data.gym || data.racing) && (
            <section className="grid gap-3 sm:grid-cols-2" aria-label="Otros">
              {data.gym && (
                <Card className="p-5">
                  <SectionTitle>
                    <span className="inline-flex items-center gap-2">
                      <Dumbbell size={14} /> Gimnasio
                    </span>
                  </SectionTitle>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-faint">Fuerza</dt>
                      <dd className="text-ink">{data.gym.strength}/100</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-faint">Resistencia</dt>
                      <dd className="text-ink">{data.gym.stamina}/100</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-faint">Membresía</dt>
                      <dd className="text-ink">{data.gym.membershipActive ? 'Activa' : 'Sin membresía'}</dd>
                    </div>
                  </dl>
                </Card>
              )}
              {data.racing && (
                <Card className="p-5">
                  <SectionTitle>
                    <span className="inline-flex items-center gap-2">
                      <Flag size={14} /> Carreras
                    </span>
                  </SectionTitle>
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-faint">Piloto</dt>
                      <dd className="text-ink">
                        {data.racing.name ?? '—'}
                        {data.racing.tag ? ` [${data.racing.tag}]` : ''}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-faint">ELO</dt>
                      <dd className="text-ink">{data.racing.elo}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-faint">Carreras</dt>
                      <dd className="text-ink">{data.racing.races}</dd>
                    </div>
                  </dl>
                </Card>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
