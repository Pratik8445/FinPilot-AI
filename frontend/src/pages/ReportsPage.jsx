import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReports, deleteReport } from '../api/reportApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import './ReportsPage.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteReport(deleteTarget.id);
      setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.report_name.toLowerCase().includes(q) ||
      String(r.report_year).includes(q) ||
      String(r.company_id).includes(q)
    );
  });

  // Sort most recent first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
  );

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Financial Reports</h2>
          <p className="page-subtitle">{reports.length} total reports</p>
        </div>
        <Link to="/reports/upload" className="btn btn--primary">
          ⬆ Upload Report
        </Link>
      </div>

      {/* Errors */}
      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}
      {deleteError && <ErrorMessage error={deleteError} onDismiss={() => setDeleteError(null)} />}

      {/* Search */}
      {!loading && reports.length > 0 && (
        <div className="search-bar">
          <span className="search-bar__icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="search-bar__input"
            placeholder="Search by filename, year, or company ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search reports"
          />
          {search && (
            <button
              className="search-bar__clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="page-loading">
          <LoadingSpinner size="large" text="Loading reports..." />
        </div>
      ) : sorted.length === 0 ? (
        <div className="page-empty">
          {search ? (
            <>
              <span className="page-empty__icon">🔍</span>
              <p>No reports match &quot;{search}&quot;</p>
              <button className="btn btn--ghost" onClick={() => setSearch('')}>Clear search</button>
            </>
          ) : (
            <>
              <span className="page-empty__icon">📭</span>
              <p>No reports yet. Upload a PDF to start analyzing.</p>
              <Link to="/reports/upload" className="btn btn--primary">
                ⬆ Upload first report
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="reports-table-wrapper">
          <table className="reports-table" aria-label="Financial reports list">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Report Name</th>
                <th scope="col">Company</th>
                <th scope="col">Year</th>
                <th scope="col">Uploaded</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((report) => (
                <tr key={report.id}>
                  <td className="reports-table__id">{report.id}</td>
                  <td className="reports-table__name">
                    <div className="reports-table__file-icon" aria-hidden="true">📄</div>
                    <Link to={`/reports/${report.id}`} className="reports-table__link">
                      {report.report_name}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge--blue">Co. #{report.company_id}</span>
                  </td>
                  <td>
                    <span className="badge badge--gray">{report.report_year}</span>
                  </td>
                  <td className="reports-table__date">
                    {formatDate(report.uploaded_at)}
                  </td>
                  <td>
                    <div className="reports-table__actions">
                      <Link
                        to={`/reports/${report.id}`}
                        className="btn btn--ghost btn--sm"
                        aria-label={`View analysis for ${report.report_name}`}
                      >
                        🤖 Analysis
                      </Link>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => setDeleteTarget(report)}
                        aria-label={`Delete ${report.report_name}`}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Report"
        message={`Are you sure you want to delete "${deleteTarget?.report_name}"? The PDF file and its AI analysis will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default ReportsPage;
