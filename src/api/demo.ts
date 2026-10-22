import { ApiError } from './types'
import type {
  ActivityStats,
  Agency,
  Business,
  Character,
  CharacterRecord,
  Finances,
  Invoice,
  LicenseDoc,
  Me,
  Property,
  ServerInfo,
  UcpApi,
  UcpNotification,
  Vehicle,
} from './types'
import {
  demoAgencies,
  demoBusinesses,
  demoCharacters,
  demoFinances,
  demoInvoices,
  demoLicenses,
  demoMe,
  demoNotifications,
  demoProperties,
  demoRecords,
  demoServerInfo,
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

  async logout(): Promise<void> {
    await latency()
    this.loggedIn = false
  }
}
