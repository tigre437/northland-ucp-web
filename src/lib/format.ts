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

export const INVOICE_STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente',
  partially_paid: 'Parcialmente pagada',
  paid: 'Pagada',
  cancelled: 'Cancelada',
  void: 'Anulada',
}

export const BUSINESS_KIND_LABEL: Record<string, string> = {
  shop: 'Tienda',
  restaurant: 'Restaurante',
  mechanic: 'Taller',
  motel: 'Motel',
  agency: 'Inmobiliaria',
}

export const JOB_STAT_LABEL: Record<string, string> = {
  fisher: 'Pesca',
  miner: 'Minería',
  lumberjack: 'Leñador',
  hunter: 'Caza',
  busdriver: 'Conductor de bus',
  taxi: 'Taxi',
  truckdriver: 'Camionero',
}

/** Segundos → "8 h 12 min". */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 min'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
