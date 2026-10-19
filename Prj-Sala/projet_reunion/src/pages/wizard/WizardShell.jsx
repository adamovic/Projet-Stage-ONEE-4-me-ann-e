import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Button, Badge, ProgressBar, SwitchRow, Field, Dialog } from '../../components/ui/index.jsx';
import {
  DEMO_ROOMS, EQUIPMENT_LIST, DEPARTMENTS,
  todayStr, longDate, shortDate, pad, initials, overlaps,
  DEMO_RESERVATIONS
} from '../../data/mockData.js';

// ─── Helper ──────────────────────────────────────────
const TOTAL_STEPS = 10;
const STEP_LABELS = [
  'Date', 'Créneau', 'Participants', 'Pause café',
  'Déjeuner', 'Invités', 'Logistique', 'Salle',
  'Connexion', 'Résumé',
];

// ─── Step 1: Date ─────────────────────────────────────
function Step1Date({ data, setData }) {
  const today = todayStr();
  const selected = data.date || today;

  const now = new Date(`${selected}T12:00:00`);
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, i) =>
    new Date(now.getFullYear(), now.getMonth(), i - offset + 1)
  );
  const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

  function moveMonth(n) {
    const d = new Date(`${selected}T12:00:00`);
    d.setMonth(d.getMonth() + n);
    setData(p => ({ ...p, date: isoDate(d) }));
  }

  const busyDates = new Set(DEMO_RESERVATIONS.map(r => r.date));

  return (
    <div>
      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--line)', padding: '24px', maxWidth: 360, margin: '0 auto' }}>
        {/* Calendar header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={() => moveMonth(-1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }} aria-label="Mois précédent">‹</button>
          <b style={{ fontSize: 14, textTransform: 'capitalize' }}>
            {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(now)}
          </b>
          <button onClick={() => moveMonth(1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }} aria-label="Mois suivant">›</button>
        </div>

        {/* Week labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 8 }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', padding: '4px 0' }}>{d}</span>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {days.map((d, i) => {
            const val = isoDate(d);
            const isOutside = d.getMonth() !== now.getMonth();
            const isPast    = val < today;
            const isSelected = val === selected;
            const isToday    = val === today;
            const hasBusy    = busyDates.has(val);

            return (
              <button
                key={i}
                disabled={isPast}
                onClick={() => setData(p => ({ ...p, date: val }))}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  border: isSelected ? 'none' : isToday ? '1.5px solid var(--teal)' : 'none',
                  borderRadius: 8,
                  background: isSelected ? 'var(--teal)' : 'transparent',
                  color: isOutside ? '#c0cbd0' : isPast ? '#d0d9dc' : isSelected ? '#fff' : isToday ? 'var(--teal)' : 'var(--ink)',
                  fontWeight: isToday || isSelected ? 800 : 500,
                  fontSize: 11,
                  cursor: isPast ? 'not-allowed' : 'pointer',
                  transition: '.15s',
                }}
              >
                {d.getDate()}
                {hasBusy && !isSelected && (
                  <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)' }} />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setData(p => ({ ...p, date: today }))}
          style={{ display: 'block', margin: '14px auto 0', border: 0, background: 'transparent', color: 'var(--teal)', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
        >
          Aujourd'hui
        </button>
      </div>

      {data.date && (
        <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--teal-light)', borderRadius: 12, border: '1px solid #99d1ce', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360, margin: '20px auto 0' }}>
          <span style={{ fontSize: 20 }}>📅</span>
          <div>
            <b style={{ fontSize: 13, color: 'var(--teal-dark)' }}>Date sélectionnée</b>
            <p style={{ fontSize: 12, color: 'var(--teal)', marginTop: 2, textTransform: 'capitalize' }}>{longDate(data.date)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Créneau ──────────────────────────────────
function Step2Creneau({ data, setData }) {
  const slots = ['07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00',
                  '12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

  const busySlots = new Set(
    DEMO_RESERVATIONS
      .filter(r => r.date === data.date && r.status === 'confirmed')
      .flatMap(r => {
        const arr = [];
        for (let t = r.startTime; t < r.endTime; t = nextSlot(t)) arr.push(t);
        return arr;
      })
  );

  function nextSlot(t) {
    const [h, m] = t.split(':').map(Number);
    const total = h * 60 + m + 30;
    return `${pad(Math.floor(total/60))}:${pad(total%60)}`;
  }

  function calcDuration(s, e) {
    const [sh, sm] = s.split(':').map(Number);
    const [eh, em] = e.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? pad(m) + 'min' : ''}` : `${m} min`;
  }

  const duration = data.startTime && data.endTime ? calcDuration(data.startTime, data.endTime) : null;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div>
          <Field label="Heure de début">
            <select value={data.startTime || ''} onChange={e => setData(p => ({ ...p, startTime: e.target.value }))}>
              <option value="">Choisir…</option>
              {slots.slice(0, -1).map(s => (
                <option key={s} value={s} disabled={busySlots.has(s)}>{s}{busySlots.has(s) ? ' — Occupé' : ''}</option>
              ))}
            </select>
          </Field>
        </div>
        <div>
          <Field label="Heure de fin">
            <select value={data.endTime || ''} onChange={e => setData(p => ({ ...p, endTime: e.target.value }))}>
              <option value="">Choisir…</option>
              {slots.slice(1).map(s => (
                <option key={s} value={s} disabled={data.startTime && s <= data.startTime}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {duration && (
        <div style={{ textAlign: 'center', padding: '14px', background: 'var(--teal-light)', borderRadius: 12, marginBottom: 28 }}>
          <b style={{ fontSize: 24, color: 'var(--teal)' }}>{duration}</b>
          <p style={{ fontSize: 11, color: 'var(--teal-dark)', marginTop: 4 }}>Durée de la réunion</p>
        </div>
      )}

      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 12 }}>APERÇU DES CRÉNEAUX</p>
      <div className="time-slot-grid">
        {slots.slice(0, 16).map(s => {
          const occupied = busySlots.has(s);
          const isStart = s === data.startTime;
          return (
            <button
              key={s}
              className={`time-slot ${occupied ? 'occupied' : isStart ? 'selected' : 'available'}`}
              disabled={occupied}
              onClick={() => !occupied && setData(p => ({ ...p, startTime: s }))}
            >
              {s}
              <small>{occupied ? 'Occupé' : 'Libre'}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 3: Participants ─────────────────────────────
function Step3Participants({ data, setData }) {
  const count = data.attendees || 5;
  const minRoom = DEMO_ROOMS.filter(r => r.capacity >= count).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
          Nombre de participants attendus (organisateur inclus)
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center' }}>
          <button
            onClick={() => setData(p => ({ ...p, attendees: Math.max(1, (p.attendees||5) - 1) }))}
            style={{ width: 48, height: 48, borderRadius: 14, border: '1.5px solid var(--line)', background: 'var(--card)', color: 'var(--teal)', fontSize: 24, fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center', transition: '.15s' }}
            aria-label="Réduire"
          >−</button>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 72, fontWeight: 800, color: 'var(--navy)', display: 'block', lineHeight: 1 }}>{count}</b>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>participants</span>
          </div>
          <button
            onClick={() => setData(p => ({ ...p, attendees: Math.min(50, (p.attendees||5) + 1) }))}
            style={{ width: 48, height: 48, borderRadius: 14, border: '1.5px solid var(--line)', background: 'var(--card)', color: 'var(--teal)', fontSize: 24, fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center', transition: '.15s' }}
            aria-label="Augmenter"
          >+</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, width: '100%', maxWidth: 480 }}>
        {[5, 8, 10, 12, 15, 20].map(n => (
          <button
            key={n}
            onClick={() => setData(p => ({ ...p, attendees: n }))}
            style={{
              padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: '.15s',
              border: count === n ? 'none' : '1.5px solid var(--line)',
              background: count === n ? 'var(--teal)' : 'var(--card)',
              color: count === n ? '#fff' : 'var(--ink)',
            }}
          >
            {n} pers.
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', width: '100%', maxWidth: 480 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>SALLES COMPATIBLES</p>
        {DEMO_ROOMS.map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #edf1f2' }}>
            <span style={{ fontSize: 12 }}>{r.name}</span>
            <Badge tone={r.capacity >= count ? 'success' : 'danger'}>
              {r.capacity >= count ? `✓ ${r.capacity} places` : `✗ ${r.capacity} places`}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Pause café ───────────────────────────────
function Step4PauseCafe({ data, setData }) {
  return (
    <div>
      <div className="choice-cards">
        <button
          className={`choice-card${data.coffeeBreak === true ? ' selected' : ''}`}
          onClick={() => setData(p => ({ ...p, coffeeBreak: true }))}
        >
          <span className="choice-icon">☕</span>
          <b>Oui, avec plaisir</b>
          <p>Café, thé, eau et viennoiseries seront préparés par les services généraux.</p>
        </button>
        <button
          className={`choice-card${data.coffeeBreak === false ? ' selected' : ''}`}
          onClick={() => setData(p => ({ ...p, coffeeBreak: false }))}
        >
          <span className="choice-icon">🚫</span>
          <b>Non merci</b>
          <p>Pas de pause-café pour cette réunion.</p>
        </button>
      </div>

      {data.coffeeBreak && (
        <div style={{ marginTop: 24, animation: 'card-rise .3s both' }}>
          <Field label="Composition souhaitée" hint="optionnel">
            <textarea
              value={data.coffeeDetails || 'Café, thé, eau et viennoiseries'}
              onChange={e => setData(p => ({ ...p, coffeeDetails: e.target.value }))}
              rows={3}
              placeholder="Ex. Café, thé, jus d'orange, viennoiseries, fruits…"
            />
          </Field>
          <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--warning-lt)', borderRadius: 10, fontSize: 11, color: 'var(--warning)', border: '1px solid #f1d9ba' }}>
            ℹ️ La demande sera transmise aux services généraux et préparée 15 min avant la réunion.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 5: Déjeuner ─────────────────────────────────
function Step5Dejeuner({ data, setData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="choice-cards">
        <button
          className={`choice-card${data.lunch === true ? ' selected' : ''}`}
          onClick={() => setData(p => ({ ...p, lunch: true }))}
        >
          <span className="choice-icon">🍽️</span>
          <b>Oui</b>
          <p>Un repas sera organisé lors de cette réunion.</p>
        </button>
        <button
          className={`choice-card${data.lunch === false ? ' selected' : ''}`}
          onClick={() => setData(p => ({ ...p, lunch: false, lunchType: null }))}
        >
          <span className="choice-icon">🚫</span>
          <b>Non</b>
          <p>Pas de repas prévu pour cette réunion.</p>
        </button>
      </div>

      {data.lunch && (
        <div style={{ animation: 'card-rise .3s both' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 14 }}>TYPE DE SERVICE</p>
          <div className="choice-cards">
            <button
              className={`choice-card${data.lunchType === 'Self Service' ? ' selected' : ''}`}
              onClick={() => setData(p => ({ ...p, lunchType: 'Self Service' }))}
            >
              <span className="choice-icon">🥪</span>
              <b>Self Service</b>
              <p>Buffet libre-service avec plateau repas.</p>
            </button>
            <button
              className={`choice-card${data.lunchType === 'Service à table' ? ' selected' : ''}`}
              onClick={() => setData(p => ({ ...p, lunchType: 'Service à table' }))}
            >
              <span className="choice-icon">🤵</span>
              <b>Service à table</b>
              <p>Service complet avec serveur dédié.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 6: Participants List ────────────────────────
function Step6Participants({ data, setData }) {
  const [tab, setTab] = useState('employees');
  const employees = data.employees || [];
  const visitors  = data.visitors  || [];

  function addEmployee() {
    setData(p => ({ ...p, employees: [...(p.employees||[]), { id: Date.now(), nom: '', prenom: '', matricule: '', service: '' }] }));
  }
  function removeEmployee(id) {
    setData(p => ({ ...p, employees: (p.employees||[]).filter(e => e.id !== id) }));
  }
  function updateEmployee(id, field, value) {
    setData(p => ({ ...p, employees: (p.employees||[]).map(e => e.id === id ? {...e, [field]: value} : e) }));
  }
  function addVisitor() {
    setData(p => ({ ...p, visitors: [...(p.visitors||[]), { id: Date.now(), nom: '', prenom: '', fonction: '', societe: '' }] }));
  }
  function removeVisitor(id) {
    setData(p => ({ ...p, visitors: (p.visitors||[]).filter(v => v.id !== id) }));
  }
  function updateVisitor(id, field, value) {
    setData(p => ({ ...p, visitors: (p.visitors||[]).map(v => v.id === id ? {...v, [field]: value} : v) }));
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#eaf0f2', borderRadius: 11, padding: 4 }}>
        {[{ v: 'employees', l: `Employés (${employees.length})` }, { v: 'visitors', l: `Visiteurs externes (${visitors.length})` }].map(t => (
          <button key={t.v} onClick={() => setTab(t.v)}
            style={{ flex: 1, padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: '.17s',
              background: tab === t.v ? '#fff' : 'transparent',
              color: tab === t.v ? 'var(--navy)' : 'var(--muted)',
              boxShadow: tab === t.v ? '0 2px 8px rgba(8,52,81,.09)' : 'none',
            }}
          >{t.l}</button>
        ))}
      </div>

      {tab === 'employees' && (
        <div>
          {employees.map(emp => (
            <div key={emp.id} className="participant-row">
              <Field label="Prénom">
                <input value={emp.prenom} onChange={e => updateEmployee(emp.id, 'prenom', e.target.value)} placeholder="Prénom" />
              </Field>
              <Field label="Nom">
                <input value={emp.nom} onChange={e => updateEmployee(emp.id, 'nom', e.target.value)} placeholder="Nom" />
              </Field>
              <Field label="Matricule / Service">
                <input value={emp.matricule || emp.service} onChange={e => updateEmployee(emp.id, 'matricule', e.target.value)} placeholder="CAD-0000 ou direction" />
              </Field>
              <button onClick={() => removeEmployee(emp.id)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, display: 'grid', placeItems: 'center', alignSelf: 'flex-end', marginBottom: 1 }} aria-label="Supprimer">✕</button>
            </div>
          ))}
          <button className="add-participant-btn" onClick={addEmployee}>
            + Ajouter un employé
          </button>
        </div>
      )}

      {tab === 'visitors' && (
        <div>
          {visitors.map(vis => (
            <div key={vis.id} className="participant-row">
              <Field label="Prénom">
                <input value={vis.prenom} onChange={e => updateVisitor(vis.id, 'prenom', e.target.value)} placeholder="Prénom" />
              </Field>
              <Field label="Nom">
                <input value={vis.nom} onChange={e => updateVisitor(vis.id, 'nom', e.target.value)} placeholder="Nom" />
              </Field>
              <Field label="Fonction / Société">
                <input value={vis.fonction || vis.societe} onChange={e => updateVisitor(vis.id, 'fonction', e.target.value)} placeholder="Directeur · Société XYZ" />
              </Field>
              <button onClick={() => removeVisitor(vis.id)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, display: 'grid', placeItems: 'center', alignSelf: 'flex-end', marginBottom: 1 }} aria-label="Supprimer">✕</button>
            </div>
          ))}
          <button className="add-participant-btn" onClick={addVisitor}>
            + Ajouter un visiteur externe
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 7: Logistique ───────────────────────────────
function Step7Logistique({ data, setData }) {
  const checked = data.equipment || [];
  function toggle(id) {
    setData(p => ({
      ...p,
      equipment: checked.includes(id) ? checked.filter(e => e !== id) : [...checked, id],
    }));
  }

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
        Sélectionnez les équipements dont vous aurez besoin. Seules les salles disposant de ces équipements vous seront proposées.
      </p>
      <div className="equip-grid">
        {EQUIPMENT_LIST.map(eq => (
          <button
            key={eq.id}
            className={`equip-card${checked.includes(eq.id) ? ' checked' : ''}`}
            onClick={() => toggle(eq.id)}
            role="checkbox"
            aria-checked={checked.includes(eq.id)}
          >
            <span className="equip-check">
              {checked.includes(eq.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </span>
            <span className="equip-icon">{eq.icon}</span>
            <span>{eq.label}</span>
          </button>
        ))}
      </div>
      {checked.length > 0 && (
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--teal-light)', borderRadius: 10, fontSize: 11, color: 'var(--teal-dark)' }}>
          <b>✓ {checked.length} équipement{checked.length > 1 ? 's' : ''} sélectionné{checked.length > 1 ? 's' : ''}</b>
        </div>
      )}
    </div>
  );
}

// ─── Step 8: Choix de la salle ────────────────────────
function Step8Salle({ data, setData }) {
  const needed = data.attendees || 5;
  const neededEquip = data.equipment || [];

  const compatible = DEMO_ROOMS.filter(r => {
    if (!r.available) return false;
    if (r.capacity < needed) return false;
    return true;
  });

  return (
    <div className="room-select-grid">
      {compatible.length === 0 && (
        <div style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>😞</span>
          <b>Aucune salle disponible</b>
          <p style={{ marginTop: 6, fontSize: 12 }}>Essayez un autre créneau ou réduisez le nombre de participants.</p>
        </div>
      )}
      {compatible.map(room => (
        <button
          key={room.id}
          className={`room-select-card${data.roomId === room.id ? ' selected' : ''}`}
          onClick={() => setData(p => ({ ...p, roomId: room.id, roomName: room.name }))}
        >
          <div className="room-select-img" style={{ backgroundImage: `url(${room.image})` }}>
            <span className="room-floor">{room.floor} · {room.building}</span>
          </div>
          <div className="room-select-body">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge tone="success">● Disponible</Badge>
              <Badge tone="teal">♙ {room.capacity} places</Badge>
            </div>
            <h3 style={{ marginTop: 6 }}>{room.name}</h3>
            <p>{room.surface} · {room.floor}</p>
            <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, marginTop: 4 }}>{room.description}</p>
            <div className="room-equip-tags" style={{ marginTop: 8 }}>
              {room.equipment.map(eq => <span key={eq}>{eq}</span>)}
            </div>
          </div>
          <div className="room-select-action">
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: data.roomId === room.id ? 'var(--teal)' : 'var(--line)',
                display: 'grid', placeItems: 'center', color: '#fff', fontSize: 16, transition: '.2s',
              }}
            >
              {data.roomId === room.id ? '✓' : ''}
            </div>
            <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>
              {data.roomId === room.id ? 'Choisie' : 'Choisir'}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Step 9: Connexion ────────────────────────────────
function Step9Connexion({ data, setData, session }) {
  const [login, setLogin]       = useState(session?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (session) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✓</div>
        <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>Déjà connecté</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Vous êtes connecté en tant que <b>{session.name}</b>.</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{session.entity} · {session.matricule}</p>
        <div style={{ marginTop: 20, padding: '14px 18px', background: 'var(--success-lt)', borderRadius: 12, fontSize: 12, color: 'var(--success)', border: '1px solid #b0e3cf' }}>
          ✅ La réservation sera enregistrée sous votre compte.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 380, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ padding: '16px', background: 'var(--blue-lt)', borderRadius: 12, fontSize: 12, color: 'var(--blue)', border: '1px solid #b0cfe5' }}>
        ℹ️ Authentification requise pour finaliser votre réservation.
      </div>
      <Field label="E-mail professionnel">
        <input type="email" value={login} onChange={e => { setLogin(e.target.value); setData(p => ({...p, authEmail: e.target.value})); }} placeholder="prenom.nom@office.ma" autoFocus />
      </Field>
      <Field label="Mot de passe">
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </Field>
      {error && <div style={{ fontSize: 11, color: 'var(--danger)', background: 'var(--danger-lt)', padding: '10px 12px', borderRadius: 8 }}>{error}</div>}
      <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', paddingTop: 8 }}>
        SSO disponible · Connexion sécurisée HTTPS
      </div>
    </div>
  );
}

// ─── Step 10: Résumé ──────────────────────────────────
function Step10Resume({ data, session, onEdit }) {
  const room = DEMO_ROOMS.find(r => r.id === data.roomId);

  return (
    <div>
      {room && (
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 14, padding: 14, background: '#f4f8f8', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ height: 60, borderRadius: 8, backgroundImage: `url(${room.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div>
            <b style={{ fontSize: 14 }}>{room.name}</b>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{room.floor} · {room.building}</p>
            <Badge tone="success" style={{ marginTop: 4 }}>Disponible</Badge>
          </div>
        </div>
      )}

      <div className="resume-grid">
        <div className="resume-item">
          <small>📅 Date</small>
          <b style={{ textTransform: 'capitalize' }}>{data.date ? longDate(data.date) : '—'}</b>
        </div>
        <div className="resume-item">
          <small>⏰ Horaire</small>
          <b>{data.startTime || '—'} → {data.endTime || '—'}</b>
        </div>
        <div className="resume-item">
          <small>👥 Participants</small>
          <b>{data.attendees || '—'} personnes</b>
        </div>
        <div className="resume-item">
          <small>☕ Pause café</small>
          <b>{data.coffeeBreak === true ? 'Oui' : data.coffeeBreak === false ? 'Non' : '—'}</b>
        </div>
        <div className="resume-item">
          <small>🍽️ Déjeuner</small>
          <b>{data.lunch === true ? (data.lunchType || 'Oui') : data.lunch === false ? 'Non' : '—'}</b>
        </div>
        <div className="resume-item">
          <small>🔧 Équipements</small>
          <b style={{ fontSize: 11 }}>{(data.equipment||[]).length > 0 ? (data.equipment||[]).join(', ') : 'Aucun'}</b>
        </div>
        <div className="resume-item" style={{ gridColumn: '1 / -1' }}>
          <small>👤 Organisateur</small>
          <b>{session?.name || '—'} · {session?.entity}</b>
        </div>
      </div>

      {(data.employees?.length > 0 || data.visitors?.length > 0) && (
        <div style={{ padding: '14px', border: '1px solid var(--line)', borderRadius: 12, marginTop: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)', marginBottom: 8 }}>PARTICIPANTS INVITÉS</p>
          <p style={{ fontSize: 12 }}>
            {(data.employees?.length || 0)} employé(s) · {(data.visitors?.length || 0)} visiteur(s) externe(s)
          </p>
        </div>
      )}

      <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--success-lt)', borderRadius: 12, border: '1px solid #b0e3cf', fontSize: 12, color: 'var(--success)' }}>
        ✅ En confirmant, la salle sera bloquée instantanément et une notification sera envoyée à l'administrateur.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
        <Button variant="outline" size="sm" onClick={onEdit}>
          ✏️ Modifier ma réservation
        </Button>
      </div>
    </div>
  );
}

// ─── Success overlay ──────────────────────────────────
function SuccessScreen({ data, onClose }) {
  const room = DEMO_ROOMS.find(r => r.id === data.roomId);
  return (
    <div className="success-overlay">
      <div className="success-card">
        <span className="success-icon">✓</span>
        <h2>Réservation confirmée !</h2>
        <p>
          Votre salle <b>{room?.name}</b> est réservée pour le{' '}
          <b style={{ textTransform: 'capitalize' }}>{data.date ? shortDate(data.date) : ''}</b>{' '}
          de <b>{data.startTime}</b> à <b>{data.endTime}</b>.
        </p>
        <p style={{ marginTop: 6, fontSize: 11 }}>
          Une confirmation a été envoyée et l'administrateur a été notifié.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <Button onClick={onClose} full>Retour au tableau de bord</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Wizard Shell ─────────────────────────────────────
export default function WizardShell({ session }) {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [data, setData]       = useState({ date: todayStr(), attendees: 5, coffeeBreak: null, lunch: null, equipment: [], employees: [], visitors: [] });
  const [success, setSuccess] = useState(false);

  const canNext = useCallback(() => {
    if (step === 1) return Boolean(data.date);
    if (step === 2) return Boolean(data.startTime && data.endTime && data.startTime < data.endTime);
    if (step === 3) return data.attendees >= 1;
    if (step === 4) return data.coffeeBreak !== null;
    if (step === 5) return data.lunch !== null;
    if (step === 8) return Boolean(data.roomId);
    return true;
  }, [step, data]);

  function confirm() {
    setSuccess(true);
  }

  if (success) {
    return <SuccessScreen data={data} onClose={() => navigate(session?.role === 'admin' ? '/admin' : '/employee')} />;
  }

  const steps = [
    { label: 'Date',           component: <Step1Date data={data} setData={setData} /> },
    { label: 'Créneau',        component: <Step2Creneau data={data} setData={setData} /> },
    { label: 'Participants',   component: <Step3Participants data={data} setData={setData} /> },
    { label: 'Pause café',     component: <Step4PauseCafe data={data} setData={setData} /> },
    { label: 'Déjeuner',       component: <Step5Dejeuner data={data} setData={setData} /> },
    { label: 'Invités',        component: <Step6Participants data={data} setData={setData} /> },
    { label: 'Logistique',     component: <Step7Logistique data={data} setData={setData} /> },
    { label: 'Salle',          component: <Step8Salle data={data} setData={setData} /> },
    { label: 'Connexion',      component: <Step9Connexion data={data} setData={setData} session={session} /> },
    { label: 'Résumé',         component: <Step10Resume data={data} session={session} onEdit={() => setStep(1)} /> },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="wizard-page">
      {/* ── Top nav ──────────────────────── */}
      <div className="wizard-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/')} style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--card)', color: 'var(--muted)', fontSize: 18, cursor: 'pointer', display: 'grid', placeItems: 'center' }} aria-label="Retour">‹</button>
          <Logo />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Étape {step} sur {TOTAL_STEPS}</span>
          <div className="wizard-steps-indicator" aria-label={`Progression: étape ${step} sur ${TOTAL_STEPS}`}>
            {steps.map((_, i) => (
              <span key={i} className={`ws-dot ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Progress bar ─────────────────── */}
      <ProgressBar current={step} total={TOTAL_STEPS} />

      {/* ── Step body ────────────────────── */}
      <div className="wizard-body page-enter" key={step}>
        <div className="wizard-step-header">
          <nav className="wizard-breadcrumb" aria-label="Fil d'Ariane">
            <span>Réservation</span>
            {step > 1 && <>·<span>{steps[step-2]?.label}</span></>}
            · <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{currentStep.label}</span>
          </nav>
          <h2>{currentStep.label}</h2>
          <p>
            {step === 1  && 'Choisissez la date de votre réunion. Seules les dates à venir sont sélectionnables.'}
            {step === 2  && 'Définissez l\'heure de début et de fin. La durée est calculée automatiquement.'}
            {step === 3  && 'Indiquez le nombre de participants. Les salles incompatibles seront filtrées.'}
            {step === 4  && 'Souhaitez-vous organiser une pause-café ? Les services généraux la prépareront pour vous.'}
            {step === 5  && 'Avez-vous besoin d\'un repas lors de cette réunion ?'}
            {step === 6  && 'Ajoutez les participants : employés internes et visiteurs externes.'}
            {step === 7  && 'Sélectionnez les équipements nécessaires. Seules les salles compatibles apparaîtront.'}
            {step === 8  && 'Choisissez parmi les salles disponibles et compatibles avec vos critères.'}
            {step === 9  && 'Authentifiez-vous pour valider votre réservation de manière sécurisée.'}
            {step === 10 && 'Vérifiez les informations de votre réservation avant de confirmer.'}
          </p>
        </div>

        {currentStep.component}
      </div>

      {/* ── Footer navigation ─────────────── */}
      <div className="wizard-footer">
        <Button
          variant="ghost"
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
        >
          ← {step === 1 ? 'Annuler' : 'Retour'}
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {STEP_LABELS[step - 1]}
          </span>
          {step < TOTAL_STEPS ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Continuer →
            </Button>
          ) : (
            <Button variant="navy" onClick={confirm}>
              ✓ Confirmer la réservation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
