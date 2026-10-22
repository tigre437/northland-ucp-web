import { Outlet } from 'react-router-dom'

import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh flex-col md:pl-60">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:pb-10 md:pt-8">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
