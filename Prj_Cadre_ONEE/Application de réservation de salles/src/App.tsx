import { useState } from 'react'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import BookingWizard from './pages/BookingWizard'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import RoomDetail from './pages/RoomDetail'
import type { View } from './types'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigate = (v: View) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showNavbar = view !== 'user-dashboard' && view !== 'admin-dashboard'

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {showNavbar && (
        <Navbar
          currentView={view}
          onNavigate={navigate}
          isLoggedIn={isLoggedIn}
          onLogin={() => setIsLoggedIn(true)}
          onLogout={() => { setIsLoggedIn(false); navigate('landing') }}
        />
      )}

      {view === 'landing' && <LandingPage onNavigate={navigate} />}
      {view === 'booking' && <BookingWizard onNavigate={navigate} />}
      {view === 'user-dashboard' && <UserDashboard onNavigate={navigate} />}
      {view === 'admin-dashboard' && <AdminDashboard onNavigate={navigate} />}
      {view === 'room-detail' && <RoomDetail onNavigate={navigate} />}
    </div>
  )
}
