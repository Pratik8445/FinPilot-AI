import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  createCompany,
  updateCompany,
  getCompanyById,
} from '../api/companyApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './CompanyFormPage.css';

const INITIAL_FORM = { name: '', ticker: '', sector: '' };

const CompanyFormPage = () => {
  const { companyId } = useParams(); // undefined on create, set on edit
  const isEdit = !!companyId;
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit); // loading initial data on edit
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load existing company data on edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getCompanyById(companyId);
        setForm({ name: data.name, ticker: data.ticker, sector: data.sector });
      } catch (err) {
        setApiError(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [companyId, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Company name is required.';
    if (!form.ticker.trim()) errs.ticker = 'Ticker symbol is required.';
    else if (form.ticker.length > 20) errs.ticker = 'Ticker cannot exceed 20 characters.';
    if (!form.sector.trim()) errs.sector = 'Sector is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError(null);
    try {
      const payload = {
        name: form.name.trim(),
        ticker: form.ticker.trim().toUpperCase(),
        sector: form.sector.trim(),
      };
      if (isEdit) {
        await updateCompany(companyId, payload);
      } else {
        await createCompany(payload);
      }
      navigate('/companies', { replace: true });
    } catch (err) {
      setApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" text="Loading company..." />
      </div>
    );
  }

  return (
    <div className="company-form-page">
      {/* Back navigation */}
      <Link to="/companies" className="back-link">
        ← Back to Companies
      </Link>

      <div className="form-card">
        <div className="form-card__header">
          <h2 className="form-card__title">
            {isEdit ? '✏ Edit Company' : '🏢 Add New Company'}
          </h2>
          <p className="form-card__subtitle">
            {isEdit
              ? 'Update the company information below.'
              : 'Fill in the details to add a new company to your workspace.'}
          </p>
        </div>

        {apiError && <ErrorMessage error={apiError} onDismiss={() => setApiError(null)} />}

        <form className="company-form" onSubmit={handleSubmit} noValidate>
          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Company Name <span className="form-required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="e.g. Apple Inc."
              value={form.name}
              onChange={handleChange}
              maxLength={255}
              disabled={submitting}
            />
            {errors.name && <span className="form-error-text">{errors.name}</span>}
          </div>

          {/* Ticker Symbol */}
          <div className="form-group">
            <label htmlFor="ticker" className="form-label">
              Ticker Symbol <span className="form-required">*</span>
            </label>
            <input
              id="ticker"
              name="ticker"
              type="text"
              className={`form-input ${errors.ticker ? 'form-input--error' : ''}`}
              placeholder="e.g. AAPL"
              value={form.ticker}
              onChange={handleChange}
              maxLength={20}
              style={{ textTransform: 'uppercase' }}
              disabled={submitting}
            />
            {errors.ticker && <span className="form-error-text">{errors.ticker}</span>}
            <span className="form-hint">Max 20 characters. Will be saved in uppercase.</span>
          </div>

          {/* Sector */}
          <div className="form-group">
            <label htmlFor="sector" className="form-label">
              Sector <span className="form-required">*</span>
            </label>
            <input
              id="sector"
              name="sector"
              type="text"
              className={`form-input ${errors.sector ? 'form-input--error' : ''}`}
              placeholder="e.g. Technology"
              value={form.sector}
              onChange={handleChange}
              maxLength={100}
              disabled={submitting}
            />
            {errors.sector && <span className="form-error-text">{errors.sector}</span>}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link
              to="/companies"
              className="btn btn--ghost"
              tabIndex={submitting ? -1 : 0}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                isEdit ? '✓ Save Changes' : '+ Create Company'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyFormPage;
