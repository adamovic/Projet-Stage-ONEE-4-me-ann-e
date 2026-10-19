import { useState } from 'react'
import { Users, MapPin, Square, Monitor, Wifi, Mic, Camera, Video, Laptop, FileText, Tablet, ChevronLeft, Calendar, Clock, Check } from 'lucide-react'
import Badge from '../components/Badge'
import { ROOMS } from '../data/mockData'
import type { View } from '../types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Vidéoprojecteur': Monitor,
  'Paperboard': FileText,
  'Tableau blanc': Square,
  'Écran interactif': Tablet,
  'Micro': Mic,
  'Internet': Wifi,
  'Ordinateur': Laptop,
  'Caméra': Camera,
  'Visioconférence': Video,
}

const SCHEDULE = [
  { time: '08:00 – 09:00', event: 'Libre', available: true },
  { time: '09:00 – 11:00', event: 'Comité de Direction', available: false },
  { time: '11:00 – 12:00', event: 'Libre', available: true },
  { time: '12:00 – 13:30', event: 'Déjeuner de travail', available: false },
  { time: '13:30 – 15:00', event: 'Libre', available: true },
  { time: '15:00 – 17:30', event: 'Formation sécurité', available: false },
]

interface Props {
  onNavigate: (v: View) => void
}

export default function RoomDetail({ onNavigate }: Props) {
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0])
  const [activeTab, setActiveTab] = useState<'info' | 'planning'>('info')

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#005AA9] text-sm font-medium mb-6 transition-colors"
        >
          <ChevronLeft size={18} /> Retour à l'accueil
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Nos salles de réunion</h1>
            <p className="text-gray-500 mt-1">{ROOMS.length} salles disponibles au siège ONEE</p>
          </div>
          <button
            onClick={() => onNavigate('booking')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#005AA9] hover:bg-[#004a8a] text-white rounded-xl font-semibold text-sm transition-all hover:shadow-md"
          >
            <Calendar size={18} /> Réserver
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Room list */}
          <div className="space-y-3">
            {ROOMS.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full flex gap-4 items-center p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedRoom.id === room.id
                    ? 'border-[#005AA9] bg-white shadow-md'
                    : 'border-gray-100 bg-white hover:border-[#D8ECFA] hover:shadow-sm'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-[#1F2937] text-sm">{room.name}</p>
                    <Badge status={room.available ? 'available' : 'unavailable'} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500">{room.floor}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users size={11} /> {room.capacity}</span>
                    <span className="flex items-center gap-1"><Square size={11} /> {room.surface} m²</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Room detail */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Header image */}
              <div className="aspect-[16/7] bg-gray-100">
                <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1F2937] mb-1">{selectedRoom.name}</h2>
                    <p className="text-gray-500">{selectedRoom.description}</p>
                  </div>
                  <Badge status={selectedRoom.available ? 'available' : 'unavailable'} />
                </div>

                {/* Key info */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-[#F8F9FB] rounded-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[#005AA9] mb-1">
                      <Users size={16} />
                    </div>
                    <p className="text-xl font-bold text-[#1F2937]">{selectedRoom.capacity}</p>
                    <p className="text-xs text-gray-500">Capacité</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="flex items-center justify-center gap-1.5 text-[#005AA9] mb-1">
                      <Square size={16} />
                    </div>
                    <p className="text-xl font-bold text-[#1F2937]">{selectedRoom.surface} m²</p>
                    <p className="text-xs text-gray-500">Surface</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[#005AA9] mb-1">
                      <MapPin size={16} />
                    </div>
                    <p className="text-sm font-bold text-[#1F2937]">{selectedRoom.floor}</p>
                    <p className="text-xs text-gray-500">Localisation</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 max-w-xs">
                  {(['info', 'planning'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? 'bg-white text-[#005AA9] shadow-sm' : 'text-gray-500'}`}
                    >
                      {t === 'info' ? 'Équipements' : 'Planning du jour'}
                    </button>
                  ))}
                </div>

                {activeTab === 'info' && (
                  <div className="grid sm:grid-cols-2 gap-3 animate-fadeIn">
                    {selectedRoom.equipment.map(eq => {
                      const Icon = ICON_MAP[eq] || Check
                      return (
                        <div key={eq} className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl">
                          <div className="w-8 h-8 bg-[#D8ECFA] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon size={16} className="text-[#005AA9]" />
                          </div>
                          <span className="text-sm font-medium text-[#1F2937]">{eq}</span>
                          <Check size={14} className="text-green-500 ml-auto" />
                        </div>
                      )
                    })}
                  </div>
                )}

                {activeTab === 'planning' && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-300" /> Libre</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Occupé</span>
                    </div>
                    {SCHEDULE.map(slot => (
                      <div
                        key={slot.time}
                        className={`flex items-center justify-between p-3.5 rounded-xl ${slot.available ? 'bg-green-50' : 'bg-red-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock size={14} className={slot.available ? 'text-green-600' : 'text-red-500'} />
                          <span className="text-sm font-semibold text-[#1F2937]">{slot.time}</span>
                        </div>
                        <span className={`text-xs font-medium ${slot.available ? 'text-green-700' : 'text-red-600'}`}>
                          {slot.event}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full mt-6 py-3.5 bg-[#005AA9] hover:bg-[#004a8a] text-white font-bold rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar size={18} /> Réserver cette salle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
