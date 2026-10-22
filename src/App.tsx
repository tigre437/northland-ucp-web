import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/auth/RequireAuth'
import { AppShell } from '@/components/layout/AppShell'
import { ActivityPage } from '@/pages/ActivityPage'
import { BusinessesPage } from '@/pages/BusinessesPage'
import { CharacterDetailPage } from '@/pages/CharacterDetailPage'
import { CharactersPage } from '@/pages/CharactersPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EconomyPage } from '@/pages/EconomyPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PropertiesPage } from '@/pages/PropertiesPage'
import { RecordsPage } from '@/pages/RecordsPage'
import { StaffPage } from '@/pages/StaffPage'
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
        <Route path="economia" element={<EconomyPage />} />
        <Route path="documentos" element={<RecordsPage />} />
        <Route path="negocios" element={<BusinessesPage />} />
        <Route path="actividad" element={<ActivityPage />} />
        <Route path="cuenta" element={<ProfilePage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
