import { isDemo } from '@/config/env'

import { DemoApi } from './demo'
import { HttpApi } from './http'
import type { UcpApi } from './types'

export * from './types'

/**
 * Punto único de acceso a la API. El modo se decide en build
 * mediante VITE_API_MODE — nunca se mezclan datos demo y reales.
 */
export const api: UcpApi = isDemo ? new DemoApi() : new HttpApi()

export const queryKeys = {
  me: ['me'] as const,
  characters: ['characters'] as const,
  character: (citizenid: string) => ['characters', citizenid] as const,
  properties: ['properties'] as const,
  vehicles: ['vehicles'] as const,
  serverInfo: ['server-info'] as const,
}
