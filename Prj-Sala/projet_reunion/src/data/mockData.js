// Mock Data — SALA Réunion
// Données de démonstration réalistes

export const DEMO_USERS = [
  { id: 1, matricule: 'CAD-1042', firstName: 'Yassine', lastName: 'Amrani', name: 'Yassine Amrani', email: 'y.amrani@office.ma', entity: 'Direction Commerciale', role: 'user', active: true, password: 'Cadre2026!' },
  { id: 2, matricule: 'ADM-001',  firstName: 'Nadia',   lastName: 'El Fassi', name: 'Nadia El Fassi', email: 'n.elfassi@office.ma', entity: 'Moyens Généraux', role: 'admin', active: true, password: 'Admin2026!' },
  { id: 3, matricule: 'CAD-2091', firstName: 'Mehdi',   lastName: 'Benhaddou', name: 'Mehdi Benhaddou', email: 'm.benhaddou@office.ma', entity: 'Direction Financière', role: 'user', active: true, password: 'Cadre2026!' },
  { id: 4, matricule: 'CAD-3045', firstName: 'Houda',   lastName: 'Mansouri', name: 'Houda Mansouri', email: 'h.mansouri@office.ma', entity: 'Direction RH', role: 'user', active: true, password: 'Cadre2026!' },
  { id: 5, matricule: 'CAD-1187', firstName: 'Omar',    lastName: 'Zekri', name: 'Omar Zekri', email: 'o.zekri@office.ma', entity: 'Direction Technique', role: 'user', active: false, password: 'Cadre2026!' },
  { id: 6, matricule: 'CAD-2234', firstName: 'Sanaa',   lastName: 'Tahiri', name: 'Sanaa Tahiri', email: 's.tahiri@office.ma', entity: 'Direction Juridique', role: 'user', active: true, password: 'Cadre2026!' },
  { id: 7, matricule: 'CAD-3302', firstName: 'Amine',   lastName: 'Cherkaoui', name: 'Amine Cherkaoui', email: 'a.cherkaoui@office.ma', entity: 'Direction IT', role: 'user', active: true, password: 'Cadre2026!' },
];

export const DEMO_ROOMS = [
  {
    id: 1, name: 'Salle Atlas', floor: '2e étage', building: 'Bâtiment A',
    capacity: 14, surface: '42 m²',
    description: 'Grande salle de conférence équipée pour les réunions de direction avec visioconférence HD.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    accent: '#078d91',
    equipment: ['Écran 4K', 'Visioconférence', 'Tableau blanc', 'Microphone', 'Caméra HD', 'Internet fibre'],
    available: true,
  },
  {
    id: 2, name: 'Salle Oasis', floor: 'RDC', building: 'Bâtiment B',
    capacity: 8, surface: '24 m²',
    description: 'Salle agile conçue pour les petites équipes et les ateliers créatifs.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    accent: '#156aa3',
    equipment: ['Teams Room', 'Tableau interactif', 'Paperboard', 'Internet'],
    available: true,
  },
  {
    id: 3, name: 'Salle Horizon', floor: '4e étage', building: 'Direction Générale',
    capacity: 20, surface: '65 m²',
    description: 'Espace premium de la direction générale avec vue panoramique, idéal pour les comités de direction.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    accent: '#ef922f',
    equipment: ['Double écran', 'Sonorisation', 'Caméra 360°', 'Visioconférence', 'Tableau blanc', 'Ordinateur'],
    available: true,
  },
  {
    id: 4, name: 'Salle Sahara', floor: '1er étage', building: 'Bâtiment C',
    capacity: 6, surface: '18 m²',
    description: 'Petite salle de réunion intime pour les entretiens et réunions restreintes.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    accent: '#c25b14',
    equipment: ['Écran', 'Paperboard', 'Internet'],
    available: false,
  },
  {
    id: 5, name: 'Salle Rif', floor: '3e étage', building: 'Bâtiment A',
    capacity: 30, surface: '90 m²',
    description: 'Grande salle de formation et séminaires avec disposition flexible.',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80',
    accent: '#1a7a8a',
    equipment: ['Vidéoprojecteur', 'Tableau blanc', 'Microphone', 'Sonorisation', 'Internet', 'Ordinateur'],
    available: true,
  },
];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const addDays = (n) => {
  const d = new Date(); d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export const DEMO_RESERVATIONS = [
  { id: 1, roomId: 1, userId: 1, userName: 'Yassine Amrani', userEntity: 'Direction Commerciale', date: today(), startTime: '09:00', endTime: '11:00', purpose: 'Comité de pilotage Q3', attendees: 10, coffeeBreak: true, lunch: false, lunchType: null, status: 'confirmed', equipment: ['Visioconférence', 'Tableau blanc'], createdAt: new Date().toISOString() },
  { id: 2, roomId: 2, userId: 3, userName: 'Mehdi Benhaddou', userEntity: 'Direction Financière', date: today(), startTime: '14:00', endTime: '15:30', purpose: 'Revue budgétaire mensuelle', attendees: 5, coffeeBreak: false, lunch: false, lunchType: null, status: 'confirmed', equipment: ['Tableau interactif'], createdAt: new Date().toISOString() },
  { id: 3, roomId: 3, userId: 2, userName: 'Nadia El Fassi', userEntity: 'Moyens Généraux', date: today(), startTime: '10:00', endTime: '12:00', purpose: 'Conseil de direction', attendees: 18, coffeeBreak: true, lunch: true, lunchType: 'Service à table', status: 'confirmed', equipment: ['Double écran', 'Visioconférence'], createdAt: new Date().toISOString() },
  { id: 4, roomId: 1, userId: 4, userName: 'Houda Mansouri', userEntity: 'Direction RH', date: addDays(1), startTime: '09:30', endTime: '11:30', purpose: 'Entretiens annuels RH', attendees: 8, coffeeBreak: true, lunch: false, lunchType: null, status: 'confirmed', equipment: ['Écran 4K', 'Microphone'], createdAt: new Date().toISOString() },
  { id: 5, roomId: 2, userId: 1, userName: 'Yassine Amrani', userEntity: 'Direction Commerciale', date: addDays(2), startTime: '11:00', endTime: '12:30', purpose: 'Point hebdomadaire équipe', attendees: 6, coffeeBreak: false, lunch: false, lunchType: null, status: 'confirmed', equipment: ['Teams Room'], createdAt: new Date().toISOString() },
  { id: 6, roomId: 5, userId: 7, userName: 'Amine Cherkaoui', userEntity: 'Direction IT', date: addDays(3), startTime: '08:30', endTime: '17:00', purpose: 'Formation Cybersécurité', attendees: 25, coffeeBreak: true, lunch: true, lunchType: 'Self Service', status: 'confirmed', equipment: ['Vidéoprojecteur', 'Ordinateur', 'Microphone'], createdAt: new Date().toISOString() },
  { id: 7, roomId: 4, userId: 6, userName: 'Sanaa Tahiri', userEntity: 'Direction Juridique', date: addDays(-2), startTime: '15:00', endTime: '16:30', purpose: 'Réunion contrats', attendees: 4, coffeeBreak: false, lunch: false, lunchType: null, status: 'cancelled', equipment: [], createdAt: new Date().toISOString() },
  { id: 8, roomId: 1, userId: 1, userName: 'Yassine Amrani', userEntity: 'Direction Commerciale', date: addDays(-5), startTime: '10:00', endTime: '12:00', purpose: 'Réunion partenaires', attendees: 12, coffeeBreak: true, lunch: false, lunchType: null, status: 'confirmed', equipment: ['Visioconférence', 'Caméra HD'], createdAt: new Date().toISOString() },
];

export const DEMO_WAITLIST = [
  { id: 1, userId: 3, userName: 'Mehdi Benhaddou', userEntity: 'Direction Financière', date: addDays(1), startTime: '14:00', endTime: '16:00', attendees: 12, purpose: 'Présentation résultats S1', coffeeBreak: true, status: 'pending', createdAt: new Date().toISOString() },
  { id: 2, userId: 6, userName: 'Sanaa Tahiri', userEntity: 'Direction Juridique', date: addDays(2), startTime: '09:00', endTime: '11:00', attendees: 7, purpose: 'Atelier conformité RGPD', coffeeBreak: false, status: 'pending', createdAt: new Date().toISOString() },
];

export const DEMO_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Réservation confirmée', message: 'Votre réservation de la Salle Atlas le ' + today() + ' de 09:00 à 11:00 est confirmée.', time: 'Il y a 2h', read: false },
  { id: 2, type: 'info', title: 'Rappel de réunion', message: 'Vous avez une réunion dans 30 minutes : Comité de pilotage Q3 en Salle Atlas.', time: 'Il y a 3h', read: false },
  { id: 3, type: 'warning', title: 'Demande en attente', message: 'Votre demande de salle pour le ' + addDays(1) + ' est en cours de traitement.', time: 'Hier', read: true },
  { id: 4, type: 'success', title: 'Pause-café validée', message: 'La pause-café pour votre réunion du ' + today() + ' a été confirmée par les services généraux.', time: 'Hier', read: true },
  { id: 5, type: 'info', title: 'Nouveau créneau disponible', message: 'La Salle Horizon est maintenant disponible pour demain de 14h à 16h.', time: 'Il y a 2 jours', read: true },
];

export const DEMO_LOGS = [
  { id: 1, action: 'create', message: 'Réservation Salle Atlas créée par Yassine Amrani', user: 'CAD-1042', time: new Date().toISOString() },
  { id: 2, action: 'login', message: 'Connexion de Nadia El Fassi depuis 192.168.1.45', user: 'ADM-001', time: new Date(Date.now()-3600000).toISOString() },
  { id: 3, action: 'update', message: 'Capacité de la Salle Rif modifiée : 25 → 30 personnes', user: 'ADM-001', time: new Date(Date.now()-7200000).toISOString() },
  { id: 4, action: 'delete', message: 'Réservation #7 annulée par Sanaa Tahiri', user: 'CAD-2234', time: new Date(Date.now()-86400000).toISOString() },
  { id: 5, action: 'create', message: 'Utilisateur Amine Cherkaoui ajouté à l\'annuaire', user: 'ADM-001', time: new Date(Date.now()-172800000).toISOString() },
  { id: 6, action: 'update', message: 'Statut de la demande #2 mis à jour : en attente', user: 'ADM-001', time: new Date(Date.now()-259200000).toISOString() },
];

export const EQUIPMENT_LIST = [
  { id: 'projector',    label: 'Vidéoprojecteur', icon: '📽️' },
  { id: 'whiteboard',   label: 'Tableau blanc',   icon: '🪟' },
  { id: 'paperboard',   label: 'Paperboard',      icon: '📋' },
  { id: 'interactive',  label: 'Écran interactif', icon: '🖥️' },
  { id: 'internet',     label: 'Internet',        icon: '🌐' },
  { id: 'camera',       label: 'Caméra',          icon: '📷' },
  { id: 'microphone',   label: 'Microphone',      icon: '🎤' },
  { id: 'computer',     label: 'Ordinateur',      icon: '💻' },
  { id: 'visio',        label: 'Visioconférence', icon: '📹' },
  { id: 'other',        label: 'Autres',          icon: '➕' },
];

export const DEPARTMENTS = [
  'Direction Générale', 'Direction Commerciale', 'Direction Financière',
  'Direction RH', 'Direction Technique', 'Direction Juridique',
  'Direction IT', 'Moyens Généraux', 'Direction Audit',
  'Direction Communication', 'Direction Achats',
];

// Helpers
export const pad = (n) => String(n).padStart(2, '0');
export const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
export const todayStr = () => isoDate(new Date());
export const initials = (name) => name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();
export const longDate = (v) => new Intl.DateTimeFormat('fr-MA', { weekday:'long', day:'numeric', month:'long', year:'numeric' }).format(new Date(`${v}T12:00:00`));
export const shortDate = (v) => new Intl.DateTimeFormat('fr-MA', { day:'2-digit', month:'short' }).format(new Date(`${v}T12:00:00`));
export const addDaysStr = (v, n) => { const d = new Date(`${v}T12:00:00`); d.setDate(d.getDate()+n); return isoDate(d); };
export const overlaps = (r, date, s, e) => r.status === 'confirmed' && r.date === date && r.startTime < e && r.endTime > s;
