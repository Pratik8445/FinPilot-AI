import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCompanies } from '../api/companyApi';
import { getReports } from '../api/reportApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './DashboardPage.css';

// Groq llama-3.3-70b-versatile pricing
const PRICING = {
  inputPer1K:   0.00059,
  outputPer1K:  0.00079,
  estInputTok:  3000,
  estOutputTok: 400,
};
const costPerAnalysis = (
  (PRICING.estInputTok  / 1000) * PRICING.inputPer1K +
  (PRICING.estOutputTok / 1000) * PRICING.outputPer1K
);

const StatCard = ({ label, value, icon, color, linkTo, linkLabel }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-card__top">
      <div className="stat-card__icon" aria-hidden="true">{icon}</div>
    </div>
    <div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
    {linkTo && (
      <Link to={linkTo} className="stat-card__link">
        {linkLabel} →
      </Link>
    )}
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [companiesData, reportsData] = await Promise.all([
          getCompanies(),
          getReports(),
        ]);
        setCompanies(companiesData);
        setReports(reportsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
    .slice(0, 6);

  const reportsByYear = reports.reduce((acc, r) => {
    acc[r.report_year] = (acc[r.report_year] || 0) + 1;
    return acc;
  }, {});

  const totalCost = (reports.length * costPerAnalysis).toFixed(4);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="dashboard__welcome">
        <div>
          <h2 className="dashboard__greeting">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="dashboard__greeting-sub">
            AI-powered financial analysis workspace — all your reports and insights in one place.
          </p>
        </div>
        <Link to="/reports/upload" className="btn btn--primary btn--lg">
          ⬆ Upload Report
        </Link>
      </div>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div className="dashboard__loading">
          <LoadingSpinner size="large" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-cards-grid">
            <StatCard label="Companies" value={companies.length} icon="🏢" color="blue"
              linkTo="/companies" linkLabel="Manage" />
            <StatCard label="Reports" value={reports.length} icon="📋" color="green"
              linkTo="/reports" linkLabel="View all" />
            <StatCard label="AI Analyses Run" value={reports.length} icon="🤖" color="purple"
              linkTo="/reports" linkLabel="View all" />
            <StatCard label="Years Covered" value={Object.keys(reportsByYear).length} icon="📅" color="orange" />
          </div>

          {/* Token Pricing Panel */}
          <div className="token-cost-card">
            <div className="token-cost-card__header">
              <div className="token-cost-card__title">
                ⚡ Groq AI Usage & Pricing
              </div>
              <span className="token-cost-card__model">llama-3.3-70b-versatile</span>
            </div>

            <div className="token-metric">
              <div className="token-metric__label">Input Rate</div>
              <div className="token-metric__value token-metric__value--cyan">$0.59</div>
              <div className="token-metric__sub">per 1M tokens</div>
            </div>

            <div className="token-metric">
              <div className="token-metric__label">Output Rate</div>
              <div className="token-metric__value token-metric__value--purple">$0.79</div>
              <div className="token-metric__sub">per 1M tokens</div>
            </div>

            <div className="token-metric">
              <div className="token-metric__label">Per Analysis</div>
              <div className="token-metric__value token-metric__value--green">
                ~${costPerAnalysis.toFixed(5)}
              </div>
              <div className="token-metric__sub">~3,400 tokens avg</div>
            </div>

            <div className="token-metric">
              <div className="token-metric__label">Total Spent ({reports.length} runs)</div>
              <div className="token-metric__value token-metric__value--green">${totalCost}</div>
              <div className="token-metric__sub">estimated cost</div>
            </div>
          </div>

          {/* Panels */}
          <div className="dashboard__grid">
            {/* Recent Reports */}
            <div className="dashboard__panel">
              <div className="dashboard__panel-header">
                <h3 className="dashboard__panel-title">Recent Reports</h3>
                <Link to="/reports" className="dashboard__panel-link">View all →</Link>
              </div>
              {recentReports.length === 0 ? (
                <div className="dashboard__empty">
                  <span className="dashboard__empty-icon">📭</span>
                  <p>No reports yet. Upload your first PDF to get AI analysis.</p>
                  <Link to="/reports/upload" className="btn btn--primary btn--sm">
                    Upload Report
                  </Link>
                </div>
              ) : (
                <ul className="dashboard__report-list">
                  {recentReports.map((report) => (
                    <li key={report.id} className="dashboard__report-item">
                      <div className="dashboard__report-icon">📄</div>
                      <div className="dashboard__report-info">
                        <Link to={`/reports/${report.id}`} className="dashboard__report-name">
                          {report.report_name}
                        </Link>
                        <div className="dashboard__report-meta">
                          Company #{report.company_id} &bull; Uploaded {new Date(report.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="dashboard__report-badge">{report.report_year}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Companies */}
            <div className="dashboard__panel">
              <div className="dashboard__panel-header">
                <h3 className="dashboard__panel-title">Companies</h3>
                <Link to="/companies" className="dashboard__panel-link">Manage →</Link>
              </div>
              {companies.length === 0 ? (
                <div className="dashboard__empty">
                  <span className="dashboard__empty-icon">🏭</span>
                  <p>No companies yet. Add one to start uploading reports.</p>
                  <Link to="/companies/new" className="btn btn--primary btn--sm">
                    Add Company
                  </Link>
                </div>
              ) : (
                <ul className="dashboard__company-list">
                  {companies.slice(0, 7).map((company) => (
                    <li key={company.id} className="dashboard__company-item">
                      <div className="dashboard__company-avatar">
                        {company.ticker.charAt(0)}
                      </div>
                      <div className="dashboard__company-info">
                        <div className="dashboard__company-name">{company.name}</div>
                        <div className="dashboard__company-meta">
                          <span className="badge badge--blue">{company.ticker}</span>
                          <span className="badge badge--gray">{company.sector}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
