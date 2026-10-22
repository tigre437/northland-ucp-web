import { env } from '@/config/env'

import { ApiError } from './types'
import type {
  Character,
  Me,
  Property,
  ServerInfo,
  UcpApi,
  Vehicle,
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

  getServerInfo(): Promise<ServerInfo> {
    return this.request<ServerInfo>('/server/info')
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' })
    this.csrfToken = null
  }
}
