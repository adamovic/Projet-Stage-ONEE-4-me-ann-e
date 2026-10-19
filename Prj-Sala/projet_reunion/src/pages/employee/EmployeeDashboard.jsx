import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Logo, Badge, Button, Card, Segmented, Dialog, Field, SwitchRow,
  EmptyState, MetricCard, Toast, SectionHeader,
} from '../../components/ui/index.jsx';
import {
  DEMO_ROOMS, DEMO_RESERVATIONS, DEMO_NOTIFICATIONS,
  todayStr, longDate, shortDate, initials, pad, addDaysStr, overlaps,
} from '../../data/mockData.js';

// ── Sidebar ───────────────────────────────────────────
function Sidebar({ view, setView, session, onLogout }) {
  const nav = [
    { id: 'dashboard',     label: 'Tableau de bord',  icon: '⌂' },
    { id: 'reserver',      label: 'Réserver',          icon: '＋' },
    { id: 'reservations',  label: 'Mes réservations',  icon: '▦' },
    { id: 'calendrier',    label: 'Calendrier',        icon: '📅' },
    { id: 'notifications', label: 'Notifications',     icon: '🔔', badge: DEMO_NOTIFICATIONS.filter(n => !n.read).length },
    { id: 'profil',        label: 'Profil',            icon: '👤' },
    { id: 'parametres',    label: 'Paramètres',        icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="logo-mark"><i /><i /><i /></span>
        <span><b>SALA</b><small>Gestion des Réunions</small></span>
      </div>
      <div className="nav-label">ESPACE EMPLOYÉ</div>
      <nav aria-label="Navigation principale">
        {nav.map(item => (
          <button
            key={item.id}
            className={view === item.id ? 'active' : ''}
            onClick={() => { if (item.id === 'reserver') return; setView(item.id); }}
            aria-current={view === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge > 0 && <em>{item.badge}</em>}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-support">
        <b>Besoin d'aide ?</b>
        <small>L'équipe des moyens généraux est disponible du lundi au vendredi.</small>
        <button>Contacter le support</button>
      </div>
      <button className="sidebar-profile" onClick={onLogout} title="Se déconnecter" aria-label="Se déconnecter">
        <span className={`avatar ${session?.role === 'admin' ? 'orange' : 'teal'}`}>
          {session ? initials(session.name) : '?'}
        </span>
        <span>
          <b>{session?.name}</b>
          <small>{session?.matricule} · {session?.role === 'admin' ? 'Admin' : 'Cadre'}</small>
        </span>
        <span style={{ color: '#7695a2', fontSize: 14 }}>↗</span>
      </button>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────
function Topbar({ title, subtitle, session, notifCount }) {
  return (
    <header className="topbar" aria-label="Barre de navigation supérieure">
      <div className="topbar-left">
        <p>{new Intl.DateTimeFormat('fr-MA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button className="notif-btn" aria-label={`${notifCount} notifications`}>
          {notifCount > 0 && <span className="notif-dot">●</span>}
          🔔
        </button>
        <div className="entity-chip">
          <small>ENTITÉ</small>
          <b>{session?.entity}</b>
        </div>
      </div>
    </header>
  );
}

// ── Dashboard Overview ────────────────────────────────
function DashboardView({ session, navigate }) {
  const today = todayStr();
  const myRes = DEMO_RESERVATIONS.filter(r => r.userId === session.id && r.status === 'confirmed' && r.date >= today);
  const nextMeet = myRes.sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextRoom  = nextMeet ? DEMO_ROOMS.find(r => r.id === nextMeet.roomId) : null;

  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="TABLEAU DE BORD"
        title={`Bonjour, ${session.firstName} 👋`}
        subtitle="Bienvenue sur votre espace de gestion des réunions."
      />

      {/* Metrics */}
      <div className="metric-grid metric-grid-3" style={{ marginBottom: 24 }}>
        <MetricCard label="MES RÉSERVATIONS" value={myRes.length} subtext="à venir" icon="▦" iconColor="teal" />
        <MetricCard label="PROCHAINE RÉUNION" value={nextMeet?.startTime || '—'} subtext={nextMeet ? `${shortDate(nextMeet.date)} · ${nextRoom?.name}` : 'Agenda libre'} accent icon="⏰" />
        <MetricCard label="SALLES DISPONIBLES" value={DEMO_ROOMS.filter(r => r.available).length} subtext={`sur ${DEMO_ROOMS.length} salles`} icon="🏢" iconColor="blue" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Quick reservation */}
        <Card padding>
          <p className="eyebrow" style={{ marginBottom: 12 }}>RÉSERVATION RAPIDE</p>
          <h3 style={{ marginBottom: 8 }}>Réserver une salle</h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
            Utilisez le wizard de réservation guidé pour trouver et réserver la salle idéale en quelques étapes.
          </p>
          <Button full onClick={() => navigate('/wizard')}>
            + Nouvelle réservation
          </Button>
        </Card>

        {/* Rooms status */}
        <Card padding>
          <p className="eyebrow" style={{ marginBottom: 12 }}>ÉTAT DES SALLES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DEMO_ROOMS.slice(0, 4).map(room => {
              const busy = DEMO_RESERVATIONS.some(r =>
                r.roomId === room.id && r.date === today && r.status === 'confirmed' &&
                r.startTime <= new Date().toTimeString().slice(0,5) &&
                r.endTime >= new Date().toTimeString().slice(0,5)
              );
              return (
                <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #edf1f2' }}>
                  <div>
                    <b style={{ fontSize: 12 }}>{room.name}</b>
                    <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{room.floor} · {room.capacity} places</p>
                  </div>
                  <Badge tone={room.available && !busy ? 'success' : 'warning'}>
                    {room.available && !busy ? '● Libre' : '● Occupée'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming reservations */}
        <Card padding style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p className="eyebrow">MES PROCHAINES RÉUNIONS</p>
              <h3 style={{ marginTop: 4 }}>Agenda à venir</h3>
            </div>
          </div>
          {myRes.length > 0 ? myRes.slice(0, 4).map(r => {
            const room = DEMO_ROOMS.find(x => x.id === r.roomId);
            return (
              <div key={r.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderTop: '1px solid #edf1f2' }}>
                <div className="date-block">
                  <b>{r.date.slice(8)}</b>
                  <small>{new Intl.DateTimeFormat('fr', { month: 'short' }).format(new Date(`${r.date}T12:00`))}</small>
                </div>
                <div className="time-col">
                  <b>{r.startTime}</b>
                  <i />
                  <small>{r.endTime}</small>
                </div>
                <div className="res-main" style={{ flex: 1 }}>
                  <b>{r.purpose}</b>
                  <span>{room?.name} · {room?.floor}</span>
                  <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                    {r.coffeeBreak && <Badge tone="warning">☕ Pause-café</Badge>}
                    <Badge tone="success">Confirmée</Badge>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{r.attendees} pers.</span>
              </div>
            );
          }) : (
            <EmptyState icon="▦" title="Aucune réunion à venir" text="Vos prochaines réservations apparaîtront ici." />
          )}
        </Card>
      </div>
    </div>
  );
}

// ── Reservations View ─────────────────────────────────
function ReservationsView({ session }) {
  const today = todayStr();
  const all = DEMO_RESERVATIONS.filter(r => r.userId === session.id);
  const active  = all.filter(r => r.status === 'confirmed' && r.date >= today);
  const history = all.filter(r => r.status !== 'confirmed' || r.date < today);
  const [tab, setTab] = useState('active');

  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="AGENDA PERSONNEL"
        title="Mes réservations"
        subtitle="Retrouvez toutes vos réunions passées et à venir."
        actions={
          <Segmented
            value={tab}
            onChange={setTab}
            items={[
              { value: 'active',  label: `À venir (${active.length})` },
              { value: 'history', label: 'Historique' },
            ]}
          />
        }
      />

      <div className="metric-grid metric-grid-3" style={{ marginBottom: 20 }}>
        <MetricCard label="RÉSERVATIONS ACTIVES" value={active.length} subtext="dans votre agenda" icon="✓" iconColor="teal" />
        <MetricCard label="PAUSES-CAFÉ" value={all.filter(r => r.coffeeBreak).length} subtext="demandées au total" icon="☕" iconColor="orange" />
        <MetricCard label="HISTORIQUE" value={history.length} subtext="réservations archivées" icon="📋" iconColor="navy" />
      </div>

      <Card padding={false} style={{ padding: '20px' }}>
        <div style={{ marginBottom: 14 }}>
          <b style={{ fontSize: 14 }}>{tab === 'active' ? 'Prochaines réunions' : 'Réservations passées'}</b>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>Triées par date</p>
        </div>
        {(tab === 'active' ? active : history).length > 0
          ? (tab === 'active' ? active : history).map(r => {
              const room = DEMO_ROOMS.find(x => x.id === r.roomId);
              return (
                <div key={r.id} className="reservation-row-item">
                  <div className="date-block">
                    <b>{r.date.slice(8)}</b>
                    <small>{new Intl.DateTimeFormat('fr', { month: 'short' }).format(new Date(`${r.date}T12:00`))}</small>
                  </div>
                  <div className="time-col">
                    <b>{r.startTime}</b>
                    <i />
                    <small>{r.endTime}</small>
                  </div>
                  <div className="res-main">
                    <b>{r.purpose}</b>
                    <span>{room?.name} · {room?.floor}</span>
                    <div>
                      {r.coffeeBreak && <Badge tone="warning">☕</Badge>}
                      {r.lunch && <Badge tone="info">🍽️</Badge>}
                      <Badge tone={r.status === 'confirmed' ? 'success' : 'danger'}>
                        {r.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                      </Badge>
                    </div>
                  </div>
                  <div className="attendees-col">
                    <small>Participants</small>
                    <b>{r.attendees}</b>
                  </div>
                  {tab === 'active' && <Button variant="ghost" size="sm">Annuler</Button>}
                </div>
              );
            })
          : <EmptyState icon="▦" title={tab === 'active' ? 'Agenda libre' : 'Aucun historique'} text={tab === 'active' ? 'Vos prochaines réservations apparaîtront ici.' : 'Les réservations passées apparaîtront ici.'} />
        }
      </Card>
    </div>
  );
}

// ── Calendar View ─────────────────────────────────────
function CalendarView({ session }) {
  const today = todayStr();
  const [focusDate, setFocusDate] = useState(today);
  const [calView, setCalView] = useState('week');
  const myRes = DEMO_RESERVATIONS.filter(r => r.userId === session.id && r.status === 'confirmed');

  const focus = new Date(`${focusDate}T12:00:00`);
  const mondayOffset = (focus.getDay() + 6) % 7;
  const addD = (v, n) => { const d = new Date(`${v}T12:00:00`); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
  const weekStart = addD(focusDate, -mondayOffset);
  const days = calView === 'day' ? [focusDate] : Array.from({ length: 7 }, (_, i) => addD(weekStart, i));

  function move(dir) {
    setFocusDate(addD(focusDate, dir * (calView === 'day' ? 1 : 7)));
  }

  return (
    <div className="page-enter">
      <SectionHeader eyebrow="MON CALENDRIER" title="Calendrier" subtitle="Visualisez toutes vos réunions." />
      <Card padding={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => setFocusDate(today)}>Aujourd'hui</Button>
            <button onClick={() => move(-1)} style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)', fontSize: 18 }}>‹</button>
            <button onClick={() => move(1)}  style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)', fontSize: 18 }}>›</button>
            <b style={{ fontSize: 13, textTransform: 'capitalize' }}>
              {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(focus)}
            </b>
          </div>
          <Segmented value={calView} onChange={setCalView} items={[{ value: 'day', label: 'Jour' }, { value: 'week', label: 'Semaine' }]} />
        </div>

        <div className="week-cal-wrap">
          {/* Header */}
          <div className="week-cal-head" style={{ gridTemplateColumns: `55px repeat(${days.length}, 1fr)` }}>
            <div style={{ borderRight: '1px solid var(--line)' }} />
            {days.map(day => (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #edf1f2' }}>
                <small style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {new Intl.DateTimeFormat('fr', { weekday: 'short' }).format(new Date(`${day}T12:00`))}
                </small>
                <b style={{ fontSize: 14, ...(day === today ? { width: 26, height: 26, background: 'var(--teal)', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center' } : {}) }}>
                  {day.slice(8)}
                </b>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="week-cal-body" style={{ gridTemplateColumns: `55px repeat(${days.length}, 1fr)`, height: 520 }}>
            {/* Hours */}
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(12,1fr)', transform: 'translateY(-6px)', paddingTop: 4 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} style={{ fontSize: 9, color: '#8da0a8', textAlign: 'right', paddingRight: 8, paddingTop: 2 }}>{pad(i+8)}h</span>
              ))}
            </div>
            {/* Day columns */}
            {days.map(day => {
              const dayRes = myRes.filter(r => r.date === day);
              return (
                <div key={day} className="cal-day-col">
                  {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
                  {dayRes.map(r => {
                    const [sh, sm] = r.startTime.split(':').map(Number);
                    const [eh, em] = r.endTime.split(':').map(Number);
                    const top    = ((sh + sm/60 - 8) / 12) * 100;
                    const height = ((eh + em/60 - sh - sm/60) / 12) * 100;
                    const room = DEMO_ROOMS.find(x => x.id === r.roomId);
                    return (
                      <div key={r.id} className="cal-event" style={{ top: `${top}%`, height: `${Math.max(5, height)}%` }}>
                        <b>{r.purpose}</b>
                        <small>{r.startTime} · {room?.name}</small>
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

// ── Notifications View ────────────────────────────────
function NotificationsView() {
  const [notifs, setNotifs] = useState(DEMO_NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="page-enter">
      <SectionHeader
        eyebrow="CENTRE DE NOTIFICATIONS"
        title="Notifications"
        subtitle={`${unread} non lue${unread !== 1 ? 's' : ''}`}
        actions={<Button variant="ghost" size="sm" onClick={() => setNotifs(ns => ns.map(n => ({...n, read: true})))}>Tout marquer comme lu</Button>}
      />
      <Card padding>
        {notifs.map(n => (
          <div key={n.id} className="notif-item" onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? {...x, read: true} : x))} style={{ cursor: 'pointer' }}>
            <div className="notif-dot-container">
              <span className={`notif-item-dot${n.read ? ' read' : ''}`} />
            </div>
            <div className="notif-content">
              <b>{n.title}</b>
              <p>{n.message}</p>
              <time>{n.time}</time>
            </div>
            <Badge tone={n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'}>
              {n.type === 'success' ? '✓' : n.type === 'warning' ? '⚠' : 'ℹ'}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Profile View ──────────────────────────────────────
function ProfileView({ session }) {
  return (
    <div className="page-enter">
      <SectionHeader eyebrow="MON COMPTE" title="Profil" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card padding>
          <div className="profile-header">
            <span className={`avatar profile-avatar ${session?.role === 'admin' ? 'orange' : 'teal'}`}>
              {session ? initials(session.name) : '?'}
            </span>
            <div>
              <h3>{session?.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>{session?.entity}</p>
              <Badge tone={session?.role === 'admin' ? 'warning' : 'teal'} style={{ marginTop: 8 }}>
                {session?.role === 'admin' ? 'Administrateur' : 'Cadre'}
              </Badge>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Matricule', value: session?.matricule },
              { label: 'E-mail',    value: session?.email },
              { label: 'Entité',    value: session?.entity },
              { label: 'Statut',    value: session?.active ? 'Actif' : 'Inactif' },
            ].map(f => (
              <div key={f.label} style={{ padding: '10px', background: '#f9fbfb', borderRadius: 8, border: '1px solid var(--line)' }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', letterSpacing: '.08em' }}>{f.label.toUpperCase()}</p>
                <b style={{ fontSize: 13, marginTop: 3, display: 'block' }}>{f.value}</b>
              </div>
            ))}
          </div>
        </Card>
        <Card padding>
          <p className="eyebrow" style={{ marginBottom: 14 }}>PARAMÈTRES DU COMPTE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Prénom"><input defaultValue={session?.firstName} /></Field>
            <Field label="Nom"><input defaultValue={session?.lastName} /></Field>
            <Field label="E-mail professionnel"><input type="email" defaultValue={session?.email} /></Field>
            <Button full variant="outline">Mettre à jour le profil</Button>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 10 }}>SÉCURITÉ</p>
              <Button full variant="ghost">Modifier le mot de passe</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Employee Dashboard Root ───────────────────────────
export default function EmployeeDashboard({ session, onLogout }) {
  const navigate = useNavigate();
  const [view, setView]   = useState('dashboard');
  const [toast, setToast] = useState(null);

  const titles = {
    dashboard:     `Bonjour, ${session?.firstName}`,
    reservations:  'Mes réservations',
    calendrier:    'Mon calendrier',
    notifications: 'Notifications',
    profil:        'Mon profil',
    parametres:    'Paramètres',
  };

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} session={session} onLogout={() => { onLogout(); navigate('/login'); }} />
      <main className="main-content">
        <Topbar
          title={titles[view] || 'SALA'}
          session={session}
          notifCount={DEMO_NOTIFICATIONS.filter(n => !n.read).length}
        />
        {view === 'dashboard'     && <DashboardView session={session} navigate={navigate} />}
        {view === 'reservations'  && <ReservationsView session={session} />}
        {view === 'calendrier'    && <CalendarView session={session} />}
        {view === 'notifications' && <NotificationsView />}
        {view === 'profil'        && <ProfileView session={session} />}
        {view === 'parametres'    && (
          <div className="page-enter">
            <SectionHeader eyebrow="CONFIGURATION" title="Paramètres" />
            <Card padding>
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Les paramètres de l'application seront disponibles dans une prochaine version.</p>
            </Card>
          </div>
        )}
      </main>
      <Toast toast={toast} />
    </div>
  );
}
