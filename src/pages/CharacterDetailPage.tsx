import { ArrowLeft, Banknote, Briefcase, Car, Fingerprint, IdCard, KeyRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { useCharacter, useProperties, useVehicles } from '@/hooks/api'
import { formatDate, formatDateTime, formatMoney, fullName, VEHICLE_STATE_LABEL } from '@/lib/format'
import { EmptyState, ErrorState, PageLoader } from '@/components/ui/feedback'
import { Avatar, Badge, Card, KeyVal, SectionTitle } from '@/components/ui/surfaces'

const LICENSE_LABEL: Record<string, string> = {
  driver: 'Conducir',
  weapon: 'Armas',
  id: 'Identidad',
  fishing: 'Pesca',
  hunting: 'Caza',
}

export function CharacterDetailPage() {
  const { citizenid = '' } = useParams()
  const { data: c, isLoading, isError, error, refetch } = useCharacter(citizenid)
  const properties = useProperties()
  const vehicles = useVehicles()

  if (isLoading) return <PageLoader />
  if (isError || !c) {
    return (
      <div className="mx-auto max-w-md pt-10">
        <ErrorState
          title="Personaje no disponible"
          description={error instanceof Error ? error.message : 'No se pudo cargar el personaje.'}
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  const ownedProps = (properties.data ?? []).filter((p) => p.ownerCitizenid === c.citizenid)
  const ownedVehicles = (vehicles.data ?? []).filter((v) => v.citizenid === c.citizenid)
  const licenseEntries = Object.entries(c.licenses)

  return (
    <div className="space-y-6">
      <Link
        to="/personajes"
        className="inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} /> Personajes
      </Link>

      {/* Cabecera */}
      <Card className="flex flex-wrap items-center gap-4 p-5">
        <Avatar url={null} name={fullName(c.firstname, c.lastname)} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="panel-title text-xl">{fullName(c.firstname, c.lastname)}</h1>
          <p className="font-mono text-xs text-ink-faint">{c.citizenid}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.job && (
              <Badge tone={c.job.onDuty ? 'accent' : 'neutral'}>
                {c.job.label} · {c.job.gradeName}
              </Badge>
            )}
            {c.gang && c.gang.name !== 'none' && <Badge tone="warm">{c.gang.label}</Badge>}
          </div>
        </div>
        <div className="text-right">
          <p className="kicker">Última conexión</p>
          <p className="mt-1 text-sm text-ink">{formatDateTime(c.lastLoggedOut ?? c.lastUpdated)}</p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Identidad */}
        <Card className="p-5">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <IdCard size={14} /> Identidad
            </span>
          </SectionTitle>
          <dl>
            <KeyVal label="Nombre" value={fullName(c.firstname, c.lastname)} />
            <KeyVal label="Ciudadanía" value={c.nationality ?? '—'} />
            <KeyVal label="Nacimiento" value={formatDate(c.birthdate)} />
            <KeyVal label="Teléfono" value={c.phone ?? '—'} />
            <KeyVal label="CID" value={c.cid ?? '—'} />
          </dl>
        </Card>

        {/* Trabajo */}
        <Card className="p-5">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Briefcase size={14} /> Trabajo
            </span>
          </SectionTitle>
          {c.job ? (
            <dl>
              <KeyVal label="Empleo" value={c.job.label} />
              <KeyVal label="Rango" value={c.job.gradeName} />
              <KeyVal label="Estado" value={c.job.onDuty ? 'De servicio' : 'Fuera de servicio'} />
              <KeyVal label="Salario" value={formatMoney(c.job.payment)} />
              <KeyVal label="Placa / callsign" value={c.callsign ?? '—'} />
            </dl>
          ) : (
            <p className="text-sm text-ink-dim">Sin empleo registrado.</p>
          )}
        </Card>

        {/* Economía */}
        <Card className="p-5">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <Banknote size={14} /> Economía
            </span>
          </SectionTitle>
          <dl>
            <KeyVal label="Efectivo" value={formatMoney(c.money.cash)} />
            <KeyVal label="Banco" value={formatMoney(c.money.bank)} />
            {c.money.crypto > 0 && <KeyVal label="Cripto" value={formatMoney(c.money.crypto)} />}
          </dl>
        </Card>

        {/* Licencias */}
        <Card className="p-5">
          <SectionTitle>
            <span className="inline-flex items-center gap-2">
              <KeyRound size={14} /> Licencias
            </span>
          </SectionTitle>
          {licenseEntries.length ? (
            <div className="flex flex-wrap gap-1.5">
              {licenseEntries.map(([key, held]) => (
                <Badge key={key} tone={held ? 'accent' : 'neutral'}>
                  {LICENSE_LABEL[key] ?? key}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-dim">Sin licencias registradas.</p>
          )}
        </Card>
      </div>

      {/* Propiedades del personaje */}
      <Card className="p-5">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <Fingerprint size={14} /> Propiedades de este personaje
          </span>
        </SectionTitle>
        {properties.isLoading ? (
          <p className="text-sm text-ink-dim">Cargando…</p>
        ) : ownedProps.length ? (
          <ul className="space-y-1.5 text-sm">
            {ownedProps.map((p) => (
              <li key={p.id} className="flex justify-between gap-3">
                <span className="text-ink">{p.label}</span>
                <span className="text-ink-faint">{p.detail ?? p.kind}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-dim">Este personaje no tiene propiedades registradas.</p>
        )}
      </Card>

      {/* Vehículos del personaje */}
      <Card className="p-5">
        <SectionTitle>
          <span className="inline-flex items-center gap-2">
            <Car size={14} /> Vehículos de este personaje
          </span>
        </SectionTitle>
        {vehicles.isLoading ? (
          <p className="text-sm text-ink-dim">Cargando…</p>
        ) : ownedVehicles.length ? (
          <ul className="space-y-1.5 text-sm">
            {ownedVehicles.map((v) => (
              <li key={v.id} className="flex flex-wrap justify-between gap-3">
                <span className="font-mono text-ink">{v.plate}</span>
                <span className="text-ink">
                  {v.tag ? `${v.tag} (${v.model})` : v.model}
                </span>
                <span className="text-ink-faint">
                  {VEHICLE_STATE_LABEL[v.state]}
                  {v.garage ? ` · ${v.garage}` : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Car size={26} />}
            title="Sin vehículos"
            description="Este personaje no tiene vehículos registrados."
          />
        )}
      </Card>
    </div>
  )
}
