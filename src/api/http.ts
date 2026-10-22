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
  InventoryItem,
  Invoice,
  LicenseDoc,
  Me,
  NewPenalty,
  PlayerSearchResult,
  Property,
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

  staffUpdateVehicle(plate: string, update: { garage?: string; state?: number }): Promise<WriteResult> {
    return this.request<WriteResult>(`/staff/vehicles/${encodeURIComponent(plate)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
  }

  staffAudit(): Promise<AuditEntry[]> {
    return this.request<AuditEntry[]>('/staff/audit')
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' })
    this.csrfToken = null
  }
}
