import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCompanies } from '../api/companyApi';
import { uploadReport } from '../api/reportApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './UploadReportPage.css';

const MAX_FILE_SIZE_MB = 50;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

// Groq pricing
const GROQ_INPUT_PER_1K  = 0.00059;
const GROQ_OUTPUT_PER_1K = 0.00079;
const EST_INPUT_TOKENS   = 3000;
const EST_OUTPUT_TOKENS  = 400;
const COST_PER_ANALYSIS  = (
  (EST_INPUT_TOKENS  / 1000) * GROQ_INPUT_PER_1K +
  (EST_OUTPUT_TOKENS / 1000) * GROQ_OUTPUT_PER_1K
).toFixed(5);

const UploadReportPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState(null);

  const [form, setForm] = useState({ companyId: '', reportYear: String(CURRENT_YEAR) });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
        if (data.length > 0) setForm((prev) => ({ ...prev, companyId: String(data[0].id) }));
      } catch (err) {
        setCompaniesError(err);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError(null);
  };

  const validateFile = (f) => {
    if (!f) return 'Please select a PDF file.';
    if (f.type !== 'application/pdf') return 'Only PDF files are accepted.';
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `File size must be under ${MAX_FILE_SIZE_MB}MB.`;
    return null;
  };

  const handleFileSelect = (f) => {
    const err = validateFile(f);
    if (err) { setErrors((prev) => ({ ...prev, file: err })); setFile(null); }
    else { setErrors((prev) => ({ ...prev, file: '' })); setFile(f); }
  };

  const handleFileInputChange = (e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const validate = () => {
    const errs = {};
    if (!form.companyId) errs.companyId = 'Please select a company.';
    if (!form.reportYear) errs.reportYear = 'Please select a year.';
    const fileErr = validateFile(file);
    if (fileErr) errs.file = fileErr;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError(null);
    try {
      const report = await uploadReport({ companyId: Number(form.companyId), reportYear: Number(form.reportYear), file });
      navigate(`/reports/${report.id}`, { replace: true });
    } catch (err) {
      setApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="upload-page">
      <Link to="/reports" className="back-link">← Back to Reports</Link>

      <div className="upload-layout">

        {/* ======================== LEFT — Form ======================== */}
        <div className="upload-form-panel">
          <div className="form-card__header" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-5)' }}>
            <h2 className="form-card__title">⬆ Upload Financial Report</h2>
            <p className="form-card__subtitle">
              Select a company, pick the report year, and upload your PDF. AI analysis runs automatically.
            </p>
          </div>

          {apiError && <ErrorMessage error={apiError} onDismiss={() => setApiError(null)} />}
          {companiesError && <ErrorMessage error="Could not load companies. Please refresh." onDismiss={() => setCompaniesError(null)} />}

          {companiesLoading ? (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
              <LoadingSpinner text="Loading companies..." />
            </div>
          ) : companies.length === 0 ? (
            <div className="upload-no-companies">
              <span>⚠</span>
              <p>No companies found. Add a company before uploading a report.</p>
              <Link to="/companies/new" className="btn btn--primary">+ Add Company First</Link>
            </div>
          ) : (
            <form className="upload-form" onSubmit={handleSubmit} noValidate>

              {/* Company */}
              <div className="form-group">
                <label htmlFor="companyId" className="form-label">
                  Company <span className="form-required">*</span>
                </label>
                <select
                  id="companyId" name="companyId"
                  className={`form-select ${errors.companyId ? 'form-input--error' : ''}`}
                  value={form.companyId} onChange={handleFormChange} disabled={submitting}
                >
                  <option value="">— Select a company —</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.ticker})</option>
                  ))}
                </select>
                {errors.companyId && <span className="form-error-text">{errors.companyId}</span>}
              </div>

              {/* Year */}
              <div className="form-group">
                <label htmlFor="reportYear" className="form-label">
                  Report Year <span className="form-required">*</span>
                </label>
                <select
                  id="reportYear" name="reportYear"
                  className={`form-select ${errors.reportYear ? 'form-input--error' : ''}`}
                  value={form.reportYear} onChange={handleFormChange} disabled={submitting}
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.reportYear && <span className="form-error-text">{errors.reportYear}</span>}
              </div>

              {/* Drop zone */}
              <div className="form-group">
                <label className="form-label">
                  PDF File <span className="form-required">*</span>
                </label>
                <div
                  className={`drop-zone ${dragOver ? 'drop-zone--active' : ''} ${file ? 'drop-zone--has-file' : ''} ${errors.file ? 'drop-zone--error' : ''}`}
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                  onClick={() => !submitting && fileInputRef.current?.click()}
                  role="button" tabIndex={0} aria-label="Upload PDF file"
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="application/pdf"
                    onChange={handleFileInputChange} className="drop-zone__input"
                    disabled={submitting} aria-hidden="true" tabIndex={-1} />

                  {file ? (
                    <div className="drop-zone__file-info">
                      <span className="drop-zone__file-icon">📄</span>
                      <div>
                        <div className="drop-zone__file-name">{file.name}</div>
                        <div className="drop-zone__file-size">{formatBytes(file.size)}</div>
                      </div>
                      <button type="button" className="drop-zone__remove"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        aria-label="Remove file">✕</button>
                    </div>
                  ) : (
                    <div className="drop-zone__placeholder">
                      <span className="drop-zone__icon">📂</span>
                      <p className="drop-zone__text"><strong>Click to upload</strong> or drag &amp; drop</p>
                      <p className="drop-zone__hint">PDF only · Max {MAX_FILE_SIZE_MB}MB</p>
                    </div>
                  )}
                </div>
                {errors.file && <span className="form-error-text">{errors.file}</span>}
              </div>

              {/* AI notice */}
              <div className="upload-ai-notice">
                <span>🤖</span>
                <p>AI analysis runs automatically after upload using Groq LLM. You&apos;ll be redirected to the results page.</p>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <Link to="/reports" className="btn btn--ghost">Cancel</Link>
                <button type="submit" className="btn btn--primary" disabled={submitting}>
                  {submitting ? (
                    <><span className="btn-spinner" aria-hidden="true" /> Uploading &amp; Analyzing...</>
                  ) : '⬆ Upload & Analyze'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ======================== RIGHT — Info Panels ======================== */}
        <div className="upload-info-panel">

          {/* How it works */}
          <div className="upload-info-card">
            <div className="upload-info-card__title">
              <span>📋</span> How It Works
            </div>
            <div className="upload-steps">
              <div className="upload-step">
                <div className="upload-step__num">1</div>
                <div className="upload-step__content">
                  <div className="upload-step__title">Select Company & Year</div>
                  <div className="upload-step__desc">Choose which company this report belongs to and the fiscal year it covers.</div>
                </div>
              </div>
              <div className="upload-step">
                <div className="upload-step__num">2</div>
                <div className="upload-step__content">
                  <div className="upload-step__title">Upload PDF</div>
                  <div className="upload-step__desc">Drag & drop or click to select the annual report PDF. Max 50MB supported.</div>
                </div>
              </div>
              <div className="upload-step">
                <div className="upload-step__num">3</div>
                <div className="upload-step__content">
                  <div className="upload-step__title">AI Extracts & Analyses</div>
                  <div className="upload-step__desc">Text is extracted from the PDF and sent to Groq LLM for deep financial analysis.</div>
                </div>
              </div>
              <div className="upload-step">
                <div className="upload-step__num">4</div>
                <div className="upload-step__content">
                  <div className="upload-step__title">View Results</div>
                  <div className="upload-step__desc">Get company overview, revenue analysis, profitability, risks, and investment recommendation.</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Pricing */}
          <div className="upload-info-card">
            <div className="upload-info-card__title">
              <span>⚡</span> AI Pricing — Groq LLM
            </div>
            <div className="upload-pricing-grid">
              <div className="upload-pricing-item">
                <div className="upload-pricing-item__label">Model</div>
                <div className="upload-pricing-item__value" style={{ fontSize: 'var(--font-size-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>llama-3.3-70b</div>
              </div>
              <div className="upload-pricing-item">
                <div className="upload-pricing-item__label">Per Analysis</div>
                <div className="upload-pricing-item__value upload-pricing-item__value--green">${COST_PER_ANALYSIS}</div>
                <div className="upload-pricing-item__sub">estimated</div>
              </div>
              <div className="upload-pricing-item">
                <div className="upload-pricing-item__label">Input Rate</div>
                <div className="upload-pricing-item__value upload-pricing-item__value--cyan">$0.59</div>
                <div className="upload-pricing-item__sub">per 1M tokens</div>
              </div>
              <div className="upload-pricing-item">
                <div className="upload-pricing-item__label">Output Rate</div>
                <div className="upload-pricing-item__value upload-pricing-item__value--purple">$0.79</div>
                <div className="upload-pricing-item__sub">per 1M tokens</div>
              </div>
              <div className="upload-pricing-item">
                <div className="upload-pricing-item__label">Avg Input</div>
                <div className="upload-pricing-item__value upload-pricing-item__value--cyan">~{EST_INPUT_TOKENS.toLocaleString()}</div>
                <div className="upload-pricing-item__sub">tokens/report</div>
              </div>
              <div className="upload-pricing-item">
                <div className="upload-pricing-item__label">Avg Output</div>
                <div className="upload-pricing-item__value upload-pricing-item__value--purple">~{EST_OUTPUT_TOKENS}</div>
                <div className="upload-pricing-item__sub">tokens/analysis</div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="upload-info-card">
            <div className="upload-info-card__title">
              <span>✅</span> File Requirements
            </div>
            <div className="upload-requirements">
              <div className="upload-req-item">
                <span className="upload-req-item__icon">📄</span>
                <span><strong>Format:</strong> PDF only</span>
              </div>
              <div className="upload-req-item">
                <span className="upload-req-item__icon">⚖</span>
                <span><strong>Max size:</strong> 50 MB</span>
              </div>
              <div className="upload-req-item">
                <span className="upload-req-item__icon">🔤</span>
                <span><strong>Text-based PDFs</strong> work best (not scanned images)</span>
              </div>
              <div className="upload-req-item">
                <span className="upload-req-item__icon">📊</span>
                <span><strong>Annual reports</strong>, 10-K filings, financial statements</span>
              </div>
              <div className="upload-req-item">
                <span className="upload-req-item__icon">🔒</span>
                <span><strong>Non-password-protected</strong> PDFs only</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadReportPage;
