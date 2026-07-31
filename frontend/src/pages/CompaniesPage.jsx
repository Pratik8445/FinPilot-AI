import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies, deleteCompany } from '../api/companyApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmModal from '../components/ConfirmModal';
import './CompaniesPage.css';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCompany(deleteTarget.id);
      setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.ticker.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
    );
  });

  return (
    <div className="companies-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Companies</h2>
          <p className="page-subtitle">{companies.length} total companies</p>
        </div>
        <Link to="/companies/new" className="btn btn--primary">
          + Add Company
        </Link>
      </div>

      {/* Errors */}
      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}
      {deleteError && <ErrorMessage error={deleteError} onDismiss={() => setDeleteError(null)} />}

      {/* Search */}
      {!loading && companies.length > 0 && (
        <div className="search-bar">
          <span className="search-bar__icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="search-bar__input"
            placeholder="Search by name, ticker, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search companies"
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
          <LoadingSpinner size="large" text="Loading companies..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="page-empty">
          {search ? (
            <>
              <span className="page-empty__icon">🔍</span>
              <p>No companies match &quot;{search}&quot;</p>
              <button className="btn btn--ghost" onClick={() => setSearch('')}>Clear search</button>
            </>
          ) : (
            <>
              <span className="page-empty__icon">🏭</span>
              <p>No companies yet. Add your first company to get started.</p>
              <Link to="/companies/new" className="btn btn--primary">
                + Add Company
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="companies-grid">
          {filtered.map((company) => (
            <div key={company.id} className="company-card">
              <div className="company-card__header">
                <div className="company-card__avatar">
                  {company.ticker.charAt(0)}
                </div>
                <div className="company-card__badges">
                  <span className="badge badge--blue">{company.ticker}</span>
                  <span className="badge badge--gray">{company.sector}</span>
                </div>
              </div>
              <div className="company-card__body">
                <h3 className="company-card__name">{company.name}</h3>
                <p className="company-card__id">ID #{company.id}</p>
              </div>
              <div className="company-card__actions">
                <Link
                  to={`/companies/${company.id}/edit`}
                  className="btn btn--ghost btn--sm"
                  aria-label={`Edit ${company.name}`}
                >
                  ✏ Edit
                </Link>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => setDeleteTarget(company)}
                  aria-label={`Delete ${company.name}`}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteTarget(null); setDeleteError(null); }}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default CompaniesPage;
