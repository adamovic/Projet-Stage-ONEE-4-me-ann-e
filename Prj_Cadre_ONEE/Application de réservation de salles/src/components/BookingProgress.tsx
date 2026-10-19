import { Check } from 'lucide-react'

const STEPS = [
  'Date', 'Créneau', 'Participants', 'Pause café',
  'Déjeuner', 'Invités', 'Logistique', 'Salle', 'Connexion', 'Résumé',
]

interface Props {
  currentStep: number
}

export default function BookingProgress({ currentStep }: Props) {
  const pct = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)

  return (
    <div className="bg-white border-b border-gray-100 py-5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Step label */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-[#005AA9] uppercase tracking-wider mb-0.5">
              Étape {currentStep} sur {STEPS.length}
            </p>
            <p className="text-sm font-semibold text-[#1F2937]">{STEPS[currentStep - 1]}</p>
          </div>
          <span className="text-sm font-bold text-[#005AA9]">{pct}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#005AA9] to-[#0E76BD] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Steps dots - desktop */}
        <div className="hidden sm:flex items-center justify-between mt-3">
          {STEPS.map((label, i) => {
            const step = i + 1
            const done = step < currentStep
            const active = step === currentStep
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    done ? 'bg-[#005AA9] text-white' :
                    active ? 'bg-[#005AA9] text-white ring-4 ring-[#D8ECFA]' :
                    'bg-gray-100 text-gray-400'
                  }`}
                >
                  {done ? <Check size={11} /> : step}
                </div>
                <span className={`text-[10px] font-medium ${active ? 'text-[#005AA9]' : done ? 'text-gray-500' : 'text-gray-300'}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
