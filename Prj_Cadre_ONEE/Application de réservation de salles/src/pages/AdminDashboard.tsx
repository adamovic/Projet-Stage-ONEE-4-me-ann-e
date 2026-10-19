import { useState } from 'react'
import {
  LayoutDashboard, Calendar, Building2, Users, Settings, Clock, CheckCircle,
  XCircle, TrendingUp, Download, Search, Filter, ChevronRight, Eye, Check, X,
  Wrench, Coffee, UtensilsCrossed, History, LogOut
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Badge from '../components/Badge'
import { RESERVATIONS, ROOMS, STATS } from '../data/mockData'
import type { View, Reservation } from '../types'

interface Props {
  onNavigate: (v: View) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'pending', label: 'En attente', icon: Clock },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'rooms', label: 'Salles', icon: Building2 },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'equipment', label: 'Équipements', icon: Wrench },
  { id: 'meals', label: 'Repas', icon: UtensilsCrossed },
  { id: 'coffee', label: 'Pauses café', icon: Coffee },
  { id: 'history', label: 'Historique', icon: History },
  { id: 'settings', label: 'Paramètres', icon: Settings },
]

const BAR_DATA = [
  { day: 'Lun', reservations: 5 }, { day: 'Mar', reservations: 8 },
  { day: 'Mer', reservations: 6 }, { day: 'Jeu', reservations: 9 },
  { day: 'Ven', reservations: 7 }, { day: 'Sam', reservations: 2 }, { day: 'Dim', reservations: 0 },
]

const PIE_DATA = [
  { name: 'Confirmées', value: 58, color: '#16A34A' },
  { name: 'En attente', value: 25, color: '#F59E0B' },
  { name: 'Refusées', value: 12, color: '#DC2626' },
  { name: 'Annulées', value: 5, color: '#9CA3AF' },
]

const USERS = [
  { id: 1, name: 'Ahmed Benali', email: 'a.benali@onee.ma', entity: 'Direction Financière', role: 'Employé', reservations: 12 },
  { id: 2, name: 'Fatima Zahra Alaoui', email: 'fz.alaoui@onee.ma', entity: 'Direction RH', role: 'Responsable', reservations: 8 },
  { id: 3, name: 'Karim Tazi', email: 'k.tazi@onee.ma', entity: 'Direction Technique', role: 'Employé', reservations: 5 },
  { id: 4, name: 'Nadia Berrada', email: 'n.berrada@onee.ma', entity: 'Direction Commerciale', role: 'Responsable', reservations: 15 },
]

function StatCard({ label, value, icon: Icon, color, bg, trend }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: bg }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+{trend}%</span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function ReservationRow({ r, onApprove, onRefuse }: { r: Reservation; onApprove: (id: string) => void; onRefuse: (id: string) => void }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-4">
        <span className="text-sm font-mono font-semibold text-[#005AA9]">{r.reference}</span>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-[#1F2937]">{r.requester}</p>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#D8ECFA] rounded-lg flex items-center justify-center">
            <Building2 size={12} className="text-[#005AA9]" />
          </div>
          <span className="text-sm text-gray-700">{r.room}</span>
        </div>
      </td>
      <td className="px-5 py-4 text-sm text-gray-600">
        {new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
      </td>
      <td className="px-5 py-4 text-sm text-gray-600">{r.start} – {r.end}</td>
      <td className="px-5 py-4"><Badge status={r.status} /></td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {r.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove(r.id)}
                className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                title="Valider"
              >
                <Check size={15} />
              </button>
              <button
                onClick={() => onRefuse(r.id)}
                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Refuser"
              >
                <X size={15} />
              </button>
            </>
          )}
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <Eye size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminDashboard({ onNavigate }: Props) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [reservations, setReservations] = useState(RESERVATIONS)
  const [search, setSearch] = useState('')

  const approve = (id: string) => setReservations(rs => rs.map(r => r.id === id ? { ...r, status: 'confirmed' as const } : r))
  const refuse = (id: string) => setReservations(rs => rs.map(r => r.id === id ? { ...r, status: 'refused' as const } : r))
  const pending = reservations.filter(r => r.status === 'pending')
  const filtered = reservations.filter(r =>
    r.room.toLowerCase().includes(search.toLowerCase()) ||
    r.reference.toLowerCase().includes(search.toLowerCase()) ||
    r.requester.toLowerCase().includes(search.toLowerCase())
  )

  const renderContent = () => {
    if (activeNav === 'rooms') return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937]">Gestion des salles</h2>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#005AA9] text-white rounded-xl text-sm font-semibold hover:bg-[#004a8a] transition-colors">
            <Building2 size={16} /> Ajouter une salle
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROOMS.map(room => (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-gray-100">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#1F2937]">{room.name}</h3>
                  <Badge status={room.available ? 'available' : 'unavailable'} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mb-3">{room.floor} · {room.surface} m² · {room.capacity} pers.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#005AA9] rounded-full" style={{ width: `${room.occupancyRate}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{room.occupancyRate}%</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 text-xs font-semibold text-[#005AA9] bg-[#D8ECFA] rounded-lg hover:bg-[#c5e2f7] transition-colors">Modifier</button>
                  <button className="flex-1 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Planning</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    if (activeNav === 'users') return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937]">Gestion des utilisateurs</h2>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#005AA9] text-white rounded-xl text-sm font-semibold hover:bg-[#004a8a] transition-colors">
            <Users size={16} /> Ajouter un utilisateur
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                {['Utilisateur', 'Entité', 'Rôle', 'Réservations', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {USERS.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#D8ECFA] rounded-full flex items-center justify-center text-[#005AA9] font-bold text-sm">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{u.entity}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      u.role === 'Responsable' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 font-semibold">{u.reservations}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><Eye size={15} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><Settings size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )

    if (activeNav === 'pending') return (
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
          Réservations en attente
          {pending.length > 0 && (
            <span className="ml-3 text-sm font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{pending.length}</span>
          )}
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                {['Référence', 'Demandeur', 'Salle', 'Date', 'Horaire', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pending.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">Aucune réservation en attente</td></tr>
              ) : pending.map(r => (
                <ReservationRow key={r.id} r={r} onApprove={approve} onRefuse={refuse} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )

    if (activeNav === 'reservations') return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937]">Toutes les réservations</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9]"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={15} /> Filtrer
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              <Download size={15} /> Exporter
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {['Référence', 'Demandeur', 'Salle', 'Date', 'Horaire', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <ReservationRow key={r.id} r={r} onApprove={approve} onRefuse={refuse} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )

    // Default dashboard
    return (
      <div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Tableau de bord</h2>
            <p className="text-gray-500 mt-1">Jeudi 10 juillet 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              <Download size={16} /> Exporter PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
              <Download size={16} /> Exporter Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Réservations du jour" value={STATS.todayReservations} icon={Calendar} color="#005AA9" bg="#D8ECFA" trend={12} />
          <StatCard label="En attente" value={pending.length} icon={Clock} color="#F59E0B" bg="#fef3c7" />
          <StatCard label="Confirmées" value={reservations.filter(r => r.status === 'confirmed').length} icon={CheckCircle} color="#16A34A" bg="#dcfce7" trend={8} />
          <StatCard label="Refusées" value={reservations.filter(r => r.status === 'refused').length} icon={XCircle} color="#DC2626" bg="#fee2e2" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-[#1F2937]">Réservations cette semaine</h3>
                <p className="text-sm text-gray-500">Nombre de réservations par jour</p>
              </div>
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <TrendingUp size={16} /> +12%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BAR_DATA} barSize={28}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="reservations" fill="#005AA9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-[#1F2937] mb-2">Répartition</h3>
            <p className="text-sm text-gray-500 mb-5">Par statut</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Occupancy per room */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-[#1F2937] mb-5">Taux d'occupation des salles</h3>
          <div className="space-y-4">
            {ROOMS.map(room => (
              <div key={room.id} className="flex items-center gap-4">
                <div className="w-32 flex-shrink-0">
                  <p className="text-sm font-medium text-[#1F2937] truncate">{room.name}</p>
                  <p className="text-xs text-gray-400">{room.capacity} pers.</p>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${room.occupancyRate}%`,
                      backgroundColor: room.occupancyRate > 75 ? '#DC2626' : room.occupancyRate > 50 ? '#F59E0B' : '#16A34A'
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-10 text-right">{room.occupancyRate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reservations table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-bold text-[#1F2937]">Réservations récentes</h3>
            <button
              onClick={() => setActiveNav('reservations')}
              className="flex items-center gap-1 text-sm text-[#005AA9] font-medium hover:underline"
            >
              Voir tout <ChevronRight size={15} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {['Référence', 'Demandeur', 'Salle', 'Date', 'Horaire', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.slice(0, 4).map(r => (
                  <ReservationRow key={r.id} r={r} onApprove={approve} onRefuse={refuse} />
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
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Espace</p>
            <p className="font-bold text-[#005AA9] text-sm">Administrateur</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                activeNav === id
                  ? 'bg-[#D8ECFA] text-[#005AA9]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#005AA9]'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
              {id === 'pending' && pending.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#005AA9] rounded-full flex items-center justify-center text-white text-sm font-bold">AD</div>
            <div>
              <p className="text-sm font-semibold text-[#1F2937]">Admin ONEE</p>
              <p className="text-xs text-gray-400">admin@onee.ma</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-2 text-xs text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
