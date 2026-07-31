import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected pages
import DashboardPage from './pages/DashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyFormPage from './pages/CompanyFormPage';
import ReportsPage from './pages/ReportsPage';
import UploadReportPage from './pages/UploadReportPage';
import ReportDetailPage from './pages/ReportDetailPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — wrapped in AppLayout (sidebar + navbar) */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            {/* Index: redirect to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Companies */}
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/new" element={<CompanyFormPage />} />
            <Route path="companies/:companyId/edit" element={<CompanyFormPage />} />

            {/* Reports */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/upload" element={<UploadReportPage />} />
            <Route path="reports/:reportId" element={<ReportDetailPage />} />
          </Route>

          {/* Catch-all: redirect to dashboard (or login if not auth) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
