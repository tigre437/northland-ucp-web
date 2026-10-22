const moneyFmt = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatMoney(value: number | null | undefined): string {
  if (value == null) return '—'
  return moneyFmt.format(value)
}

const dateFmt = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' })
const dateTimeFmt = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d)
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateTimeFmt.format(d)
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'ahora mismo'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `hace ${days} d`
  return formatDate(iso)
}

/** Fichero de utilidades del propietario de un personaje. */
export function fullName(firstname: string, lastname: string): string {
  return `${firstname} ${lastname}`.trim()
}

export const VEHICLE_STATE_LABEL: Record<string, string> = {
  garage: 'En garaje',
  out: 'Fuera',
  impound: 'Incautado',
  unknown: 'Desconocido',
}

export const PROPERTY_KIND_LABEL: Record<string, string> = {
  house: 'Casa',
  apartment: 'Apartamento',
  motel: 'Habitación de motel',
  garage: 'Garaje',
}
