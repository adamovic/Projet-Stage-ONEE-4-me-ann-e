import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Badge, Button, Field } from '../components/ui/index.jsx';
import { DEMO_USERS } from '../data/mockData.js';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [login, setLogin]       = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState(DEMO_USERS[0].password);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const user = DEMO_USERS.find(u =>
        (u.email === login || u.matricule === login) && u.password === password
      );
      if (user && user.active) {
        onLogin(user);
        navigate(user.role === 'admin' ? '/admin' : '/employee');
      } else if (user && !user.active) {
        setError('Ce compte est désactivé. Contactez l\'administrateur.');
      } else {
        setError('Identifiant ou mot de passe incorrect. Vérifiez vos informations.');
      }
      setLoading(false);
    }, 600);
  }

  function useDemo(user) {
    setLogin(user.email);
    setPassword(user.password);
    setError('');
  }

  return (
    <div className="login-page">
      {/* ── Left showcase ─────────────────── */}
      <section className="login-showcase" aria-hidden="true">
        <div className="showcase-grid" />
        <div className="showcase-top">
          <div className="brand light" style={{ padding: 0 }}>
            <span className="logo-mark"><i /><i /><i /></span>
            <span><b>SALA</b><small>Gestion des Réunions</small></span>
          </div>
          <Badge tone="success">● Plateforme opérationnelle</Badge>
        </div>

        <div className="showcase-copy">
          <p>PORTAIL DE CONNEXION</p>
          <h1>
            Vos réunions.<br />
            <em>Parfaitement orchestrées.</em>
          </h1>
          <span>
            Réservez les meilleurs espaces, organisez votre pause-café
            et gardez toute votre journée sous contrôle depuis un seul portail.
          </span>
          <div className="showcase-stats">
            <div><b>5</b><small>Espaces équipés</small></div>
            <div><b>&lt; 1 min</b><small>Pour réserver</small></div>
            <div><b>100 %</b><small>Temps réel</small></div>
          </div>
        </div>

        <div className="showcase-quote">
          <span>"</span>
          <p>Un espace pensé pour que chaque collaboration commence dans les meilleures conditions pour tous les collaborateurs.</p>
        </div>
      </section>

      {/* ── Right form ────────────────────── */}
      <section className="login-form-wrap">
        <form onSubmit={submit} aria-label="Formulaire de connexion">
          {/* Mobile brand */}
          <div style={{ display: 'none' }} className="mobile-login-brand">
            <span className="logo-mark"><i /><i /><i /></span>
            <b>SALA</b>
          </div>

          <p className="eyebrow">PORTAIL DE L'OFFICE</p>
          <h2>Heureux de vous revoir</h2>
          <p className="form-lead">Connectez-vous avec votre e-mail professionnel ou matricule.</p>

          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="E-mail ou Matricule">
              <input
                id="login-email"
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                autoComplete="username"
                placeholder="Ex. y.amrani@office.ma ou CAD-1042"
                autoFocus
                required
              />
            </Field>
            <Field label="Mot de passe">
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}

          <Button
            type="submit"
            className="login-submit"
            disabled={loading || !login.trim() || !password.trim()}
            full
          >
            {loading ? 'Connexion en cours…' : 'Accéder à mon espace'}
            <span aria-hidden="true">→</span>
          </Button>

          {/* Demo accounts */}
          <div className="demo-access">
            <p>COMPTES DE DÉMONSTRATION</p>
            {[
              { user: DEMO_USERS[0], label: 'Cadre', colorClass: 'teal' },
              { user: DEMO_USERS[1], label: 'Administrateur', colorClass: 'orange' },
            ].map(({ user, label, colorClass }) => (
              <button
                key={user.id}
                type="button"
                className="demo-btn"
                onClick={() => useDemo(user)}
              >
                <span className={`avatar ${colorClass} sm`}>
                  {user.firstName[0]}{user.lastName[0]}
                </span>
                <span>
                  <b>{user.firstName} {user.lastName}</b>
                  <small>{label} · {user.matricule}</small>
                </span>
                <em>Utiliser</em>
              </button>
            ))}
          </div>

          <small className="login-privacy">
            Connexion sécurisée · Accès réservé aux collaborateurs de l'office
          </small>
        </form>
      </section>
    </div>
  );
}
