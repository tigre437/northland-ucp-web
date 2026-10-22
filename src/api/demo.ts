import { ApiError } from './types'
import type {
  ActivityStats,
  Agency,
  AuditEntry,
  Business,
  Character,
  CharacterRecord,
  Finances,
  GuildRole,
  InventoryItem,
  Invoice,
  LicenseDoc,
  Me,
  NewBan,
  NewPenalty,
  NewSanction,
  PlayerSearchResult,
  Property,
  RoleGrant,
  SanctionEntry,
  ServerInfo,
  StaffPenalty,
  StaffPlayerDetail,
  UcpApi,
  UcpNotification,
  Vehicle,
  WriteResult,
} from './types'
import {
  demoAgencies,
  demoAudit,
  demoBusinesses,
  demoCharacters,
  demoFinances,
  demoGuildRoles,
  demoInvoices,
  demoLicenses,
  demoMe,
  demoNotifications,
  demoProperties,
  demoRecords,
  demoRoleGrants,
  demoSanctions,
  demoServerInfo,
  demoStaffInventory,
  demoStaffPenalties,
  demoStaffPlayer,
  demoStaffSearch,
  demoStats,
  demoVehicles,
} from './demo-data'

const latency = () => new Promise((r) => setTimeout(r, 200 + Math.random() * 350))

/**
 * API de demostración: sirve fixtures locales sin tocar la red.
 * Solo activa con VITE_API_MODE=demo. El estado de sesión es en memoria.
 */
export class DemoApi implements UcpApi {
  private loggedIn = true

  loginUrl(): string {
    return '#demo'
  }

  async login(): Promise<void> {
    await latency()
    this.loggedIn = true
  }

  async getMe(): Promise<Me> {
    await latency()
    if (!this.loggedIn) throw new ApiError(401, 'unauthenticated', 'Sesión no iniciada')
    return demoMe
  }

  async getCharacters(): Promise<Character[]> {
    await latency()
    return demoCharacters
  }

  async getCharacter(citizenid: string): Promise<Character> {
    await latency()
    const char = demoCharacters.find((c) => c.citizenid === citizenid)
    if (!char) throw new ApiError(404, 'not_found', 'Personaje no encontrado')
    return char
  }

  async getProperties(): Promise<Property[]> {
    await latency()
    return demoProperties
  }

  async getVehicles(): Promise<Vehicle[]> {
    await latency()
    return demoVehicles
  }

  async getInvoices(): Promise<Invoice[]> {
    await latency()
    return demoInvoices
  }

  async getFinances(): Promise<Finances> {
    await latency()
    return demoFinances
  }

  async getRecords(): Promise<CharacterRecord[]> {
    await latency()
    return demoRecords
  }

  async getLicenses(): Promise<LicenseDoc[]> {
    await latency()
    return demoLicenses
  }

  async getBusinesses(): Promise<Business[]> {
    await latency()
    return demoBusinesses
  }

  async getAgencies(): Promise<Agency[]> {
    await latency()
    return demoAgencies
  }

  async getStats(): Promise<ActivityStats> {
    await latency()
    return demoStats
  }

  async getNotifications(): Promise<UcpNotification[]> {
    await latency()
    return demoNotifications
  }

  async getServerInfo(): Promise<ServerInfo> {
    await latency()
    return demoServerInfo
  }

  // ── Staff (demo) ────────────────────────────────────────────────

  async staffSearch(q: string): Promise<PlayerSearchResult[]> {
    await latency()
    const needle = q.toLowerCase()
    return demoStaffSearch.filter(
      (p) => p.name.toLowerCase().includes(needle) || p.citizenid.toLowerCase().includes(needle),
    )
  }

  async staffPlayer(citizenid: string): Promise<StaffPlayerDetail> {
    await latency()
    if (citizenid === demoStaffPlayer.citizenid) return demoStaffPlayer
    const found = demoStaffSearch.find((p) => p.citizenid === citizenid)
    if (!found) throw new ApiError(404, 'not_found', 'Jugador no encontrado')
    return { ...demoStaffPlayer, citizenid, name: found.name, bans: [], inPrison: false, prisonRemaining: null }
  }

  async staffInventory(): Promise<InventoryItem[]> {
    await latency()
    return demoStaffInventory
  }

  async staffVehicles(): Promise<Vehicle[]> {
    await latency()
    return demoVehicles
  }

  async staffPenalties(): Promise<StaffPenalty[]> {
    await latency()
    return demoStaffPenalties
  }

  async staffAddPenalty(_citizenid: string, penalty: NewPenalty): Promise<WriteResult> {
    await latency()
    demoStaffPenalties.unshift({
      id: Date.now() % 100000,
      job: penalty.job,
      appliedBy: 'Tigre437',
      totalFine: penalty.fine,
      payed: false,
      totalMonths: penalty.months,
      charges: penalty.charges.map((c) => ({ label: c, fine: 0, months: 0 })),
      appliedAt: new Date().toISOString().slice(0, 10),
    })
    return { ok: true, id: demoStaffPenalties[0].id, message: null }
  }

  async staffDeletePenalty(penaltyId: number): Promise<WriteResult> {
    await latency()
    const i = demoStaffPenalties.findIndex((p) => p.id === penaltyId)
    if (i >= 0) demoStaffPenalties.splice(i, 1)
    return { ok: true, id: penaltyId, message: null }
  }

  async staffCreateBan(_citizenid: string, ban: NewBan): Promise<WriteResult> {
    await latency()
    const id = Date.now() % 100000
    demoStaffPlayer.bans.unshift({
      id,
      source: 'qs_admin_bans',
      reason: ban.reason,
      bannedBy: 'Tigre437',
      createdAt: Math.floor(Date.now() / 1000),
      expiresAt: ban.expiresAt ?? null,
      active: true,
    })
    return { ok: true, id, message: null }
  }

  async staffSanctions(): Promise<SanctionEntry[]> {
    await latency()
    return demoSanctions
  }

  async staffAddSanction(_citizenid: string, s: NewSanction): Promise<WriteResult> {
    await latency()
    const id = Date.now() % 100000
    demoSanctions.unshift({
      id,
      type: s.type,
      reason: s.reason,
      appliedBy: 'Tigre437',
      createdAt: s.type === 'ban' ? String(Math.floor(Date.now() / 1000)) : new Date().toISOString().slice(0, 19).replace('T', ' '),
      expiresAt: s.type === 'ban' && s.durationValue ? Math.floor(Date.now() / 1000) + s.durationValue * 86400 : null,
      active: s.type === 'ban' ? true : null,
      pending: s.type !== 'ban' ? true : null,
      result: null,
    })
    return { ok: true, id, message: null }
  }

  async staffRevokeBan(banId: number): Promise<WriteResult> {
    await latency()
    const b = demoStaffPlayer.bans.find((x) => x.id === banId)
    if (b) b.active = false
    return { ok: true, id: banId, message: null }
  }

  async staffUpdateVehicle(plate: string, update: { garage?: string; state?: number }): Promise<WriteResult> {
    await latency()
    const v = demoVehicles.find((x) => x.plate === plate)
    if (v) {
      if (update.garage) v.garage = update.garage
      if (update.state != null) v.state = update.state === 1 ? 'garage' : update.state === 2 ? 'impound' : 'out'
    }
    return { ok: true, id: null, message: null }
  }

  async staffDeleteVehicle(plate: string): Promise<WriteResult> {
    await latency()
    const i = demoVehicles.findIndex((x) => x.plate === plate)
    if (i >= 0) demoVehicles.splice(i, 1)
    return { ok: true, id: null, message: null }
  }

  async staffTransferVehicle(plate: string, _citizenid: string): Promise<WriteResult> {
    await latency()
    return { ok: true, id: null, message: demoVehicles.some((x) => x.plate === plate) ? null : 'Vehículo no encontrado' }
  }

  async staffAudit(): Promise<AuditEntry[]> {
    await latency()
    return demoAudit
  }

  async staffGuildRoles(): Promise<GuildRole[]> {
    await latency()
    return demoGuildRoles
  }

  async staffRoleGrants(): Promise<RoleGrant[]> {
    await latency()
    return demoRoleGrants
  }

  async staffSetRoleGrant(roleId: string, grant: { perms: string[]; roleName?: string }): Promise<RoleGrant> {
    await latency()
    const existing = demoRoleGrants.find((g) => g.roleId === roleId)
    if (existing) {
      existing.perms = [...grant.perms].sort()
      if (grant.roleName) existing.roleName = grant.roleName
      return existing
    }
    const g: RoleGrant = {
      id: Date.now() % 100000,
      roleId,
      roleName: grant.roleName ?? null,
      perms: [...grant.perms].sort(),
    }
    demoRoleGrants.push(g)
    return g
  }

  async staffDeleteRoleGrant(roleId: string): Promise<void> {
    await latency()
    const i = demoRoleGrants.findIndex((g) => g.roleId === roleId)
    if (i >= 0) demoRoleGrants.splice(i, 1)
  }

  async logout(): Promise<void> {
    await latency()
    this.loggedIn = false
  }
}
