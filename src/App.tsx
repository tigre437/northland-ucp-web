import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/auth/RequireAuth'
import { AppShell } from '@/components/layout/AppShell'
import { CharacterDetailPage } from '@/pages/CharacterDetailPage'
import { CharactersPage } from '@/pages/CharactersPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PropertiesPage } from '@/pages/PropertiesPage'
import { VehiclesPage } from '@/pages/VehiclesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="personajes" element={<CharactersPage />} />
        <Route path="personajes/:citizenid" element={<CharacterDetailPage />} />
        <Route path="propiedades" element={<PropertiesPage />} />
        <Route path="vehiculos" element={<VehiclesPage />} />
        <Route path="cuenta" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
