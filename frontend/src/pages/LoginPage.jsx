import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import './AuthPage.css';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter your email and password.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lp-root">
      {/* Mesh background */}
      <div className="lp-bg" aria-hidden="true">
        <div className="lp-bg__orb lp-bg__orb--1" />
        <div className="lp-bg__orb lp-bg__orb--2" />
        <div className="lp-bg__orb lp-bg__orb--3" />
        <div className="lp-bg__grid" />
      </div>

      {/* Top nav bar */}
      <nav className="lp-nav">
        <div className="lp-nav__brand">
          <span className="lp-nav__logo">⬡</span>
          <span className="lp-nav__name">FinanceAI</span>
        </div>
        <Link to="/register" className="lp-nav__cta">
          Create account
        </Link>
      </nav>

      {/* Center content */}
      <main className="lp-main">
        {/* Badge */}
        <div className="lp-badge">
          <span className="lp-badge__dot" />
          Powered by Groq · llama-3.3-70b-versatile
        </div>

        {/* Headline */}
        <h1 className="lp-headline">
          AI-powered<br />
          <span className="lp-headline__gradient">financial intelligence</span>
        </h1>

        <p className="lp-subline">
          Upload any annual report. Get instant analysis — revenue trends,
          risks, and investment signals for ~$0.002.
        </p>

        {/* Card */}
        <div className="lp-card">
          <div className="lp-card__header">
            <h2 className="lp-card__title">Sign in</h2>
            <p className="lp-card__sub">Welcome back</p>
          </div>

          <ErrorMessage error={error} onDismiss={() => setError(null)} />

          <form className="lp-form" onSubmit={handleSubmit} noValidate>
            <div className="lp-field">
              <label htmlFor="email" className="lp-field__label">Email</label>
              <input
                id="email" name="email" type="email"
                className="lp-field__input"
                placeholder="you@company.com"
                value={form.email} onChange={handleChange}
                autoComplete="email" required
              />
            </div>

            <div className="lp-field">
              <label htmlFor="password" className="lp-field__label">Password</label>
              <div className="lp-field__wrap">
                <input
                  id="password" name="password"
                  type={showPass ? 'text' : 'password'}
                  className="lp-field__input lp-field__input--padded"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password" required
                />
                <button
                  type="button"
                  className="lp-field__eye"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="lp-btn-primary"
              disabled={submitting}
            >
              {submitting
                ? <><span className="lp-spinner" /> Signing in…</>
                : 'Continue →'
              }
            </button>
          </form>

          <p className="lp-card__switch">
            New to FinanceAI?{' '}
            <Link to="/register">Create a free account</Link>
          </p>
        </div>

        {/* Social proof strip */}
        <div className="lp-proof">
          <div className="lp-proof__item">
            <span className="lp-proof__val">70B</span>
            <span className="lp-proof__lbl">param model</span>
          </div>
          <div className="lp-proof__sep" />
          <div className="lp-proof__item">
            <span className="lp-proof__val">~$0.002</span>
            <span className="lp-proof__lbl">per analysis</span>
          </div>
          <div className="lp-proof__sep" />
          <div className="lp-proof__item">
            <span className="lp-proof__val">&lt;30s</span>
            <span className="lp-proof__lbl">response time</span>
          </div>
          <div className="lp-proof__sep" />
          <div className="lp-proof__item">
            <span className="lp-proof__val">6</span>
            <span className="lp-proof__lbl">analysis dimensions</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
