import { useState } from 'react'
import { Bell, Menu, X, User, LogOut, Calendar, Settings } from 'lucide-react'
import ONEELogo from './ONEELogo'
import type { View } from '../types'


interface Props {
  currentView: View
  onNavigate: (v: View) => void
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
}

export default function Navbar({ currentView, onNavigate, isLoggedIn, onLogin, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navItems = isLoggedIn
    ? [
        { label: 'Accueil', view: 'landing' as View },
        { label: 'Réserver', view: 'booking' as View },
        { label: 'Mon espace', view: 'user-dashboard' as View },
        { label: 'Admin', view: 'admin-dashboard' as View },
      ]
    : [
        { label: 'Accueil', view: 'landing' as View },
        { label: 'Salles', view: 'room-detail' as View },
      ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('landing')} className="flex-shrink-0">
            <ONEELogo size="sm" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.view
                    ? 'bg-[#D8ECFA] text-[#005AA9]'
                    : 'text-gray-600 hover:text-[#005AA9] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#005AA9]">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F2C100] rounded-full ring-2 ring-white" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#005AA9] flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">AB</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Ahmed B.</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-scaleIn">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900">Ahmed Benali</p>
                        <p className="text-xs text-gray-500">a.benali@onee.ma</p>
                      </div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={15} /> Mon profil
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Calendar size={15} /> Mes réservations
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings size={15} /> Paramètres
                      </button>
                      <div className="border-t border-gray-50 mt-1">
                        <button
                          onClick={() => { onLogout(); setProfileOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} /> Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-semibold text-[#005AA9] hover:bg-[#D8ECFA] rounded-lg transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#005AA9] hover:bg-[#004a8a] rounded-lg transition-colors"
                >
                  Réserver
                </button>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 animate-fadeIn">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { onNavigate(item.view); setMenuOpen(false) }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-[#005AA9] bg-[#D8ECFA]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
