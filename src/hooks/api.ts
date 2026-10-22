import { useQuery } from '@tanstack/react-query'

import { api, queryKeys } from '@/api'
import { ApiError } from '@/api'

const sessionRetry = (failureCount: number, error: unknown) => {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
    return false
  }
  return failureCount < 2
}

export function useMe() {
  return useQuery({ queryKey: queryKeys.me, queryFn: () => api.getMe(), retry: sessionRetry, staleTime: 60_000 })
}

export function useCharacters() {
  return useQuery({ queryKey: queryKeys.characters, queryFn: () => api.getCharacters(), retry: sessionRetry })
}

export function useCharacter(citizenid: string) {
  return useQuery({
    queryKey: queryKeys.character(citizenid),
    queryFn: () => api.getCharacter(citizenid),
    retry: sessionRetry,
  })
}

export function useProperties() {
  return useQuery({ queryKey: queryKeys.properties, queryFn: () => api.getProperties(), retry: sessionRetry })
}

export function useVehicles() {
  return useQuery({ queryKey: queryKeys.vehicles, queryFn: () => api.getVehicles(), retry: sessionRetry })
}

export function useServerInfo() {
  return useQuery({ queryKey: queryKeys.serverInfo, queryFn: () => api.getServerInfo(), retry: sessionRetry })
}
