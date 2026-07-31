import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/authApi';
import ErrorMessage from '../components/ErrorMessage';
import './AuthPage.css';

const RegisterPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const validate = () => {
    if (!form.name || form.name.length < 2) return 'Name must be at least 2 characters.';
    if (!form.email) return 'Email is required.';
    if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true);
    setError(null);
    try {
      await registerUser(form);
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
        <Link to="/login" className="lp-nav__cta">
          Sign in
        </Link>
      </nav>

      {/* Center content */}
      <main className="lp-main">
        {/* Badge */}
        <div className="lp-badge">
          <span className="lp-badge__dot" />
          Free to start — no credit card required
        </div>

        {/* Headline */}
        <h1 className="lp-headline">
          Start analysing<br />
          <span className="lp-headline__gradient">reports with AI</span>
        </h1>

        <p className="lp-subline">
          Create your account and upload your first financial report in minutes.
          Groq-powered analysis at a fraction of the cost.
        </p>

        {/* Card */}
        <div className="lp-card">
          <div className="lp-card__header">
            <h2 className="lp-card__title">Create account</h2>
            <p className="lp-card__sub">Get started for free</p>
          </div>

          <ErrorMessage error={error} onDismiss={() => setError(null)} />

          <form className="lp-form" onSubmit={handleSubmit} noValidate>
            <div className="lp-field">
              <label htmlFor="name" className="lp-field__label">Full name</label>
              <input
                id="name" name="name" type="text"
                className="lp-field__input"
                placeholder="John Doe"
                value={form.name} onChange={handleChange}
                autoComplete="name" required
              />
            </div>

            <div className="lp-field">
              <label htmlFor="email" className="lp-field__label">Work email</label>
              <input
                id="email" name="email" type="email"
                className="lp-field__input"
                placeholder="you@company.com"
                value={form.email} onChange={handleChange}
                autoComplete="email" required
              />
            </div>

            <div className="lp-field">
              <div className="lp-field__row">
                <label htmlFor="password" className="lp-field__label">Password</label>
                <span className="lp-field__hint">Min. 8 characters</span>
              </div>
              <div className="lp-field__wrap">
                <input
                  id="password" name="password"
                  type={showPass ? 'text' : 'password'}
                  className="lp-field__input lp-field__input--padded"
                  placeholder="Create a password"
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password" required
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
                ? <><span className="lp-spinner" /> Creating account…</>
                : 'Get started free →'
              }
            </button>
          </form>

          <p className="lp-card__switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        {/* Checklist */}
        <div className="lp-checks">
          {[
            'Unlimited companies & reports',
            'AI analysis on every upload',
            'Revenue, risks & investment signals',
            'Secure · No credit card needed',
          ].map(item => (
            <div key={item} className="lp-check">
              <svg className="lp-check__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {item}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
