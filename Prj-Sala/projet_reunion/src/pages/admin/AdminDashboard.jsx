import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge, Button, Card, Segmented, Dialog, Field, EmptyState,
  MetricCard, Toast, SectionHeader,
} from '../../components/ui/index.jsx';
import {
  DEMO_ROOMS, DEMO_RESERVATIONS, DEMO_USERS, DEMO_WAITLIST, DEMO_LOGS,
  todayStr, shortDate, longDate, initials, pad, overlaps,
} from '../../data/mockData.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// ── Chart data ────────────────────────────────────────
const chartData = [
  { day: 'Lun', reservations: 4 },
  { day: 'Mar', reservations: 7 },
  { day: 'Mer', reservations: 5 },
  { day: 'Jeu', reservations: 9 },
  { day: 'Ven', reservations: 6 },
  { day: 'Sam', reservations: 2 },
  { day: 'Dim', reservations: 1 },
];
const occupancyData = [
  { name: 'Confirmées', value: 68, color: '#078d91' },
  { name: 'En attente', value: 14, color: '#ee922f' },
  { name: 'Annulées',   value: 18, color: '#a8424b' },
];
const trendData = [
  { month: 'Avr', val: 45 },
  { month: 'Mai', val: 62 },
  { month: 'Jun', val: 58 },
  { month: 'Jul', val: 74 },
];

// ── Sidebar ───────────────────────────────────────────
function AdminSidebar({ view, setView, session, onLogout }) {
  const nav = [
    { id: 'overview',    label: 'Vue d\'ensemble',    icon: '⌂' },
    { id: 'reservations',label: 'Réservations',       icon: '▦',  badge: DEMO_WAITLIST.filter(w => w.status === 'pending').length },
    { id: 'salles',      label: 'Gestion des salles', icon: '🏢' },
    { id: 'users',       label: 'Utilisateurs',       icon: '👥' },
    { id: 'equipements', label: 'Équipements',        icon: '🔧' },
    { id: 'calendrier',  label: 'Calendrier global',  icon: '📅' },
    { id: 'historique',  label: 'Historique',         icon: '📋' },
    { id: 'logs',        label: 'Journal d\'activité',icon: '📄' },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="logo-mark"><i /><i /><i /></span>
        <span><b>SALA</b><small>Administration</small></span>
      </div>
      <div className="nav-label">TABLEAU DE BORD ADMIN</div>
      <nav aria-label="Navigation admin">
        {nav.map(item => (
          <button
            key={item.id}
            className={view === item.id ? 'active' : ''}
            onClick={() => setView(item.id)}
            aria-current={view === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge > 0 && <em>{item.badge}</em>}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <button className="sidebar-profile" onClick={onLogout} title="Se déconnecter">
        <span className="avatar orange">{session ? initials(session.name) : '?'}</span>
        <span>
          <b>{session?.name}</b>
          <small>Administrateur</small>
        </span>
        <span style={{ color: '#7695a2', fontSize: 14 }}>↗</span>
      </button>
    </aside>
  );
}

// ── Overview ──────────────────────────────────────────
function Overview({ setView }) {
  const today = todayStr();
  const todayRes = DEMO_RESERVATIONS.filter(r => r.date === today && r.status === 'confirmed');
  const pending  = DEMO_WAITLIST.filter(w => w.status === 'pending');

  return (
    <div className="page-enter">
      <SectionHeader eyebrow="ADMINISTRATION" title="Vue d'ensemble" subtitle="Tableau de bord en temps réel." />

      {/* KPI Metrics */}
      <div className="metric-grid" style={{ marginBottom: 20 }}>
        <MetricCard label="SALLES ACTIVES"        value={DEMO_ROOMS.filter(r => r.available).length} subtext={`/${DEMO_ROOMS.length} salles`} icon="🏢" iconColor="teal" />
        <MetricCard label="RÉSERVATIONS DU JOUR"  value={todayRes.length}    subtext="confirmées"     icon="▦" iconColor="blue"   accent />
        <MetricCard label="DEMANDES EN ATTENTE"   value={pending.length}     subtext="à traiter"      icon="⏳" iconColor="orange" />
        <MetricCard label="COLLABORATEURS ACTIFS" value={DEMO_USERS.filter(u => u.active).length} subtext={`/${DEMO_USERS.length} inscrits`} icon="👥" iconColor="navy" />
      </div>

      <div className="admin-grid-2">
        {/* Chart */}
        <Card padding>
          <p className="eyebrow" style={{ marginBottom: 4 }}>RÉSERVATIONS CETTE SEMAINE</p>
          <h3 style={{ marginBottom: 20 }}>Activité hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={22}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6d8492' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6d8492' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--line)' }} />
              <Bar dataKey="reservations" fill="#078d91" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart + today */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card padding>
            <p className="eyebrow" style={{ marginBottom: 12 }}>RÉPARTITION DES STATUTS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <PieChart width={100} height={100}>
                <Pie data={occupancyData} cx={45} cy={45} innerRadius={28} outerRadius={45} dataKey="value">
                  {occupancyData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {occupancyData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flex: 'none' }} />
                    <span>{d.name}</span>
                    <b style={{ marginLeft: 'auto' }}>{d.value}%</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card padding>
            <p className="eyebrow" style={{ marginBottom: 12 }}>TENDANCE MENSUELLE</p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={trendData}>
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6d8492' }} axisLine={false} tickLine={false} />
                <Line type="monotone" dataKey="val" stroke="#078d91" strokeWidth={2.5} dot={{ fill: '#078d91', r: 3 }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Today's activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr .7fr', gap: 14, marginTop: 14 }}>
        <Card padding>
          <p className="eyebrow" style={{ marginBottom: 4 }}>ACTIVITÉ DU JOUR</p>
          <h3 style={{ marginBottom: 16 }}>Réservations confirmées</h3>
          {todayRes.length > 0 ? todayRes.map(r => {
            const room = DEMO_ROOMS.find(x => x.id === r.roomId);
            return (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 12, alignItems: 'center', borderTop: '1px solid #edf1f2', padding: '12px 0' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--teal)' }}>{r.startTime}</span>
                <div>
                  <b style={{ fontSize: 12 }}>{r.purpose}</b>
                  <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{room?.name} · {r.userName}</p>
                </div>
                <Badge tone="success">✓</Badge>
              </div>
            );
          }) : <EmptyState icon="▦" title="Aucune réunion aujourd'hui" text="L'activité apparaîtra ici." />}
        </Card>
        <Card padding>
          <p className="eyebrow" style={{ marginBottom: 4 }}>À TRAITER</p>
          <h3 style={{ marginBottom: 16 }}>Demandes en attente</h3>
          {pending.length > 0 ? pending.slice(0, 4).map(w => (
            <button key={w.id} onClick={() => setView('reservations')} style={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10, border: 0, borderTop: '1px solid #edf1f2', background: 'transparent', padding: '11px 0', textAlign: 'left', cursor: 'pointer' }}>
              <span className="avatar xs">{initials(w.userName)}</span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <b style={{ fontSize: 10 }}>{w.userName}</b>
                <small style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{shortDate(w.date)} · {w.startTime}–{w.endTime}</small>
              </span>
              <span style={{ color: 'var(--teal)', fontSize: 12 }}>→</span>
            </button>
          )) : <EmptyState icon="✓" title="Tout est à jour" text="Aucune demande." />}
        </Card>
      </div>
    </div>
  );
}

// ── Reservations Admin ────────────────────────────────
function ReservationsAdmin() {
  const [tab, setTab] = useState('all');
  const today = todayStr();
  const all      = DEMO_RESERVATIONS;
  const todayRes = all.filter(r => r.date === today);
  const pending  = DEMO_WAITLIST.filter(w => w.status === 'pending');
  const [query, setQuery] = useState('');

  const filtered = all.filter(r =>
    `${r.userName} ${r.purpose} ${r.date}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="GESTION DES RÉSERVATIONS"
        title="Réservations"
        actions={
          <Segmented value={tab} onChange={setTab} items={[
            { value: 'all',     label: `Toutes (${all.length})` },
            { value: 'today',   label: `Aujourd'hui (${todayRes.length})` },
            { value: 'pending', label: `En attente (${pending.length})` },
          ]} />
        }
      />

      {tab !== 'pending' && (
        <Card padding={false} style={{ marginBottom: 16, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <b style={{ fontSize: 14 }}>Liste des réservations</b>
              <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{filtered.length} entrées</p>
            </div>
            <input
              className="search-input"
              placeholder="Rechercher nom, objet, date…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="data-table-wrap">
            <div className="data-thead" style={{ gridTemplateColumns: '1.4fr .8fr 1fr .8fr .65fr .65fr' }}>
              {['COLLABORATEUR','DATE','OBJET','SALLE','PARTICIPANTS','STATUT'].map(h => (
                <span key={h}>{h}</span>
              ))}
            </div>
            {(tab === 'today' ? todayRes : filtered).map(r => {
              const room = DEMO_ROOMS.find(x => x.id === r.roomId);
              return (
                <div key={r.id} className="data-trow" style={{ gridTemplateColumns: '1.4fr .8fr 1fr .8fr .65fr .65fr' }}>
                  <span className="user-cell">
                    <span className="avatar xs">{initials(r.userName)}</span>
                    <span>
                      <b>{r.userName}</b>
                      <small>{r.userEntity}</small>
                    </span>
                  </span>
                  <span><b>{shortDate(r.date)}</b><br/><small style={{color:'var(--muted)',fontSize:9}}>{r.startTime}–{r.endTime}</small></span>
                  <span>{r.purpose}</span>
                  <span>{room?.name || '—'}</span>
                  <span style={{ textAlign: 'center' }}><b>{r.attendees}</b></span>
                  <span>
                    <Badge tone={r.status === 'confirmed' ? 'success' : 'danger'}>
                      {r.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                    </Badge>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === 'pending' && (
        <Card padding>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <b style={{ fontSize: 14 }}>Demandes en attente</b>
            <Badge tone={pending.length ? 'warning' : 'success'}>{pending.length ? `${pending.length} à traiter` : 'Tout traité'}</Badge>
          </div>
          {pending.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pending.map(w => {
                const user = DEMO_USERS.find(u => u.id === w.userId);
                return (
                  <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '50px 36px 1fr auto', gap: 12, alignItems: 'center', borderTop: '1px solid #edf1f2', padding: '14px 0' }}>
                    <div style={{ height: 50, borderRadius: 10, background: '#fff3e4', color: '#c7741d', display: 'grid', placeItems: 'center', padding: 5 }}>
                      <b style={{ fontSize: 18 }}>{w.date.slice(8)}</b>
                      <small style={{ fontSize: 8, textTransform: 'uppercase' }}>{new Intl.DateTimeFormat('fr', { month: 'short' }).format(new Date(`${w.date}T12:00`))}</small>
                    </div>
                    <span className="avatar xs">{initials(w.userName)}</span>
                    <div>
                      <b style={{ fontSize: 12 }}>{w.purpose}</b>
                      <p style={{ fontSize: 10, color: 'var(--muted)', margin: '3px 0 6px' }}>{w.userName} · {w.attendees} participants</p>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <Badge tone="info">{w.startTime}–{w.endTime}</Badge>
                        {w.coffeeBreak && <Badge tone="warning">☕</Badge>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="outline" size="sm">Refuser</Button>
                      <Button size="sm">Affecter</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <EmptyState icon="✓" title="Aucune demande en attente" text="Toutes les demandes ont été traitées." />}
        </Card>
      )}
    </div>
  );
}

// ── Rooms Admin ───────────────────────────────────────
function RoomsAdmin() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="GESTION DES SALLES"
        title="Salles de réunion"
        subtitle={`${DEMO_ROOMS.length} salles enregistrées`}
        actions={<Button onClick={() => setAddOpen(true)}>+ Ajouter une salle</Button>}
      />
      <div className="admin-rooms-grid">
        {DEMO_ROOMS.map(room => (
          <div key={room.id} className="admin-room-card">
            <div className="admin-room-photo" style={{ backgroundImage: `url(${room.image})` }}>
              <Badge tone={room.available ? 'success' : 'danger'}>
                {room.available ? '● Active' : '● Inactive'}
              </Badge>
            </div>
            <div className="admin-room-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3>{room.name}</h3>
                <Badge tone="teal">♙ {room.capacity}</Badge>
              </div>
              <p>{room.floor} · {room.building} · {room.surface}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, margin: '6px 0 10px' }}>{room.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {room.equipment.slice(0,3).map(eq => (
                  <span key={eq} style={{ background: '#eef2f4', color: '#617481', padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 600 }}>{eq}</span>
                ))}
                {room.equipment.length > 3 && (
                  <span style={{ background: '#eef2f4', color: '#617481', padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 600 }}>+{room.equipment.length - 3}</span>
                )}
              </div>
              <div className="admin-room-footer">
                <Button variant="outline" size="sm">Modifier</Button>
                <Button variant="ghost" size="sm">Voir planning</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter une salle" eyebrow="NOUVEL ESPACE" wide>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Nom de la salle"><input placeholder="Salle Atlas" /></Field>
          <Field label="Capacité (personnes)"><input type="number" min="1" defaultValue="10" /></Field>
          <Field label="Étage"><input placeholder="2e étage" /></Field>
          <Field label="Bâtiment"><input placeholder="Bâtiment A" /></Field>
          <Field label="Surface"><input placeholder="42 m²" /></Field>
          <Field label="État"><select><option>Active</option><option>Inactive</option></select></Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Description"><textarea rows={2} placeholder="Description de la salle…" /></Field>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Équipements (séparés par virgule)"><input placeholder="Écran 4K, Visioconférence, Tableau blanc" /></Field>
          </div>
        </div>
        <div className="dialog-actions">
          <Button variant="ghost" onClick={() => setAddOpen(false)}>Annuler</Button>
          <Button onClick={() => setAddOpen(false)}>Ajouter la salle</Button>
        </div>
      </Dialog>
    </div>
  );
}

// ── Users Admin ───────────────────────────────────────
function UsersAdmin() {
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const filtered = DEMO_USERS.filter(u =>
    `${u.name} ${u.matricule} ${u.entity}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="ANNUAIRE DE L'OFFICE"
        title="Collaborateurs"
        subtitle={`${DEMO_USERS.filter(u => u.active).length} actifs · ${DEMO_USERS.length} inscrits`}
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="search-input" placeholder="Rechercher nom, matricule…" value={query} onChange={e => setQuery(e.target.value)} />
            <Button onClick={() => setAddOpen(true)}>+ Ajouter</Button>
          </div>
        }
      />
      <Card padding={false}>
        <div className="data-table-wrap">
          <div className="data-thead" style={{ gridTemplateColumns: '1.5fr .8fr 1.2fr .8fr .7fr .7fr' }}>
            {['COLLABORATEUR','MATRICULE','ENTITÉ','RÔLE','STATUT','ACTIONS'].map(h => <span key={h}>{h}</span>)}
          </div>
          {filtered.map(u => (
            <div key={u.id} className="data-trow" style={{ gridTemplateColumns: '1.5fr .8fr 1.2fr .8fr .7fr .7fr', opacity: u.active ? 1 : .6 }}>
              <span className="user-cell">
                <span className={`avatar xs ${u.role === 'admin' ? 'orange' : 'teal'}`}>{initials(u.name)}</span>
                <span><b>{u.name}</b><small>{u.email}</small></span>
              </span>
              <span><b>{u.matricule}</b></span>
              <span>{u.entity}</span>
              <span><Badge tone={u.role === 'admin' ? 'warning' : 'teal'}>{u.role === 'admin' ? 'Admin' : 'Cadre'}</Badge></span>
              <span><Badge tone={u.active ? 'success' : 'danger'}>● {u.active ? 'Actif' : 'Inactif'}</Badge></span>
              <span><Button variant="ghost" size="sm">{u.active ? 'Désactiver' : 'Réactiver'}</Button></span>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Ajouter un collaborateur" eyebrow="NOUVEAU COMPTE" wide>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Matricule"><input placeholder="CAD-0000" /></Field>
          <Field label="Rôle"><select><option>Cadre</option><option>Administrateur</option></select></Field>
          <Field label="Prénom"><input /></Field>
          <Field label="Nom"><input /></Field>
          <Field label="E-mail professionnel"><input type="email" placeholder="prenom.nom@office.ma" /></Field>
          <Field label="Entité"><input placeholder="Direction…" /></Field>
          <div style={{ gridColumn: '1/-1' }}>
            <Field label="Mot de passe temporaire"><input defaultValue="Office2026!" /></Field>
          </div>
        </div>
        <div className="dialog-actions">
          <Button variant="ghost" onClick={() => setAddOpen(false)}>Annuler</Button>
          <Button onClick={() => setAddOpen(false)}>Créer le compte</Button>
        </div>
      </Dialog>
    </div>
  );
}

// ── Equipment Admin ───────────────────────────────────
function EquipementsAdmin() {
  const equip = [
    { id: 1, name: 'Écran 4K Samsung', type: 'Écran', qty: 3, rooms: ['Salle Atlas', 'Salle Horizon'] },
    { id: 2, name: 'Système Teams Room', type: 'Visioconférence', qty: 2, rooms: ['Salle Oasis'] },
    { id: 3, name: 'Tableau blanc magnétique', type: 'Tableau', qty: 5, rooms: ['Toutes'] },
    { id: 4, name: 'Caméra Logitech 4K', type: 'Caméra', qty: 3, rooms: ['Salle Atlas', 'Salle Horizon'] },
    { id: 5, name: 'Microphone de table', type: 'Microphone', qty: 6, rooms: ['Toutes'] },
    { id: 6, name: 'Vidéoprojecteur Epson', type: 'Projecteur', qty: 2, rooms: ['Salle Rif'] },
  ];
  return (
    <div className="page-enter">
      <SectionHeader eyebrow="GESTION DES ÉQUIPEMENTS" title="Équipements" actions={<Button>+ Ajouter</Button>} />
      <Card padding={false}>
        <div className="data-table-wrap">
          <div className="data-thead" style={{ gridTemplateColumns: '1.5fr .9fr .6fr 1.3fr .7fr' }}>
            {['ÉQUIPEMENT','TYPE','QUANTITÉ','SALLES','ÉTAT'].map(h => <span key={h}>{h}</span>)}
          </div>
          {equip.map(e => (
            <div key={e.id} className="data-trow" style={{ gridTemplateColumns: '1.5fr .9fr .6fr 1.3fr .7fr' }}>
              <span><b>{e.name}</b></span>
              <span>{e.type}</span>
              <span style={{ textAlign: 'center' }}><b>{e.qty}</b></span>
              <span style={{ fontSize: 10 }}>{e.rooms.join(', ')}</span>
              <span><Badge tone="success">● Opérationnel</Badge></span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Global Calendar ───────────────────────────────────
function GlobalCalendar() {
  const today = todayStr();
  const [focusDate, setFocusDate] = useState(today);
  const focus = new Date(`${focusDate}T12:00:00`);
  const mondayOffset = (focus.getDay() + 6) % 7;
  const addD = (v, n) => { const d = new Date(`${v}T12:00:00`); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
  const weekStart = addD(focusDate, -mondayOffset);
  const days = Array.from({ length: 7 }, (_, i) => addD(weekStart, i));

  return (
    <div className="page-enter">
      <SectionHeader eyebrow="PLANIFICATION GLOBALE" title="Calendrier global" />
      <Card padding={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant="outline" size="sm" onClick={() => setFocusDate(today)}>Aujourd'hui</Button>
            <button onClick={() => setFocusDate(addD(focusDate, -7))} style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)', fontSize: 18 }}>‹</button>
            <button onClick={() => setFocusDate(addD(focusDate, 7))}  style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)', fontSize: 18 }}>›</button>
            <b style={{ fontSize: 13, textTransform: 'capitalize' }}>
              {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(focus)}
            </b>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, alignItems: 'center' }}>
            {DEMO_ROOMS.map(r => (
              <span key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)' }}>
                <i style={{ width: 8, height: 8, borderRadius: '50%', background: r.accent, display: 'inline-block' }} />
                {r.name}
              </span>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `55px repeat(7, minmax(100px,1fr))`, height: 55, borderBottom: '1px solid var(--line)' }}>
            <div />
            {days.map(day => (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #edf1f2' }}>
                <small style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>{new Intl.DateTimeFormat('fr', { weekday: 'short' }).format(new Date(`${day}T12:00`))}</small>
                <b style={{ fontSize: 13, ...(day === today ? { width: 26, height: 26, background: 'var(--teal)', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center' } : {}) }}>{day.slice(8)}</b>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `55px repeat(7, minmax(100px,1fr))`, height: 500 }}>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(12,1fr)', paddingTop: 4 }}>
              {Array.from({ length: 12 }, (_, i) => <span key={i} style={{ fontSize: 9, color: '#8da0a8', textAlign: 'right', paddingRight: 8 }}>{pad(i+8)}h</span>)}
            </div>
            {days.map(day => {
              const dayRes = DEMO_RESERVATIONS.filter(r => r.date === day && r.status === 'confirmed');
              return (
                <div key={day} style={{ position: 'relative', borderLeft: '1px solid #e8eef0' }}>
                  {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ display: 'block', height: 'calc(100%/12)', borderBottom: '1px solid #edf1f2' }} />)}
                  {dayRes.map(r => {
                    const room = DEMO_ROOMS.find(x => x.id === r.roomId);
                    const [sh, sm] = r.startTime.split(':').map(Number);
                    const [eh, em] = r.endTime.split(':').map(Number);
                    const top    = ((sh + sm/60 - 8) / 12) * 100;
                    const height = ((eh + em/60 - sh - sm/60) / 12) * 100;
                    return (
                      <div key={r.id} style={{ position: 'absolute', left: 3, right: 3, top: `${top}%`, height: `${Math.max(5,height)}%`, background: `${room?.accent}22`, borderLeft: `3px solid ${room?.accent}`, borderRadius: 5, padding: '4px 6px', overflow: 'hidden' }}>
                        <b style={{ fontSize: 8, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.purpose}</b>
                        <small style={{ fontSize: 7, color: 'var(--muted)' }}>{room?.name}</small>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Historique ────────────────────────────────────────
function Historique() {
  const all = [...DEMO_RESERVATIONS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="HISTORIQUE"
        title="Historique des réservations"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm">⬇ Export PDF</Button>
            <Button variant="outline" size="sm">⬇ Export Excel</Button>
          </div>
        }
      />
      <Card padding={false}>
        <div className="data-table-wrap">
          <div className="data-thead" style={{ gridTemplateColumns: '1.4fr .8fr 1fr .8fr .65fr .65fr' }}>
            {['COLLABORATEUR','DATE','OBJET','SALLE','PARTICIPANTS','STATUT'].map(h => <span key={h}>{h}</span>)}
          </div>
          {all.map(r => {
            const room = DEMO_ROOMS.find(x => x.id === r.roomId);
            return (
              <div key={r.id} className="data-trow" style={{ gridTemplateColumns: '1.4fr .8fr 1fr .8fr .65fr .65fr' }}>
                <span className="user-cell">
                  <span className="avatar xs">{initials(r.userName)}</span>
                  <span><b>{r.userName}</b><small>{r.userEntity}</small></span>
                </span>
                <span><b>{shortDate(r.date)}</b><br /><small style={{ color: 'var(--muted)', fontSize: 9 }}>{r.startTime}–{r.endTime}</small></span>
                <span>{r.purpose}</span>
                <span>{room?.name || '—'}</span>
                <span style={{ textAlign: 'center' }}><b>{r.attendees}</b></span>
                <span><Badge tone={r.status === 'confirmed' ? 'success' : 'danger'}>{r.status === 'confirmed' ? 'Confirmée' : 'Annulée'}</Badge></span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── Logs ──────────────────────────────────────────────
function Logs() {
  return (
    <div className="page-enter">
      <SectionHeader eyebrow="TRAÇABILITÉ" title="Journal d'activité" subtitle="Toutes les actions enregistrées dans le système." />
      <Card padding>
        {DEMO_LOGS.map(log => (
          <div key={log.id} className="log-row">
            <span className="log-time">{new Date(log.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className={`log-badge ${log.action}`}>{log.action.toUpperCase()}</span>
            <span className="log-message">{log.message}</span>
            <span className="log-user">{log.user}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Admin Topbar ──────────────────────────────────────
function AdminTopbar({ title, session }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <p>{new Intl.DateTimeFormat('fr-MA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button className="notif-btn" aria-label="Notifications">🔔</button>
        <div className="entity-chip">
          <small>ENTITÉ</small>
          <b>{session?.entity}</b>
        </div>
      </div>
    </header>
  );
}

// ── Admin Dashboard Root ──────────────────────────────
export default function AdminDashboard({ session, onLogout }) {
  const navigate = useNavigate();
  const [view, setView] = useState('overview');

  const titles = {
    overview:     'Vue d\'ensemble',
    reservations: 'Réservations',
    salles:       'Gestion des salles',
    users:        'Collaborateurs',
    equipements:  'Équipements',
    calendrier:   'Calendrier global',
    historique:   'Historique',
    logs:         'Journal d\'activité',
  };

  return (
    <div className="app-shell">
      <AdminSidebar view={view} setView={setView} session={session} onLogout={() => { onLogout(); navigate('/login'); }} />
      <main className="main-content">
        <AdminTopbar title={titles[view] || 'SALA Admin'} session={session} />
        {view === 'overview'     && <Overview setView={setView} />}
        {view === 'reservations' && <ReservationsAdmin />}
        {view === 'salles'       && <RoomsAdmin />}
        {view === 'users'        && <UsersAdmin />}
        {view === 'equipements'  && <EquipementsAdmin />}
        {view === 'calendrier'   && <GlobalCalendar />}
        {view === 'historique'   && <Historique />}
        {view === 'logs'         && <Logs />}
      </main>
    </div>
  );
}
