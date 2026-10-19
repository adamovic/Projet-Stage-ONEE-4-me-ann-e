import { useState } from 'react'
import { Home, Calendar, Bell, User, LogOut, Plus, Clock, Building2, Users, ChevronRight, CheckCircle, XCircle, AlertCircle, Filter, Search } from 'lucide-react'
import Badge from '../components/Badge'
import { RESERVATIONS } from '../data/mockData'
import type { View } from '../types'

interface Props {
  onNavigate: (v: View) => void
}

const NAV_ITEMS = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'new', label: 'Réserver', icon: Plus },
  { id: 'reservations', label: 'Mes réservations', icon: Calendar },
  { id: 'calendar', label: 'Calendrier', icon: Calendar },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profil', icon: User },
]

const NOTIFICATIONS = [
  { id: 1, type: 'success', message: 'Réservation RES-2024-0312 confirmée', time: 'Il y a 2h', read: false },
  { id: 2, type: 'warning', message: 'Rappel : Réunion demain à 09:00 en Salle Atlas', time: 'Il y a 5h', read: false },
  { id: 3, type: 'error', message: 'Réservation RES-2024-0315 refusée', time: 'Hier', read: true },
  { id: 4, type: 'success', message: 'Réservation RES-2024-0313 en attente de validation', time: '2 jours', read: true },
]

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: bg }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function UserDashboard({ onNavigate }: Props) {
  const [activeNav, setActiveNav] = useState('home')
  const [sidebarOpen] = useState(true)
  const [search, setSearch] = useState('')

  const filtered = RESERVATIONS.filter(r =>
    r.room.toLowerCase().includes(search.toLowerCase()) ||
    r.reference.toLowerCase().includes(search.toLowerCase())
  )

  const renderContent = () => {
    if (activeNav === 'notifications') return (
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Notifications</h2>
        <div className="space-y-3">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`flex items-start gap-4 bg-white rounded-2xl border p-5 transition-all ${!n.read ? 'border-[#D8ECFA] shadow-sm' : 'border-gray-100'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                n.type === 'success' ? 'bg-green-50' : n.type === 'error' ? 'bg-red-50' : 'bg-amber-50'
              }`}>
                {n.type === 'success' ? <CheckCircle size={20} className="text-green-600" /> :
                 n.type === 'error' ? <XCircle size={20} className="text-red-600" /> :
                 <AlertCircle size={20} className="text-amber-600" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!n.read ? 'font-semibold text-[#1F2937]' : 'text-gray-600'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 bg-[#005AA9] rounded-full mt-1 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    )

    if (activeNav === 'profile') return (
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Mon profil</h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-lg">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-[#005AA9] rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">AB</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F2937]">Ahmed Benali</h3>
              <p className="text-gray-500">Direction Financière</p>
              <p className="text-sm text-[#005AA9]">a.benali@onee.ma</p>
            </div>
          </div>
          {[
            { label: 'Matricule', value: '12345' },
            { label: 'Entité', value: 'Direction Financière' },
            { label: 'Téléphone', value: '+212 5XX XXX XXX' },
            { label: 'Rôle', value: 'Employé' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-semibold text-[#1F2937]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    )

    // Default - home & reservations
    return (
      <div>
        {activeNav === 'home' && (
          <>
            {/* Welcome */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Bonjour, Ahmed 👋</h2>
                <p className="text-gray-500 mt-1">Jeudi 10 juillet 2025</p>
              </div>
              <button
                onClick={() => onNavigate('booking')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#005AA9] hover:bg-[#004a8a] text-white rounded-xl font-semibold text-sm transition-all hover:shadow-md"
              >
                <Plus size={18} /> Nouvelle réservation
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total réservations" value="12" icon={Calendar} color="#005AA9" bg="#D8ECFA" />
              <StatCard label="Confirmées" value="8" icon={CheckCircle} color="#16A34A" bg="#dcfce7" />
              <StatCard label="En attente" value="3" icon={Clock} color="#F59E0B" bg="#fef3c7" />
              <StatCard label="Refusées" value="1" icon={XCircle} color="#DC2626" bg="#fee2e2" />
            </div>
          </>
        )}

        {/* Reservations */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#1F2937]">
            {activeNav === 'home' ? 'Réservations récentes' : 'Mes réservations'}
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter size={15} /> Filtrer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {['Référence', 'Salle', 'Date', 'Horaire', 'Participants', 'Statut', ''].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono font-semibold text-[#005AA9]">{r.reference}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#D8ECFA] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-[#005AA9]" />
                        </div>
                        <span className="text-sm font-medium text-[#1F2937]">{r.room}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 font-medium">{r.start} – {r.end}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users size={13} /> {r.participants}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FB]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 bg-white border-r border-gray-100 transition-all duration-300 flex flex-col`}>
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          {sidebarOpen && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Espace</p>
              <p className="font-bold text-[#005AA9] text-sm">Utilisateur</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (id === 'new') onNavigate('booking')
                else setActiveNav(id)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                activeNav === id
                  ? 'bg-[#D8ECFA] text-[#005AA9]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#005AA9]'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && id === 'notifications' && (
                <span className="ml-auto w-5 h-5 bg-[#005AA9] text-white text-xs rounded-full flex items-center justify-center">2</span>
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#005AA9] rounded-full flex items-center justify-center text-white text-sm font-bold">AB</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1F2937] truncate">Ahmed Benali</p>
                <p className="text-xs text-gray-400 truncate">a.benali@onee.ma</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('landing')}
              className="w-full flex items-center gap-2 text-xs text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
