import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, Users, Coffee, UtensilsCrossed, UserPlus, LogIn, FileCheck, Plus, Minus, Trash2, Wifi, Monitor, Mic, Camera, Video, Laptop, Square, FileText, Tablet, X, Shield } from 'lucide-react'
import BookingProgress from '../components/BookingProgress'
import Badge from '../components/Badge'
import { ROOMS, EQUIPMENT_LIST, TIME_SLOTS, BOOKED_SLOTS } from '../data/mockData'
import type { BookingData, Participant, View } from '../types'

interface Props {
  onNavigate: (v: View) => void
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor, FileText, Square, Tablet, Mic, Wifi, Laptop, Camera, Video, Plus,
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function StepHeader({ title, subtitle, breadcrumb }: { title: string; subtitle: string; breadcrumb: string[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        {breadcrumb.map((b, i) => (
          <span key={b} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} />}
            <span className={i === breadcrumb.length - 1 ? 'text-[#005AA9] font-medium' : ''}>{b}</span>
          </span>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-[#1F2937] mb-2">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  )
}

function NavButtons({ onBack, onNext, nextLabel = 'Continuer', nextDisabled = false }: {
  onBack: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean; step?: number
}) {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={18} /> Retour
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#005AA9] hover:bg-[#004a8a] text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
      >
        {nextLabel}
        {nextLabel === 'Continuer' && <ChevronRight size={18} />}
        {nextLabel === 'Confirmer' && <Check size={18} />}
      </button>
    </div>
  )
}

// Step 1 - Date Picker
function StepDate({ data, onChange, onNext, onBack }: any) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const isDisabled = (d: number) => {
    const date = new Date(viewYear, viewMonth, d)
    return date < today || date.getDay() === 0 || date.getDay() === 6
  }

  const isSelected = (d: number) => {
    if (!data.date) return false
    const date = new Date(viewYear, viewMonth, d)
    return data.date.toDateString() === date.toDateString()
  }

  const isToday = (d: number) => {
    const date = new Date(viewYear, viewMonth, d)
    return date.toDateString() === today.toDateString()
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Choisissez une date"
        subtitle="Sélectionnez la date de votre réunion. Les week-ends ne sont pas disponibles."
        breadcrumb={['Réservation', 'Date']}
      />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-[#1F2937]">{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const disabled = isDisabled(d)
              const selected = isSelected(d)
              const tod = isToday(d)
              return (
                <button
                  key={d}
                  disabled={disabled}
                  onClick={() => onChange({ date: new Date(viewYear, viewMonth, d) })}
                  className={`w-full aspect-square rounded-lg text-sm font-medium transition-all ${
                    selected ? 'bg-[#005AA9] text-white shadow-md' :
                    tod ? 'ring-2 ring-[#005AA9] text-[#005AA9] font-bold' :
                    disabled ? 'text-gray-200 cursor-not-allowed' :
                    'hover:bg-[#D8ECFA] text-[#1F2937] hover:text-[#005AA9]'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {data.date && (
          <div className="mt-4 bg-[#D8ECFA] rounded-xl p-4 flex items-center gap-3 animate-scaleIn">
            <div className="w-10 h-10 bg-[#005AA9] rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-[#005AA9] font-semibold uppercase tracking-wider">Date sélectionnée</p>
              <p className="font-semibold text-[#1F2937]">
                {data.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.date} step={1} />
    </div>
  )
}

// Step 2 - Time Slots
function StepTime({ data, onChange, onNext, onBack }: any) {
  const calcDuration = () => {
    if (!data.startTime || !data.endTime) return null
    const [sh, sm] = data.startTime.split(':').map(Number)
    const [eh, em] = data.endTime.split(':').map(Number)
    const mins = (eh * 60 + em) - (sh * 60 + sm)
    if (mins <= 0) return null
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h${m > 0 ? m : ''}` : `${m}min`
  }
  const duration = calcDuration()

  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Choisissez votre créneau"
        subtitle="Sélectionnez l'heure de début et de fin de votre réunion."
        breadcrumb={['Réservation', 'Date', 'Créneau']}
      />

      <div className="grid sm:grid-cols-2 gap-8 mb-6">
        <div>
          <label className="text-sm font-semibold text-[#1F2937] mb-3 block">Heure de début</label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.filter((_, i) => i < 14).map(slot => {
              const booked = BOOKED_SLOTS.includes(slot)
              const selected = data.startTime === slot
              return (
                <button
                  key={slot}
                  disabled={booked}
                  onClick={() => onChange({ startTime: slot, endTime: '' })}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selected ? 'bg-[#005AA9] text-white shadow-md' :
                    booked ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' :
                    'bg-gray-50 text-gray-700 hover:bg-[#D8ECFA] hover:text-[#005AA9]'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-300" /> Libre</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Occupé</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[#1F2937] mb-3 block">Heure de fin</label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.filter((_, i) => i > 0).map(slot => {
              const booked = BOOKED_SLOTS.includes(slot)
              const selected = data.endTime === slot
              const valid = !data.startTime || slot > data.startTime
              return (
                <button
                  key={slot}
                  disabled={booked || !valid}
                  onClick={() => onChange({ endTime: slot })}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selected ? 'bg-[#005AA9] text-white shadow-md' :
                    booked ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' :
                    !valid ? 'bg-gray-50 text-gray-200 cursor-not-allowed' :
                    'bg-gray-50 text-gray-700 hover:bg-[#D8ECFA] hover:text-[#005AA9]'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {duration && (
        <div className="bg-[#D8ECFA] rounded-xl p-4 flex items-center gap-3 mb-4 animate-scaleIn">
          <Clock size={20} className="text-[#005AA9]" />
          <div>
            <span className="text-sm text-[#005AA9]">Durée totale : </span>
            <span className="font-bold text-[#005AA9]">{duration}</span>
            <span className="text-sm text-[#005AA9] ml-2">({data.startTime} → {data.endTime})</span>
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.startTime || !data.endTime} step={2} />
    </div>
  )
}

// Step 3 - Participants count
function StepParticipants({ data, onChange, onNext, onBack }: any) {
  const rooms = ROOMS.filter(r => r.capacity >= data.participants)
  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Nombre de participants"
        subtitle="Indiquez le nombre total de participants à votre réunion."
        breadcrumb={['Réservation', 'Date', 'Créneau', 'Participants']}
      />
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <Users size={40} className="text-[#005AA9] mx-auto mb-5" />
          <p className="text-6xl font-bold text-[#1F2937] mb-2">{data.participants}</p>
          <p className="text-gray-500 text-sm mb-8">participants</p>
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => onChange({ participants: Math.max(1, data.participants - 1) })}
              className="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Minus size={22} />
            </button>
            <div className="w-20 h-14 bg-[#D8ECFA] rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#005AA9]">{data.participants}</span>
            </div>
            <button
              onClick={() => onChange({ participants: Math.min(100, data.participants + 1) })}
              className="w-14 h-14 rounded-xl bg-[#005AA9] hover:bg-[#004a8a] text-white flex items-center justify-center transition-colors"
            >
              <Plus size={22} />
            </button>
          </div>
        </div>

        {data.participants > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl animate-scaleIn">
            <p className="text-sm text-amber-700 font-medium">
              {rooms.length > 0
                ? `${rooms.length} salle${rooms.length > 1 ? 's' : ''} compatible${rooms.length > 1 ? 's' : ''} trouvée${rooms.length > 1 ? 's' : ''}`
                : 'Aucune salle ne peut accueillir ce nombre de participants'
              }
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Capacité minimale requise : {data.participants} personnes</p>
          </div>
        )}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={data.participants < 1} step={3} />
    </div>
  )
}

// Step 4 - Coffee Break
function StepCoffee({ data, onChange, onNext, onBack }: any) {
  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Pause café"
        subtitle="Souhaitez-vous intégrer une pause café à votre réunion ?"
        breadcrumb={['Réservation', 'Date', 'Créneau', 'Participants', 'Pause café']}
      />
      <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
        {[true, false].map(val => (
          <button
            key={String(val)}
            onClick={() => onChange({ coffeeBreak: val })}
            className={`group p-8 rounded-2xl border-2 text-center transition-all hover:-translate-y-1 hover:shadow-md ${
              data.coffeeBreak === val
                ? 'border-[#005AA9] bg-[#D8ECFA]'
                : 'border-gray-100 bg-white hover:border-[#D8ECFA]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all ${
              data.coffeeBreak === val ? 'bg-[#005AA9]' : 'bg-gray-100 group-hover:bg-[#D8ECFA]'
            }`}>
              {val ? <Coffee size={30} className={data.coffeeBreak === val ? 'text-white' : 'text-gray-500'} /> : <X size={30} className={data.coffeeBreak === val ? 'text-white' : 'text-gray-500'} />}
            </div>
            <p className={`text-xl font-bold mb-2 ${data.coffeeBreak === val ? 'text-[#005AA9]' : 'text-[#1F2937]'}`}>
              {val ? 'Oui' : 'Non'}
            </p>
            <p className="text-sm text-gray-500">
              {val ? 'Inclure une pause café avec boissons chaudes et viennoiseries' : 'Pas de pause café nécessaire'}
            </p>
            {data.coffeeBreak === val && (
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <Check size={14} className="text-[#005AA9]" />
                <span className="text-xs font-semibold text-[#005AA9]">Sélectionné</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={data.coffeeBreak === null} step={4} />
    </div>
  )
}

// Step 5 - Lunch
function StepLunch({ data, onChange, onNext, onBack }: any) {
  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Déjeuner"
        subtitle="Souhaitez-vous prévoir un repas pour les participants ?"
        breadcrumb={['Réservation', '...', 'Pause café', 'Déjeuner']}
      />
      <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-8">
        {[true, false].map(val => (
          <button
            key={String(val)}
            onClick={() => onChange({ lunch: val, lunchType: null })}
            className={`group p-8 rounded-2xl border-2 text-center transition-all hover:-translate-y-1 hover:shadow-md ${
              data.lunch === val ? 'border-[#005AA9] bg-[#D8ECFA]' : 'border-gray-100 bg-white hover:border-[#D8ECFA]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all ${
              data.lunch === val ? 'bg-[#005AA9]' : 'bg-gray-100 group-hover:bg-[#D8ECFA]'
            }`}>
              {val ? <UtensilsCrossed size={30} className={data.lunch === val ? 'text-white' : 'text-gray-500'} /> : <X size={30} className={data.lunch === val ? 'text-white' : 'text-gray-500'} />}
            </div>
            <p className={`text-xl font-bold mb-2 ${data.lunch === val ? 'text-[#005AA9]' : 'text-[#1F2937]'}`}>
              {val ? 'Oui' : 'Non'}
            </p>
            <p className="text-sm text-gray-500">{val ? 'Prévoir un repas pour les participants' : 'Pas de repas nécessaire'}</p>
          </button>
        ))}
      </div>

      {data.lunch === true && (
        <div className="max-w-xl mx-auto animate-fadeIn">
          <p className="text-sm font-semibold text-[#1F2937] mb-4">Type de service :</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { val: 'self-service', label: 'Self Service', desc: 'Les participants se servent eux-mêmes' },
              { val: 'table-service', label: 'Service à table', desc: 'Un serveur s\'occupe des participants' },
            ].map(({ val, label, desc }) => (
              <button
                key={val}
                onClick={() => onChange({ lunchType: val })}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  data.lunchType === val ? 'border-[#005AA9] bg-[#D8ECFA]' : 'border-gray-100 hover:border-[#D8ECFA]'
                }`}
              >
                <p className={`font-semibold mb-1 ${data.lunchType === val ? 'text-[#005AA9]' : 'text-[#1F2937]'}`}>{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextDisabled={data.lunch === null || (data.lunch === true && !data.lunchType)}
        step={5}
      />
    </div>
  )
}

// Step 6 - Participants list
function StepParticipantsList({ data, onChange, onNext, onBack }: any) {
  const [tab, setTab] = useState<'agent' | 'external'>('agent')
  const [form, setForm] = useState<Participant>({ type: 'agent', firstName: '', lastName: '', matricule: '', entity: '' })

  const addParticipant = () => {
    if (!form.firstName || !form.lastName) return
    onChange({ participantsList: [...data.participantsList, { ...form, type: tab }] })
    setForm({ type: tab, firstName: '', lastName: '', matricule: '', entity: '', fonction: '', societe: '' })
  }

  const remove = (i: number) => {
    onChange({ participantsList: data.participantsList.filter((_: any, idx: number) => idx !== i) })
  }

  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Liste des participants"
        subtitle="Ajoutez les participants à votre réunion. Vous pouvez en ajouter plusieurs."
        breadcrumb={['Réservation', '...', 'Déjeuner', 'Participants']}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 max-w-xs">
        {(['agent', 'external'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setForm({ type: t, firstName: '', lastName: '', matricule: '', entity: '', fonction: '', societe: '' }) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-[#005AA9] shadow-sm' : 'text-gray-500'}`}
          >
            {t === 'agent' ? 'Agents ONEE' : 'Externes'}
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Prénom *</label>
            <input
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              placeholder="Ex: Ahmed"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Nom *</label>
            <input
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              placeholder="Ex: Benali"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
            />
          </div>
          {tab === 'agent' ? (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Matricule</label>
                <input
                  value={form.matricule || ''}
                  onChange={e => setForm(f => ({ ...f, matricule: e.target.value }))}
                  placeholder="Ex: 12345"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Entité</label>
                <input
                  value={form.entity || ''}
                  onChange={e => setForm(f => ({ ...f, entity: e.target.value }))}
                  placeholder="Ex: Direction Financière"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Fonction</label>
                <input
                  value={form.fonction || ''}
                  onChange={e => setForm(f => ({ ...f, fonction: e.target.value }))}
                  placeholder="Ex: Directeur Technique"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Société</label>
                <input
                  value={form.societe || ''}
                  onChange={e => setForm(f => ({ ...f, societe: e.target.value }))}
                  placeholder="Ex: ACME Corp"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent transition-all"
                />
              </div>
            </>
          )}
        </div>
        <button
          onClick={addParticipant}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#005AA9] hover:bg-[#004a8a] text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <UserPlus size={16} /> Ajouter le participant
        </button>
      </div>

      {/* Participants list */}
      {data.participantsList.length > 0 && (
        <div className="space-y-2 animate-fadeIn">
          <p className="text-sm font-semibold text-gray-500 mb-3">{data.participantsList.length} participant{data.participantsList.length > 1 ? 's' : ''} ajouté{data.participantsList.length > 1 ? 's' : ''}</p>
          {data.participantsList.map((p: Participant, i: number) => (
            <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D8ECFA] rounded-full flex items-center justify-center text-[#005AA9] font-bold text-sm">
                  {p.firstName[0]}{p.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">{p.firstName} {p.lastName}</p>
                  <p className="text-xs text-gray-400">{p.type === 'agent' ? (p.entity || 'ONEE') : (p.societe || 'Externe')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.type === 'agent' ? 'bg-[#D8ECFA] text-[#005AA9]' : 'bg-amber-50 text-amber-700'}`}>
                  {p.type === 'agent' ? 'Agent' : 'Externe'}
                </span>
                <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} step={6} />
    </div>
  )
}

// Step 7 - Equipment
function StepEquipment({ data, onChange, onNext, onBack }: any) {
  const toggle = (id: string) => {
    const has = data.equipment.includes(id)
    onChange({ equipment: has ? data.equipment.filter((e: string) => e !== id) : [...data.equipment, id] })
  }

  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Besoins logistiques"
        subtitle="Sélectionnez les équipements dont vous avez besoin pour votre réunion."
        breadcrumb={['Réservation', '...', 'Participants', 'Logistique']}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EQUIPMENT_LIST.map(eq => {
          const Icon = ICON_MAP[eq.icon] || Monitor
          const selected = data.equipment.includes(eq.id)
          return (
            <button
              key={eq.id}
              onClick={() => toggle(eq.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                selected
                  ? 'border-[#005AA9] bg-[#D8ECFA]'
                  : 'border-gray-100 bg-white hover:border-[#D8ECFA] hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-[#005AA9]' : 'bg-gray-100'}`}>
                <Icon size={20} className={selected ? 'text-white' : 'text-gray-500'} />
              </div>
              <span className={`text-sm font-medium ${selected ? 'text-[#005AA9]' : 'text-[#1F2937]'}`}>{eq.label}</span>
              {selected && <Check size={16} className="text-[#005AA9] ml-auto" />}
            </button>
          )
        })}
      </div>
      {data.equipment.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {data.equipment.length} équipement{data.equipment.length > 1 ? 's' : ''} sélectionné{data.equipment.length > 1 ? 's' : ''}
        </div>
      )}
      <NavButtons onBack={onBack} onNext={onNext} step={7} />
    </div>
  )
}

// Step 8 - Room selection
function StepRoom({ data, onChange, onNext, onBack }: any) {
  const compatible = ROOMS.filter(r => r.capacity >= data.participants)

  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Choisissez votre salle"
        subtitle={`${compatible.length} salle${compatible.length > 1 ? 's' : ''} compatible${compatible.length > 1 ? 's' : ''} avec vos critères.`}
        breadcrumb={['Réservation', '...', 'Logistique', 'Salle']}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROOMS.map(room => {
          const valid = room.capacity >= data.participants
          const selected = data.room?.id === room.id
          return (
            <div
              key={room.id}
              className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                selected ? 'border-[#005AA9] shadow-md' :
                !valid ? 'border-gray-100 opacity-50' :
                'border-gray-100 hover:border-[#D8ECFA] hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge status={room.available && valid ? 'available' : 'unavailable'} />
                </div>
                {selected && (
                  <div className="absolute inset-0 bg-[#005AA9]/10 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#005AA9] rounded-full flex items-center justify-center">
                      <Check size={24} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#1F2937] mb-1">{room.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{room.floor} · {room.surface} m²</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Users size={12} /> {room.capacity} pers.</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {room.equipment.slice(0, 3).map(e => (
                    <span key={e} className="bg-gray-50 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{e}</span>
                  ))}
                  {room.equipment.length > 3 && (
                    <span className="bg-gray-50 text-gray-400 text-[10px] px-2 py-0.5 rounded-full">+{room.equipment.length - 3}</span>
                  )}
                </div>
                <button
                  disabled={!valid}
                  onClick={() => onChange({ room })}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selected ? 'bg-[#005AA9] text-white' :
                    !valid ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    'bg-[#D8ECFA] text-[#005AA9] hover:bg-[#005AA9] hover:text-white'
                  }`}
                >
                  {selected ? '✓ Sélectionnée' : !valid ? 'Capacité insuffisante' : 'Choisir cette salle'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.room} step={8} />
    </div>
  )
}

// Step 9 - Login
function StepLogin({ onNext, onBack }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Connexion ONEE"
        subtitle="Authentifiez-vous pour finaliser votre réservation."
        breadcrumb={['Réservation', '...', 'Salle', 'Connexion']}
      />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#005AA9] rounded-xl flex items-center justify-center">
              <LogIn size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1F2937]">Espace ONEE</p>
              <p className="text-xs text-gray-500">Authentification sécurisée</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email professionnel</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="prenom.nom@onee.ma"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9] focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-3 bg-[#005AA9] hover:bg-[#004a8a] text-white font-semibold rounded-xl transition-colors mb-4"
          >
            Se connecter
          </button>

          <div className="relative flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
            <Shield size={16} className="text-[#005AA9]" />
            Connexion SSO ONEE
          </button>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} step={9} />
    </div>
  )
}

// Step 10 - Summary
function StepSummary({ data, onBack, onConfirm }: any) {
  const EQUIP_LABELS: Record<string, string> = {
    projector: 'Vidéoprojecteur', paperboard: 'Paperboard', whiteboard: 'Tableau blanc',
    interactive: 'Écran interactif', micro: 'Micro', internet: 'Internet',
    computer: 'Ordinateur', camera: 'Caméra', visio: 'Visioconférence', other: 'Autres',
  }
  const rows = [
    { label: 'Date', value: data.date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'Horaire', value: `${data.startTime} – ${data.endTime}` },
    { label: 'Salle', value: data.room?.name },
    { label: 'Étage', value: data.room?.floor },
    { label: 'Participants', value: `${data.participants} personnes` },
    { label: 'Pause café', value: data.coffeeBreak ? 'Oui' : 'Non' },
    { label: 'Déjeuner', value: data.lunch ? (data.lunchType === 'self-service' ? 'Self service' : 'Service à table') : 'Non' },
    { label: 'Équipements', value: data.equipment.length > 0 ? data.equipment.map((e: string) => EQUIP_LABELS[e] || e).join(', ') : 'Aucun' },
    { label: 'Invités', value: `${data.participantsList.length} participant${data.participantsList.length !== 1 ? 's' : ''}` },
  ]
  return (
    <div className="animate-fadeIn">
      <StepHeader
        title="Résumé de la réservation"
        subtitle="Vérifiez les informations avant de confirmer."
        breadcrumb={['Réservation', '...', 'Connexion', 'Résumé']}
      />
      <div className="max-w-2xl mx-auto">
        {data.room && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
            <div className="aspect-[16/5] bg-gray-100">
              <img src={data.room.image} alt={data.room.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1F2937] text-lg">{data.room.name}</h3>
                  <p className="text-gray-500 text-sm">{data.room.floor} · {data.room.surface} m² · {data.room.capacity} personnes max.</p>
                </div>
                <Badge status="available" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-gray-500 font-medium">{label}</span>
              <span className="text-sm font-semibold text-[#1F2937] text-right max-w-[60%]">{value || '—'}</span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5 flex items-start gap-3">
          <FileCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            Après confirmation, votre demande sera transmise à l'administrateur pour validation. Vous recevrez une notification par email.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={18} /> Modifier
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Check size={18} /> Confirmer la réservation
        </button>
      </div>
    </div>
  )
}

// Success screen
function SuccessScreen({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="text-center py-16 animate-scaleIn">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={48} className="text-[#16A34A]" />
      </div>
      <h2 className="text-3xl font-bold text-[#1F2937] mb-3">Réservation enregistrée !</h2>
      <p className="text-gray-500 text-lg mb-2">Votre demande a été transmise à l'administrateur.</p>
      <p className="text-gray-400 text-sm mb-2">Référence : <span className="font-semibold text-[#005AA9]">RES-2024-{String(Math.floor(Math.random() * 900) + 100)}</span></p>
      <p className="text-gray-400 text-sm mb-10">Vous recevrez une confirmation par email à l'adresse <span className="font-medium">a.benali@onee.ma</span></p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onNavigate('user-dashboard')}
          className="px-6 py-3 bg-[#005AA9] hover:bg-[#004a8a] text-white rounded-xl font-semibold transition-colors"
        >
          Voir mes réservations
        </button>
        <button
          onClick={() => onNavigate('landing')}
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}

export default function BookingWizard({ onNavigate }: Props) {
  const [step, setStep] = useState(1)
  const [confirmed, setConfirmed] = useState(false)
  const [data, setData] = useState<BookingData>({
    date: null,
    startTime: '',
    endTime: '',
    participants: 5,
    coffeeBreak: null as boolean | null,
    lunch: null,
    lunchType: null,
    participantsList: [],
    equipment: [],
    room: null,
  })

  const update = (patch: Partial<BookingData>) => setData(d => ({ ...d, ...patch }))
  const next = () => setStep(s => Math.min(10, s + 1))
  const back = () => {
    if (step === 1) onNavigate('landing')
    else setStep(s => s - 1)
  }

  if (confirmed) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <SuccessScreen onNavigate={onNavigate} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <BookingProgress currentStep={step} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {step === 1 && <StepDate data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 2 && <StepTime data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 3 && <StepParticipants data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 4 && <StepCoffee data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 5 && <StepLunch data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 6 && <StepParticipantsList data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 7 && <StepEquipment data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 8 && <StepRoom data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 9 && <StepLogin data={data} onChange={update} onNext={next} onBack={back} />}
        {step === 10 && <StepSummary data={data} onBack={back} onConfirm={() => setConfirmed(true)} />}
      </div>
    </div>
  )
}
