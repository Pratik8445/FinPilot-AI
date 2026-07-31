import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

// Groq llama-3.3-70b-versatile pricing (per 1M tokens)
// Input: $0.59 / Output: $0.79 — as of 2025
const GROQ_INPUT_COST_PER_1K  = 0.00059;   // $0.59 / 1M = $0.00059 per 1K
const GROQ_OUTPUT_COST_PER_1K = 0.00079;
// Typical report analysis uses ~3000 input tokens + ~400 output tokens
const EST_INPUT_TOKENS  = 3000;
const EST_OUTPUT_TOKENS = 400;
const EST_COST = (
  (EST_INPUT_TOKENS  / 1000) * GROQ_INPUT_COST_PER_1K +
  (EST_OUTPUT_TOKENS / 1000) * GROQ_OUTPUT_COST_PER_1K
).toFixed(5);

const NAV_ITEMS = [
  { to: '/dashboard',      label: 'Dashboard',     icon: '◈' },
  { to: '/companies',      label: 'Companies',     icon: '🏢' },
  { to: '/reports',        label: 'Reports',       icon: '📋' },
  { to: '/reports/upload', label: 'Upload Report', icon: '⬆' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>

        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">📊</div>
          <div>
            <div className="sidebar__brand-name">FinanceAI</div>
            <div className="sidebar__brand-sub">Analyst Platform</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav" aria-label="Main navigation">
          <div className="sidebar__nav-section-label">Navigation</div>
          <ul>
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar__nav-icon" aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Token Pricing Panel */}
        <div className="sidebar__token-panel">
          <div className="sidebar__token-title">
            <span>⚡</span> AI Cost Estimate
          </div>
          <div className="sidebar__token-row">
            <span className="sidebar__token-label">Model</span>
            <span className="sidebar__token-value" style={{ fontSize: '0.65rem' }}>llama-3.3-70b</span>
          </div>
          <div className="sidebar__token-divider" />
          <div className="sidebar__token-row">
            <span className="sidebar__token-label">Input</span>
            <span className="sidebar__token-value">~{EST_INPUT_TOKENS.toLocaleString()} tok</span>
          </div>
          <div className="sidebar__token-row">
            <span className="sidebar__token-label">Output</span>
            <span className="sidebar__token-value">~{EST_OUTPUT_TOKENS} tok</span>
          </div>
          <div className="sidebar__token-divider" />
          <div className="sidebar__token-row">
            <span className="sidebar__token-label">Per Analysis</span>
            <span className="sidebar__token-value sidebar__token-value--cost">${EST_COST}</span>
          </div>
          <div className="sidebar__token-row">
            <span className="sidebar__token-label">Rate/1K tok</span>
            <span className="sidebar__token-value sidebar__token-value--cost">$0.00059</span>
          </div>
        </div>

        {/* User + Logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar" aria-hidden="true">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.name || 'User'}</div>
              <div className="sidebar__user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="sidebar__logout-btn" onClick={handleLogout} aria-label="Logout">
            <span aria-hidden="true">⏻</span>
            <span>Sign out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
