/**
 * Contrato de la API del UCP — debe mantenerse sincronizado con
 * los schemas de `northland-ucp-api` (app/schemas/).
 */

export interface DiscordProfile {
  id: string
  username: string
  globalName: string | null
  avatarUrl: string | null
}

export interface SessionInfo {
  createdAt: string
  expiresAt: string
}

export interface LinkStatus {
  linked: boolean
  /** Licencia de Rockstar asociada, parcialmente enmascarada. */
  license: string | null
  /** Nombre de usuario de FiveM (tabla users.username). */
  fivemUsername: string | null
}

export interface Me {
  discord: DiscordProfile
  link: LinkStatus
  session: SessionInfo
  csrfToken: string
}

export interface JobInfo {
  name: string
  label: string
  type: string | null
  gradeName: string
  gradeLevel: number
  onDuty: boolean
  payment: number
}

export interface MoneyInfo {
  cash: number
  bank: number
  crypto: number
}

export interface GangInfo {
  name: string
  label: string
  gradeName: string
}

export interface Character {
  citizenid: string
  cid: number | null
  firstname: string
  lastname: string
  nationality: string | null
  birthdate: string | null
  gender: number | null
  phone: string | null
  job: JobInfo | null
  gang: GangInfo | null
  money: MoneyInfo
  licenses: Record<string, boolean>
  callsign: string | null
  lastUpdated: string | null
  lastLoggedOut: string | null
}

export type PropertyKind = 'house' | 'apartment' | 'motel' | 'garage'

export interface Property {
  kind: PropertyKind
  /** Identificador estable del recurso (house name, apartment name, motel+room…). */
  id: string
  label: string
  ownerCitizenid: string | null
  ownerName: string | null
  rented: boolean | null
  rentPrice: number | null
  price: number | null
  tier: number | null
  /** Información complementaria (motel, habitación, listing de agencia…). */
  detail: string | null
}

export type VehicleState = 'garage' | 'out' | 'impound' | 'unknown'

export interface Vehicle {
  id: number
  citizenid: string | null
  ownerName: string | null
  plate: string
  model: string
  /** Mote/renombre del vehículo (qs-advancedgarages). */
  tag: string | null
  garage: string | null
  state: VehicleState
  fuel: number | null
  engine: number | null
  body: number | null
  type: string | null
  favorite: boolean
  jobVehicle: boolean
}

export interface ServerInfo {
  name: string
  description: string | null
  discordInvite: string | null
  onlinePlayers: number | null
  maxPlayers: number | null
}

/** Contrato que cumplen la API real (HttpApi) y la de demostración (DemoApi). */
export interface UcpApi {
  loginUrl(): string
  /** Inicia sesión sin redirigir (solo modo demo). */
  login?(): Promise<void>
  getMe(): Promise<Me>
  getCharacters(): Promise<Character[]>
  getCharacter(citizenid: string): Promise<Character>
  getProperties(): Promise<Property[]>
  getVehicles(): Promise<Vehicle[]>
  getServerInfo(): Promise<ServerInfo>
  logout(): Promise<void>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
