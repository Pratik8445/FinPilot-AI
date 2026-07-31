import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AppLayout.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/companies': 'Companies',
  '/companies/new': 'Add Company',
  '/reports': 'Financial Reports',
  '/reports/upload': 'Upload Report',
};

const getTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/companies/') && pathname.endsWith('/edit')) return 'Edit Company';
  if (pathname.startsWith('/reports/')) return 'Report Details';
  return 'FinanceAI';
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  return (
    <div className="app-layout">
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-layout__main">
        <Navbar
          title={title}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
