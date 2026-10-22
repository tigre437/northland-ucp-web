import { ApiError } from './types'
import type {
  Character,
  Me,
  Property,
  ServerInfo,
  UcpApi,
  Vehicle,
} from './types'
import {
  demoCharacters,
  demoMe,
  demoProperties,
  demoServerInfo,
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

  async getServerInfo(): Promise<ServerInfo> {
    await latency()
    return demoServerInfo
  }

  async logout(): Promise<void> {
    await latency()
    this.loggedIn = false
  }
}
