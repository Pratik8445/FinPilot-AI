import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getReportById, deleteReport } from '../api/reportApi';
import { getAnalysis, triggerAnalysis } from '../api/analysisApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import './ReportDetailPage.css';

// Groq pricing constants
const GROQ_INPUT_PER_1K  = 0.00059;
const GROQ_OUTPUT_PER_1K = 0.00079;
const EST_INPUT_TOKENS   = 3000;
const EST_OUTPUT_TOKENS  = 400;
const COST_PER_ANALYSIS  = (
  (EST_INPUT_TOKENS  / 1000) * GROQ_INPUT_PER_1K +
  (EST_OUTPUT_TOKENS / 1000) * GROQ_OUTPUT_PER_1K
).toFixed(5);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const getRatingColor = (rating) => {
  const r = Number(rating);
  if (r >= 8) return 'green';
  if (r >= 5) return 'orange';
  return 'red';
};

const getRatingLabel = (rating) => {
  const r = Number(rating);
  if (r >= 8) return 'Strong Buy';
  if (r >= 6) return 'Buy';
  if (r >= 5) return 'Hold';
  if (r >= 3) return 'Sell';
  return 'Strong Sell';
};

const AnalysisSection = ({ icon, title, content, colorClass }) => (
  <div className={`analysis-section analysis-section--${colorClass}`}>
    <div className="analysis-section__header">
      <span className="analysis-section__icon" aria-hidden="true">{icon}</span>
      <h4 className="analysis-section__title">{title}</h4>
    </div>
    <p className="analysis-section__content">{content}</p>
  </div>
);

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [reportError, setReportError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const [retriggerLoading, setRetriggerLoading] = useState(false);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch report data
  useEffect(() => {
    const fetchReport = async () => {
      setReportLoading(true);
      try {
        const data = await getReportById(reportId);
        setReport(data);
      } catch (err) {
        setReportError(err);
      } finally {
        setReportLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  // Fetch analysis data
  useEffect(() => {
    const fetchAnalysis = async () => {
      setAnalysisLoading(true);
      setAnalysisError(null);
      try {
        const data = await getAnalysis(reportId);
        setAnalysis(data);
      } catch (err) {
        // 404 means analysis doesn't exist yet — that's OK
        if (err?.response?.status !== 404) {
          setAnalysisError(err);
        }
      } finally {
        setAnalysisLoading(false);
      }
    };
    fetchAnalysis();
  }, [reportId]);

  const handleRetriggerAnalysis = async () => {
    setRetriggerLoading(true);
    setAnalysisError(null);
    try {
      const data = await triggerAnalysis(reportId);
      setAnalysis(data);
    } catch (err) {
      setAnalysisError(err);
    } finally {
      setRetriggerLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteReport(reportId);
      navigate('/reports', { replace: true });
    } catch (err) {
      setDeleteError(err);
      setDeleting(false);
    }
  };

  if (reportLoading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" text="Loading report..." />
      </div>
    );
  }

  if (reportError) {
    return (
      <div className="report-detail-page">
        <Link to="/reports" className="back-link">← Back to Reports</Link>
        <ErrorMessage error={reportError} />
      </div>
    );
  }

  return (
    <div className="report-detail-page">
      {/* Back */}
      <Link to="/reports" className="back-link">← Back to Reports</Link>

      {/* Report Header Card */}
      <div className="report-detail__header-card">
        <div className="report-detail__header-left">
          <div className="report-detail__file-icon" aria-hidden="true">📄</div>
          <div>
            <h2 className="report-detail__name">{report.report_name}</h2>
            <div className="report-detail__meta">
              <span className="badge badge--gray">Year: {report.report_year}</span>
              <span className="badge badge--blue">Company #{report.company_id}</span>
              <span className="badge badge--gray">Report #{report.id}</span>
              <span className="report-detail__date">
                Uploaded {formatDate(report.uploaded_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="report-detail__header-actions">
          <button
            className="btn btn--danger btn--sm"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete report"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {deleteError && <ErrorMessage error={deleteError} onDismiss={() => setDeleteError(null)} />}

      {/* AI Analysis Section */}
      <div className="analysis-wrapper">
        <div className="analysis-header">
          <div className="analysis-header__left">
            <h3 className="analysis-header__title">🤖 AI Financial Analysis</h3>
            <div className="analysis-header__meta">
              <span className="analysis-header__sub">Powered by Groq — llama-3.3-70b-versatile</span>
              {analysis && (
                <span className="analysis-cost-chip">
                  ⚡ ~${COST_PER_ANALYSIS} · ~{(EST_INPUT_TOKENS + EST_OUTPUT_TOKENS).toLocaleString()} tokens
                </span>
              )}
            </div>
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleRetriggerAnalysis}
            disabled={retriggerLoading}
            title="Re-run AI analysis"
          >
            {retriggerLoading ? (
              <>
                <span className="btn-spinner btn-spinner--dark" aria-hidden="true" />
                Analyzing...
              </>
            ) : (
              '↻ Re-analyze'
            )}
          </button>
        </div>

        {analysisError && (
          <ErrorMessage error={analysisError} onDismiss={() => setAnalysisError(null)} />
        )}

        {analysisLoading ? (
          <div className="analysis-loading">
            <LoadingSpinner size="large" text="Running AI analysis..." />
            <p className="analysis-loading__note">
              This may take up to 30 seconds for large PDFs.
            </p>
          </div>
        ) : !analysis ? (
          <div className="analysis-empty">
            <span className="analysis-empty__icon">🤖</span>
            <h4>No analysis yet</h4>
            <p>Click below to run AI analysis on this report.</p>
            <button
              className="btn btn--primary"
              onClick={handleRetriggerAnalysis}
              disabled={retriggerLoading}
            >
              {retriggerLoading ? 'Analyzing...' : '🤖 Run AI Analysis'}
            </button>
          </div>
        ) : (
          <>
            {/* Rating Banner */}
            <div className={`rating-banner rating-banner--${getRatingColor(analysis.overall_rating)}`}>
              <div className="rating-banner__left">
                <div className="rating-banner__label">Overall Rating</div>
                <div className="rating-banner__score">
                  {analysis.overall_rating}
                  <span className="rating-banner__max">/10</span>
                </div>
              </div>
              <div className="rating-banner__right">
                <div className="rating-banner__recommendation">
                  {getRatingLabel(analysis.overall_rating)}
                </div>
                <div className="rating-banner__date">
                  Analysis generated {formatDate(analysis.created_at)}
                </div>
              </div>
              <div className="rating-banner__bar-wrap">
                <div
                  className="rating-banner__bar"
                  style={{ width: `${(Number(analysis.overall_rating) / 10) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={Number(analysis.overall_rating)}
                  aria-valuemin={1}
                  aria-valuemax={10}
                />
              </div>
            </div>

            {/* Analysis Sections */}
            <div className="analysis-sections-grid">
              <AnalysisSection
                icon="🏢"
                title="Company Overview"
                content={analysis.company_overview}
                colorClass="blue"
              />
              <AnalysisSection
                icon="📈"
                title="Revenue Analysis"
                content={analysis.revenue_analysis}
                colorClass="green"
              />
              <AnalysisSection
                icon="💰"
                title="Profitability"
                content={analysis.profitability}
                colorClass="purple"
              />
              <AnalysisSection
                icon="⚠"
                title="Risks"
                content={analysis.risks}
                colorClass="orange"
              />
              <div className="analysis-sections-grid__full">
                <AnalysisSection
                  icon="💡"
                  title="Investment Recommendation"
                  content={analysis.investment_recommendation}
                  colorClass="teal"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Report"
        message={`Are you sure you want to delete "${report?.report_name}"? The PDF file and its AI analysis will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default ReportDetailPage;
