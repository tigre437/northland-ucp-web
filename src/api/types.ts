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
  /** true si el usuario tiene acceso al panel de staff. */
  staff: boolean
  /** Permisos granulares por rol de Discord: 'view' | 'sanctions' | 'vehicles'. */
  staffPermissions?: string[]
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
  photoUrl: string | null
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

// ── Facturación y banca ──────────────────────────────────────────

export interface Invoice {
  id: number
  reference: string
  status: string
  category: string
  issuerName: string | null
  issuerJob: string | null
  society: string | null
  targetCitizenid: string | null
  targetName: string | null
  subtotal: number
  taxTotal: number
  discountTotal: number
  total: number
  paidAmount: number
  currency: string
  lines: Record<string, unknown>[]
  dueAt: string | null
  paidAt: string | null
  createdAt: string | null
}

export interface BankAccount {
  id: string
  amount: number
  isFrozen: boolean
  transactions: Record<string, unknown>[]
}

export interface BankCard {
  id: number
  cardNumber: string
  ownerName: string | null
  valid: string | null
  cardType: string | null
  active: boolean
}

export interface BankLoan {
  id: number
  status: string
  amount: number
  total: number
  paid: number
  instalments: number
  paidInstalments: number
  missed: number
  reason: string | null
  house: string | null
  nextPayment: string | null
  created: string | null
}

export interface BankTxn {
  id: number
  amount: number
  type: string | null
  date: string | null
}

export interface Finances {
  accounts: BankAccount[]
  cards: BankCard[]
  loans: BankLoan[]
  history: BankTxn[]
}

// ── Expediente policial y documentos ─────────────────────────────

export interface PoliceBadge {
  job: string
  badge: string
}

export interface Penalty {
  id: number
  job: string | null
  appliedBy: string | null
  totalFine: number
  payed: boolean
  totalMonths: number
  charges: Record<string, unknown>[]
  appliedAt: string | null
}

export interface PoliceReport {
  id: number
  title: string
  content: string
  job: string
  location: string | null
  createdAt: string | null
}

export interface PrisonStatus {
  inPrison: boolean
  months: number | null
  remainingMonths: number | null
}

export interface CharacterRecord {
  citizenid: string
  profilePic: string | null
  dangerous: boolean
  wanted: boolean
  badges: PoliceBadge[]
  penalties: Penalty[]
  reports: PoliceReport[]
  prison: PrisonStatus
}

export interface LicenseDoc {
  id: number
  citizenid: string | null
  templateId: string | null
  templateName: string | null
  status: string
  issuedBy: string | null
  generatedId: string | null
  issuedAt: string | null
  expiresAt: string | null
  photoUrl: string | null
  points: number
}

// ── Negocios e inmobiliaria ──────────────────────────────────────

export type BusinessKind = 'shop' | 'restaurant' | 'mechanic' | 'motel' | 'agency'

export interface Business {
  kind: BusinessKind
  id: string
  label: string
  role: 'owner' | 'employee' | 'member'
  balance: number | null
  detail: string | null
  isOpen: boolean | null
}

export interface AgencyListing {
  id: number
  houseName: string
  listPrice: number
  status: string
  soldPrice: number | null
  listedAt: string | null
  soldAt: string | null
}

export interface Agency {
  id: number
  name: string
  label: string
  isBoss: boolean
  rankName: string | null
  salesCount: number
  totalCommission: number
  listings: AgencyListing[]
}

// ── Estadísticas de actividad ────────────────────────────────────

export type JobStatKind =
  | 'fisher' | 'miner' | 'lumberjack' | 'hunter'
  | 'busdriver' | 'taxi' | 'truckdriver'

export interface JobStat {
  kind: JobStatKind
  citizenid: string
  level: number
  experience: number
  totalExperience: number
  totalEarnings: number
  dailyExperience: number
  dailyEarnings: number
}

export interface GymStat {
  citizenid: string
  strength: number
  stamina: number
  membershipActive: boolean
}

export interface RacingStat {
  name: string | null
  tag: string | null
  elo: number
  races: number
}

export interface WorkHours {
  citizenid: string
  job: string
  sessions: number
  totalSeconds: number
}

export interface ActivityStats {
  jobs: JobStat[]
  gym: GymStat | null
  racing: RacingStat | null
  workHours: WorkHours[]
}

// ── Avisos ───────────────────────────────────────────────────────

export type NotificationKind = 'invoice' | 'impound' | 'rent' | 'prison' | 'loan' | 'server'

export interface UcpNotification {
  kind: NotificationKind
  severity: 'info' | 'warn' | 'alert'
  title: string
  description: string | null
  href: string | null
}

// ── Panel de staff ───────────────────────────────────────────────

export interface PlayerSearchResult {
  citizenid: string
  cid: number | null
  name: string
  jobLabel: string | null
  lastLoggedOut: string | null
}

export interface InventoryItem {
  slot: number | null
  name: string
  label: string | null
  amount: number
  type: string | null
  info: Record<string, unknown>
}

export interface BanEntry {
  source: 'bans' | 'qs_admin_bans'
  reason: string | null
  bannedBy: string | null
  expiresAt: number | null
  active: boolean
}

export interface StaffPlayerDetail {
  citizenid: string
  cid: number | null
  userId: number | null
  name: string
  licenseMasked: string | null
  phone: string | null
  cash: number
  bank: number
  jobName: string | null
  jobLabel: string | null
  jobGrade: string | null
  onDuty: boolean
  inPrison: boolean
  prisonRemaining: number | null
  bans: BanEntry[]
  lastLoggedOut: string | null
}

export interface StaffPenalty {
  id: number
  job: string | null
  appliedBy: string | null
  totalFine: number
  payed: boolean
  totalMonths: number
  charges: Record<string, unknown>[]
  appliedAt: string | null
}

export interface AuditEntry {
  id: number
  actorDiscordId: string
  actorName: string | null
  action: string
  target: string
  detail: string | null
  createdAt: string | null
}

export interface NewPenalty {
  fine: number
  months: number
  charges: string[]
  job: string
}

export interface WriteResult {
  ok: boolean
  id: number | null
  message: string | null
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
  getInvoices(): Promise<Invoice[]>
  getFinances(): Promise<Finances>
  getRecords(): Promise<CharacterRecord[]>
  getLicenses(): Promise<LicenseDoc[]>
  getBusinesses(): Promise<Business[]>
  getAgencies(): Promise<Agency[]>
  getStats(): Promise<ActivityStats>
  getNotifications(): Promise<UcpNotification[]>
  getServerInfo(): Promise<ServerInfo>
  // staff
  staffSearch(q: string): Promise<PlayerSearchResult[]>
  staffPlayer(citizenid: string): Promise<StaffPlayerDetail>
  staffInventory(citizenid: string): Promise<InventoryItem[]>
  staffVehicles(citizenid: string): Promise<Vehicle[]>
  staffPenalties(citizenid: string): Promise<StaffPenalty[]>
  staffAddPenalty(citizenid: string, penalty: NewPenalty): Promise<WriteResult>
  staffDeletePenalty(penaltyId: number): Promise<WriteResult>
  staffUpdateVehicle(plate: string, update: { garage?: string; state?: number }): Promise<WriteResult>
  staffAudit(): Promise<AuditEntry[]>
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
