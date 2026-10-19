import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Badge, Button } from '../components/ui/index.jsx';

// ── SVG Illustration hero ────────────────────────────
function HeroIllustration() {
  return (
    <svg viewBox="0 0 540 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-svg" style={{ width: '100%', maxWidth: 520 }}>
      {/* Background shape */}
      <ellipse cx="270" cy="260" rx="230" ry="190" fill="#edf5f5" opacity="0.7" />
      {/* Room table */}
      <rect x="130" y="195" width="280" height="160" rx="20" fill="#fff" stroke="#dce6e9" strokeWidth="2" />
      <rect x="150" y="215" width="240" height="120" rx="12" fill="#f4f7f8" />
      {/* Chairs */}
      <rect x="180" y="162" width="36" height="26" rx="8" fill="#078d91" opacity="0.8" />
      <rect x="248" y="162" width="36" height="26" rx="8" fill="#078d91" opacity="0.8" />
      <rect x="316" y="162" width="36" height="26" rx="8" fill="#063451" opacity="0.6" />
      <rect x="180" y="382" width="36" height="26" rx="8" fill="#078d91" opacity="0.6" />
      <rect x="248" y="382" width="36" height="26" rx="8" fill="#063451" opacity="0.6" />
      <rect x="316" y="382" width="36" height="26" rx="8" fill="#078d91" opacity="0.8" />
      {/* Side chairs */}
      <rect x="88" y="228" width="26" height="36" rx="8" fill="#ee922f" opacity="0.8" />
      <rect x="88" y="296" width="26" height="36" rx="8" fill="#ee922f" opacity="0.6" />
      <rect x="426" y="228" width="26" height="36" rx="8" fill="#176fa2" opacity="0.8" />
      <rect x="426" y="296" width="26" height="36" rx="8" fill="#176fa2" opacity="0.6" />
      {/* Screen */}
      <rect x="162" y="228" width="216" height="100" rx="8" fill="#fff" stroke="#dce6e9" strokeWidth="1.5" />
      {/* Chart bars on screen */}
      <rect x="190" y="278" width="18" height="34" rx="4" fill="#078d91" opacity="0.7" />
      <rect x="218" y="264" width="18" height="48" rx="4" fill="#078d91" />
      <rect x="246" y="270" width="18" height="42" rx="4" fill="#ee922f" opacity="0.8" />
      <rect x="274" y="258" width="18" height="54" rx="4" fill="#063451" opacity="0.7" />
      <rect x="302" y="272" width="18" height="40" rx="4" fill="#176fa2" opacity="0.8" />
      <rect x="330" y="265" width="18" height="47" rx="4" fill="#078d91" opacity="0.6" />
      {/* Calendar floating card */}
      <rect x="370" y="100" width="140" height="120" rx="14" fill="#fff" stroke="#dce6e9" strokeWidth="1.5" filter="url(#shadow1)" />
      <rect x="370" y="100" width="140" height="30" rx="14" fill="#078d91" />
      <rect x="370" y="115" width="140" height="15" fill="#078d91" />
      <text x="440" y="122" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Inter">Juillet 2026</text>
      <circle cx="394" cy="150" r="10" fill="#edf5f5" />
      <circle cx="420" cy="150" r="10" fill="#e6f7f0" />
      <circle cx="446" cy="150" r="10" fill="#edf5f5" />
      <circle cx="472" cy="150" r="10" fill="#edf5f5" />
      <circle cx="394" cy="175" r="10" fill="#edf5f5" />
      <circle cx="420" cy="175" r="10" fill="#078d91" />
      <circle cx="446" cy="175" r="10" fill="#edf5f5" />
      <circle cx="472" cy="175" r="10" fill="#edf5f5" />
      <text x="420" y="179" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Inter">18</text>
      {/* Notification badge */}
      <rect x="28" y="120" width="155" height="68" rx="12" fill="#fff" stroke="#dce6e9" strokeWidth="1.5" filter="url(#shadow1)" />
      <circle cx="52" cy="154" r="14" fill="#e6f7f0" />
      <text x="52" y="158" textAnchor="middle" fill="#16835f" fontSize="14" fontFamily="Inter">✓</text>
      <rect x="74" y="142" width="90" height="8" rx="4" fill="#f0f4f5" />
      <rect x="74" y="156" width="65" height="7" rx="3" fill="#edf5f5" />
      {/* People dots */}
      <circle cx="200" cy="154" r="16" fill="#e8f1f8" />
      <text x="200" y="159" textAnchor="middle" fill="#176fa2" fontSize="18" fontFamily="Inter">👤</text>
      <circle cx="240" cy="154" r="16" fill="#fff2e1" />
      <text x="240" y="159" textAnchor="middle" fill="#ee922f" fontSize="18" fontFamily="Inter">👤</text>
      <circle cx="280" cy="154" r="16" fill="#edf5f5" />
      <text x="280" y="159" textAnchor="middle" fill="#078d91" fontSize="18" fontFamily="Inter">👤</text>
      {/* Shadow filter */}
      <defs>
        <filter id="shadow1" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(8,52,81,0.1)" />
        </filter>
      </defs>
    </svg>
  );
}

// ── Feature Card ─────────────────────────────────────
function FeatureCard({ icon, title, desc, color = 'teal', delay = 0 }) {
  return (
    <div className="feature-card" style={{ '--delay': `${delay}ms` }}>
      <span className={`feature-icon ${color}`}>{icon}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [navScrolled, setNavScrolled] = useState(false);

  const features = [
    { icon: '⚡', color: 'teal',   title: 'Réservation rapide',          desc: 'Réservez votre salle en moins d\'une minute grâce au wizard intelligent guidé étape par étape.', delay: 0 },
    { icon: '📡', color: 'blue',   title: 'Disponibilité en temps réel', desc: 'Consultez la disponibilité instantanée de toutes les salles et créneaux sans jamais vous tromper.', delay: 60 },
    { icon: '🔔', color: 'orange', title: 'Notifications intelligentes',  desc: 'Recevez des rappels, confirmations et alertes personnalisés pour ne jamais manquer une réunion.', delay: 120 },
    { icon: '⚙️', color: 'teal',   title: 'Gestion automatisée',         desc: 'L\'administrateur gère les salles, équipements, repas et pauses café depuis un tableau de bord unique.', delay: 180 },
    { icon: '📊', color: 'navy',   title: 'Historique & Analytics',      desc: 'Analysez l\'utilisation des espaces, exportez des rapports PDF/Excel et optimisez vos ressources.', delay: 240 },
    { icon: '🖥️', color: 'blue',   title: 'Dashboard intuitif',          desc: 'Interface claire, moderne et accessible sur tous les appareils, inspirée des meilleures plateformes SaaS.', delay: 300 },
  ];

  return (
    <div className="landing-page">
      {/* ── Navigation ─────────────────────── */}
      <nav className="landing-nav" aria-label="Navigation principale">
        <Logo />
        <div className="landing-nav-actions">
          <Button variant="ghost" onClick={() => navigate('/login')}>Connexion</Button>
          <Button onClick={() => navigate('/wizard')}>Réserver une salle</Button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content page-enter">
          <Badge tone="teal">● Plateforme opérationnelle</Badge>
          <h1 id="hero-title">
            Réservez votre salle<br />
            <em>en quelques clics</em>
          </h1>
          <p>
            Une plateforme intelligente permettant d'organiser facilement les réunions
            professionnelles et d'optimiser l'utilisation des espaces collaboratifs.
          </p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => navigate('/wizard')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Réserver une salle
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
              Découvrir les salles →
            </Button>
          </div>
          <div className="hero-stats">
            <div>
              <b>5</b>
              <small>Salles équipées</small>
            </div>
            <span />
            <div>
              <b>&lt; 1 min</b>
              <small>Pour réserver</small>
            </div>
            <span />
            <div>
              <b>100 %</b>
              <small>Temps réel</small>
            </div>
          </div>
        </div>
        <div className="hero-illustration">
          <HeroIllustration />
        </div>
      </section>

      {/* ── Stats Banner ───────────────────── */}
      <div className="stats-banner">
        <div className="stats-banner-inner">
          <div className="stat-item">
            <b>5</b>
            <small>Salles de réunion</small>
          </div>
          <div className="stat-item">
            <b>12</b>
            <small>Réservations aujourd'hui</small>
          </div>
          <div className="stat-item">
            <b>87 %</b>
            <small>Taux de satisfaction</small>
          </div>
          <div className="stat-item">
            <b>2 min</b>
            <small>Temps moyen de réservation</small>
          </div>
        </div>
      </div>

      {/* ── Features ───────────────────────── */}
      <section className="features-section" aria-labelledby="features-title">
        <div className="section-intro">
          <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 10 }}>FONCTIONNALITÉS</p>
          <h2 id="features-title">Tout ce qu'il vous faut</h2>
          <p>Une suite complète d'outils pour gérer vos réunions, équipements et ressources.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      {/* ── How it works ───────────────────── */}
      <section className="how-section" aria-labelledby="how-title">
        <div className="section-intro">
          <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 10 }}>COMMENT ÇA MARCHE</p>
          <h2 id="how-title">Réserver en 4 étapes</h2>
          <p>Un processus simple et guidé pour une expérience sans friction.</p>
        </div>
        <div className="steps-grid">
          {[
            { n: '1', title: 'Choisissez la date', desc: 'Sélectionnez la date et le créneau horaire de votre réunion.' },
            { n: '2', title: 'Définissez vos besoins', desc: 'Participants, équipements, pause-café, déjeuner — tout en un.' },
            { n: '3', title: 'Choisissez votre salle', desc: 'Parmi les salles compatibles et disponibles, sélectionnez celle qui vous convient.' },
            { n: '4', title: 'Confirmez & c\'est fait !', desc: 'Votre salle est réservée instantanément avec notification aux parties.' },
          ].map((s, i) => (
            <div key={i} className="step-card" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="step-number">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ────────────────────── */}
      <section style={{ background: 'var(--card)', padding: '70px 6vw', textAlign: 'center', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>COMMENCEZ MAINTENANT</p>
        <h2 style={{ fontSize: '2rem', color: 'var(--navy)', marginBottom: 14 }}>Prêt à optimiser vos réunions ?</h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 30, maxWidth: 500, margin: '0 auto 30px' }}>
          Rejoignez vos collègues et profitez d'une gestion intelligente des espaces collaboratifs.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button size="lg" onClick={() => navigate('/login')}>Accéder à mon espace</Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/wizard')}>Tester le wizard</Button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>Plateforme de réservation intelligente des espaces collaboratifs destinée aux collaborateurs du siège.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <a href="#" onClick={e => { e.preventDefault(); navigate('/'); }}>Accueil</a>
            <a href="#" onClick={e => { e.preventDefault(); navigate('/login'); }}>Connexion</a>
            <a href="#" onClick={e => { e.preventDefault(); navigate('/wizard'); }}>Réserver</a>
            <a href="#" onClick={e => { e.preventDefault(); navigate('/employee'); }}>Mon espace</a>
          </div>
          <div className="footer-col">
            <h4>Ressources</h4>
            <a href="#">Guide utilisateur</a>
            <a href="#">FAQ</a>
            <a href="#">Changelog</a>
            <a href="#">Support</a>
          </div>
          <div className="footer-col">
            <h4>Légal</h4>
            <a href="#">Confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Accessibilité</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 SALA — Gestion des Réunions. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="#">Confidentialité</a>
            <a href="#">Conditions</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
