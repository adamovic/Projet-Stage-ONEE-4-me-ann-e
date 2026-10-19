interface Props {
  status: 'confirmed' | 'pending' | 'refused' | 'cancelled' | 'available' | 'unavailable'
  size?: 'sm' | 'md'
}

const config = {
  confirmed: { label: 'Confirmée', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  pending: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  refused: { label: 'Refusée', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  cancelled: { label: 'Annulée', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  available: { label: 'Disponible', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  unavailable: { label: 'Occupée', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
}

export default function Badge({ status, size = 'md' }: Props) {
  const c = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
