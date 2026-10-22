import { env } from '@/config/env'

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

interface ErrorBody {
  error?: { code?: string; message?: string }
}

/**
 * Cliente HTTP de la API real. Las credenciales viajan en la cookie de
 * sesión HttpOnly (`credentials: 'include'`); nunca se tocan tokens.
 */
export class HttpApi implements UcpApi {
  private csrfToken: string | null = null

  private url(path: string): string {
    return `${env.apiUrl}${env.apiPrefix}${path}`
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers)
    // ngrok free muestra una página de aviso que intercepta la primera
    // petición del navegador; esta cabecera oficial la omite.
    headers.set('ngrok-skip-browser-warning', '1')
    if (init?.method && init.method !== 'GET' && this.csrfToken) {
      headers.set('X-CSRF-Token', this.csrfToken)
    }

    let res: Response
    try {
      res = await fetch(this.url(path), {
        credentials: 'include',
        ...init,
        headers,
      })
    } catch {
      throw new ApiError(0, 'network', 'No se pudo contactar con el servidor')
    }

    if (!res.ok) {
      let code = 'unknown'
      let message = `Error ${res.status}`
      try {
        const body = (await res.json()) as ErrorBody
        code = body.error?.code ?? code
        message = body.error?.message ?? message
      } catch {
        /* cuerpo no JSON */
      }
      throw new ApiError(res.status, code, message)
    }

    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  loginUrl(): string {
    return this.url('/auth/discord/login')
  }

  async getMe(): Promise<Me> {
    const me = await this.request<Me>('/auth/me')
    this.csrfToken = me.csrfToken
    return me
  }

  getCharacters(): Promise<Character[]> {
    return this.request<Character[]>('/characters')
  }

  getCharacter(citizenid: string): Promise<Character> {
    return this.request<Character>(`/characters/${encodeURIComponent(citizenid)}`)
  }

  getProperties(): Promise<Property[]> {
    return this.request<Property[]>('/properties')
  }

  getVehicles(): Promise<Vehicle[]> {
    return this.request<Vehicle[]>('/vehicles')
  }

  getInvoices(): Promise<Invoice[]> {
    return this.request<Invoice[]>('/billing/invoices')
  }

  getFinances(): Promise<Finances> {
    return this.request<Finances>('/billing/finances')
  }

  getRecords(): Promise<CharacterRecord[]> {
    return this.request<CharacterRecord[]>('/records')
  }

  getLicenses(): Promise<LicenseDoc[]> {
    return this.request<LicenseDoc[]>('/licenses')
  }

  getBusinesses(): Promise<Business[]> {
    return this.request<Business[]>('/businesses')
  }

  getAgencies(): Promise<Agency[]> {
    return this.request<Agency[]>('/agencies')
  }

  getStats(): Promise<ActivityStats> {
    return this.request<ActivityStats>('/stats')
  }

  getNotifications(): Promise<UcpNotification[]> {
    return this.request<UcpNotification[]>('/notifications')
  }

  getServerInfo(): Promise<ServerInfo> {
    return this.request<ServerInfo>('/server/info')
  }

  // ── Staff ───────────────────────────────────────────────────────

  staffSearch(q: string): Promise<PlayerSearchResult[]> {
    return this.request<PlayerSearchResult[]>(`/staff/search?q=${encodeURIComponent(q)}`)
  }

  staffPlayer(citizenid: string): Promise<StaffPlayerDetail> {
    return this.request<StaffPlayerDetail>(`/staff/players/${encodeURIComponent(citizenid)}`)
  }

  staffInventory(citizenid: string): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>(`/staff/players/${encodeURIComponent(citizenid)}/inventory`)
  }

  staffVehicles(citizenid: string): Promise<Vehicle[]> {
    return this.request<Vehicle[]>(`/staff/players/${encodeURIComponent(citizenid)}/vehicles`)
  }

  staffPenalties(citizenid: string): Promise<StaffPenalty[]> {
    return this.request<StaffPenalty[]>(`/staff/players/${encodeURIComponent(citizenid)}/penalties`)
  }

  staffAddPenalty(citizenid: string, penalty: NewPenalty): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/players/${encodeURIComponent(citizenid)}/penalties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(penalty),
    })
  }

  staffDeletePenalty(penaltyId: number): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/penalties/${penaltyId}`, { method: 'DELETE' })
  }

  staffCreateBan(citizenid: string, ban: NewBan): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/players/${encodeURIComponent(citizenid)}/bans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ban),
    })
  }

  staffRevokeBan(banId: number): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/bans/${banId}/revoke`, { method: 'POST' })
  }

  staffSanctions(citizenid: string): Promise<SanctionEntry[]> {
    return this.request<SanctionEntry[]>(`/staff/players/${encodeURIComponent(citizenid)}/sanctions`)
  }

  staffAddSanction(citizenid: string, sanction: NewSanction): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/players/${encodeURIComponent(citizenid)}/sanctions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanction),
    })
  }

  staffUpdateVehicle(plate: string, update: { garage?: string; state?: number }): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/vehicles/${encodeURIComponent(plate)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
  }

  staffDeleteVehicle(plate: string): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/vehicles/${encodeURIComponent(plate)}`, {
      method: 'DELETE',
    })
  }

  staffTransferVehicle(plate: string, citizenid: string): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/vehicles/${encodeURIComponent(plate)}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citizenid }),
    })
  }

  staffAudit(): Promise<AuditEntry[]> {
    return this.request<AuditEntry[]>('/staff/audit')
  }

  staffGuildRoles(): Promise<GuildRole[]> {
    return this.request<GuildRole[]>('/staff/guild-roles')
  }

  staffRoleGrants(): Promise<RoleGrant[]> {
    return this.request<RoleGrant[]>('/staff/roles')
  }

  staffSetRoleGrant(roleId: string, grant: { perms: string[]; roleName?: string }): Promise<RoleGrant> {
    return this.request<RoleGrant>(`/staff/roles/${encodeURIComponent(roleId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grant),
    })
  }

  async staffDeleteRoleGrant(roleId: string): Promise<void> {
    await this.request(`/staff/roles/${encodeURIComponent(roleId)}`, { method: 'DELETE' })
  }

  mySanctions(): Promise<SanctionEntry[]> {
    return this.request<SanctionEntry[]>('/account/sanctions')
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' })
    this.csrfToken = null
  }
}
