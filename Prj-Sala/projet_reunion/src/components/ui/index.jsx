// UI Component Library — SALA Design System

// ── Logo Mark ────────────────────────────────────────
export function LogoMark({ size = 32 }) {
  return (
    <span className="logo-mark" aria-hidden="true" style={{ width: size, height: size }}>
      <i /><i /><i />
    </span>
  );
}

// ── Logo Full ─────────────────────────────────────────
export function Logo({ light = false, size = 'md' }) {
  return (
    <div className={`brand${light ? ' light' : ''}`} aria-label="SALA">
      <LogoMark />
      <span>
        <b>SALA</b>
        <small>Gestion des Réunions</small>
      </span>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────
export function Avatar({ name = '', color = 'teal', size = '' }) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return <span className={`avatar ${color} ${size}`} aria-label={name}>{initials || '?'}</span>;
}

// ── Badge ─────────────────────────────────────────────
export function Badge({ tone = 'neutral', children }) {
  const toneMap = { neutral:'', success:'ui-badge-success', warning:'ui-badge-warning', danger:'ui-badge-danger', info:'ui-badge-info', teal:'ui-badge-teal', navy:'ui-badge-navy' };
  return <span className={`ui-badge ${toneMap[tone] || ''}`}>{children}</span>;
}

// ── Button ────────────────────────────────────────────
export function Button({ variant = 'primary', size = '', full = false, disabled = false, onClick, children, type = 'button', className = '' }) {
  const varMap = { primary:'', outline:'ui-btn-outline', ghost:'ui-btn-ghost', danger:'ui-btn-danger', navy:'ui-btn-navy' };
  const sizeMap = { sm:'ui-btn-sm', lg:'ui-btn-lg', icon:'ui-btn-icon' };
  const cls = ['ui-btn', varMap[variant] || '', sizeMap[size] || '', full ? 'ui-btn-full' : '', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} disabled={disabled} onClick={onClick}>{children}</button>;
}

// ── Card ──────────────────────────────────────────────
export function Card({ children, className = '', style = {}, onClick, padding = true }) {
  return (
    <div
      className={`ui-card ${className}`}
      style={{ padding: padding ? '20px' : 0, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────
export function Field({ label, hint, error, children }) {
  return (
    <div className={`ui-field${error ? ' ui-field-error' : ''}`}>
      <div className="field-label">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </div>
      {children}
      {error && <p className="field-error-msg">{error}</p>}
    </div>
  );
}

// ── Switch ────────────────────────────────────────────
export function SwitchRow({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      className={`ui-switch-row${checked ? ' active' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="ui-switch"><i /></span>
      <span>
        <b>{label}</b>
        {description && <small>{description}</small>}
      </span>
    </button>
  );
}

// ── Segmented ─────────────────────────────────────────
export function Segmented({ value, onChange, items }) {
  return (
    <div className="ui-segmented" role="tablist">
      {items.map(item => (
        <button
          key={item.value}
          role="tab"
          aria-selected={value === item.value}
          className={value === item.value ? 'active' : ''}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ── Dialog / Modal ────────────────────────────────────
export function Dialog({ open, onClose, title, eyebrow, wide = false, children }) {
  if (!open) return null;
  return (
    <div className="ui-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`ui-dialog${wide ? ' ui-dialog-wide' : ''}`}>
        <header>
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
          </div>
          <button className="dialog-close" onClick={onClose} aria-label="Fermer">✕</button>
        </header>
        {children}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`ui-toast${toast.error ? ' ui-toast-error' : ''}`} role="alert" aria-live="polite">
      <span className="toast-icon">{toast.error ? '!' : '✓'}</span>
      <div>
        <b>{toast.error ? 'Action impossible' : 'C\'est fait !'}</b>
        <small>{toast.message}</small>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────
export function EmptyState({ icon = '◇', title, text }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <b>{title}</b>
      {text && <p>{text}</p>}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────
export function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-bar-wrap" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────
export function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin .7s linear infinite' }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ── Section Header ────────────────────────────────────
export function SectionHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {subtitle && <span style={{ color: 'var(--muted)', fontSize: 12 }}>{subtitle}</span>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ── Metric Card ───────────────────────────────────────
export function MetricCard({ label, value, subtext, accent = false, icon, iconColor = 'teal' }) {
  return (
    <div className={`ui-card metric-card${accent ? ' metric-accent' : ''}`}>
      <small>{label}</small>
      <b>{value}</b>
      {subtext && <span>{subtext}</span>}
      {icon && <span className={`metric-icon ${iconColor}`}>{icon}</span>}
    </div>
  );
}
