import { useState, useEffect } from 'react'
import {
  ArrowRight, Calendar, Users, Clock, CheckCircle, Bell, Zap,
  BarChart2, Building2, ChevronRight, Shield, Layers, Globe
} from 'lucide-react'
import ONEELogo from '../components/ONEELogo'
import type { View } from '../types'
import { STATS } from '../data/mockData'

interface Props {
  onNavigate: (v: View) => void
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}{suffix}</span>
}

const features = [
  {
    icon: Zap,
    title: 'Réservation rapide',
    desc: 'Réservez une salle en moins de 2 minutes grâce à notre assistant intelligent en 10 étapes guidées.',
    color: '#005AA9',
  },
  {
    icon: Calendar,
    title: 'Disponibilité en temps réel',
    desc: 'Consultez la disponibilité des salles en temps réel et évitez les conflits de réservation.',
    color: '#0E76BD',
  },
  {
    icon: Layers,
    title: 'Gestion automatisée',
    desc: 'Gestion automatique des équipements, pauses café et repas. Tout est pris en charge.',
    color: '#F2C100',
  },
  {
    icon: Bell,
    title: 'Notifications intelligentes',
    desc: 'Recevez des rappels et notifications pour chaque étape de votre réservation.',
    color: '#005AA9',
  },
  {
    icon: Shield,
    title: 'Authentification sécurisée',
    desc: 'Connexion sécurisée via SSO ONEE. Vos données sont protégées et confidentielles.',
    color: '#0E76BD',
  },
  {
    icon: Globe,
    title: 'Accessible partout',
    desc: 'Disponible sur tous vos appareils : ordinateur, tablette et mobile.',
    color: '#F2C100',
  },
]

export default function LandingPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#003a70] via-[#005AA9] to-[#0E76BD] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            width: '100%',
            height: '100%',
          }} />
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F2C100] opacity-5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D8ECFA] opacity-5 rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">
          {/* Official ONEE logo — hero placement */}
          <div className="mb-12 flex justify-start animate-fadeIn">
            <div className="bg-white rounded-2xl px-7 py-4 shadow-xl shadow-black/10 inline-flex items-center">
              <ONEELogo size="lg" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-[#F2C100] rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Plateforme de réservation des salles de réunion</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white leading-tight mb-6">
                Réservez votre salle{' '}
                <span className="text-[#F2C100]">en quelques clics</span>
              </h1>

              <p className="text-xl text-white/80 leading-relaxed mb-10 max-w-lg">
                Une plateforme intelligente pour simplifier l'organisation de vos réunions au sein du siège de l'ONEE.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('booking')}
                  className="group inline-flex items-center justify-center gap-2 bg-[#F2C100] hover:bg-[#e0b300] text-[#1F2937] font-semibold px-7 py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Calendar size={20} />
                  Réserver une salle
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('room-detail')}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-4 rounded-xl border border-white/20 transition-all hover:-translate-y-0.5"
                >
                  <Building2 size={20} />
                  Découvrir les salles
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/10">
                {[
                  { icon: Shield, label: 'SSO Sécurisé' },
                  { icon: CheckCircle, label: 'WCAG 2.2' },
                  { icon: Globe, label: 'Responsive' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-white/70 text-sm">
                    <Icon size={15} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Illustration Card */}
            <div className="hidden lg:block animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Main room card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="rounded-xl overflow-hidden mb-5 aspect-[4/3] bg-white/5">
                    <img
                      src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=500&h=375&fit=crop&auto=format"
                      alt="Salle de réunion ONEE"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">Salle Atlas</h3>
                      <p className="text-white/70 text-sm">3ème étage • 65 m²</p>
                    </div>
                    <span className="bg-green-400/20 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full border border-green-400/30">
                      Disponible
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-white/70 text-sm mb-5">
                    <span className="flex items-center gap-1.5"><Users size={14} /> 20 pers.</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> 09:00 – 17:00</span>
                  </div>
                  <button className="w-full bg-[#F2C100] hover:bg-[#e0b300] text-[#1F2937] font-semibold py-3 rounded-xl transition-colors text-sm">
                    Réserver maintenant
                  </button>
                </div>

                {/* Floating booking notification */}
                <div className="absolute -top-4 -right-6 bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Réservation confirmée</p>
                      <p className="text-xs text-gray-500">RES-2024-0312 · 09:00</p>
                    </div>
                  </div>
                </div>

                {/* Floating users indicator */}
                <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['#005AA9', '#0E76BD', '#F2C100'].map((c, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: c }}>
                          {['A', 'F', 'K'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">14 participants</p>
                      <p className="text-xs text-gray-500">Réunion en cours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 50 960 10 720 30C480 50 240 0 0 20L0 60Z" fill="#F8F9FB" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#F8F9FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Salles disponibles', value: STATS.totalRooms, icon: Building2, color: '#005AA9', bg: '#D8ECFA' },
              { label: 'Réservations aujourd\'hui', value: STATS.todayReservations, icon: Calendar, color: '#0E76BD', bg: '#D8ECFA' },
              { label: 'Taux d\'occupation', value: STATS.occupancyRate, suffix: '%', icon: BarChart2, color: '#F2C100', bg: '#FEF9E7' },
              { label: 'Utilisateurs actifs', value: STATS.totalUsers, icon: Users, color: '#005AA9', bg: '#D8ECFA' },
            ].map(({ label, value, icon: Icon, color, bg, suffix }) => (
              <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: bg }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
                <p className="text-3xl font-bold text-[#1F2937] mb-1">
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[#005AA9] text-sm font-semibold tracking-wider uppercase mb-3 bg-[#D8ECFA] px-4 py-1.5 rounded-full">
              Fonctionnalités
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Une plateforme complète pour simplifier la gestion des espaces de réunion au sein de l'ONEE.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-[#D8ECFA] hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: f.color === '#F2C100' ? '#FEF9E7' : '#D8ECFA' }}
                >
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#005AA9] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à réserver votre prochaine réunion ?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les {STATS.totalUsers} utilisateurs qui font confiance à notre plateforme.
          </p>
          <button
            onClick={() => onNavigate('booking')}
            className="inline-flex items-center gap-2 bg-[#F2C100] hover:bg-[#e0b300] text-[#1F2937] font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Calendar size={20} />
            Commencer maintenant
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="lg:col-span-2">
              {/* Real ONEE logo on dark background — white pill to preserve legibility */}
              <div className="inline-flex mb-5 bg-white rounded-xl px-5 py-3">
                <ONEELogo size="sm" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Plateforme de gestion intelligente des salles de réunion pour les collaborateurs du siège de l'ONEE.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Navigation</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {['Accueil', 'Réserver une salle', 'Découvrir les salles', 'Mon espace'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Assistance</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {['Centre d\'aide', 'Politique de confidentialité', 'Contact DSI', 'Signaler un problème'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
            <p>© {new Date().getFullYear()} ONEE — Tous droits réservés.</p>
            <p>Direction des Systèmes d'Information · Version 2.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
