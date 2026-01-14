import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Marketing pages (old)
import Landing from './pages/marketing/Landing';
import Product from './pages/marketing/Product';

// New editorial design pages
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// App pages
import Login from './pages/app/Login';
import EmployeeDashboard from './pages/app/employee/Dashboard';
import EmployeeAssets from './pages/app/employee/Assets';
import AssetDetail from './pages/app/employee/AssetDetail';
import Scan from './pages/app/employee/Scan';
import ManagerApprovals from './pages/app/manager/Approvals';
import AdminDashboard from './pages/app/admin/Dashboard';
import AdminAssets from './pages/app/admin/Assets';
import AdminSites from './pages/app/admin/Sites';
import AdminPolicies from './pages/app/admin/Policies';
import AdminUsers from './pages/app/admin/Users';
import AuditExplorer from './pages/app/Audit';

// Layouts
import MarketingLayout from './components/layouts/MarketingLayout';
import AppLayout from './components/layouts/AppLayout';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/employee" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* NEW: Editorial Marketing Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* LEGACY: Old marketing routes (kept for compatibility) */}
      <Route element={<MarketingLayout />}>
        <Route path="/old/landing" element={<Landing />} />
        <Route path="/product" element={<Product />} />
      </Route>

      {/* App routes */}
      <Route path="/app/login" element={<Login />} />
      
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        {/* Employee routes */}
        <Route path="employee" element={<EmployeeDashboard />} />
        <Route path="employee/assets" element={<EmployeeAssets />} />
        <Route path="employee/assets/:id" element={<AssetDetail />} />
        <Route path="employee/scan" element={<Scan />} />
        
        {/* Manager routes */}
        <Route path="manager/approvals" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <ManagerApprovals />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/assets" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAssets />
          </ProtectedRoute>
        } />
        <Route path="admin/sites" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminSites />
          </ProtectedRoute>
        } />
        <Route path="admin/policies" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPolicies />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        
        {/* Audit route */}
        <Route path="audit" element={<AuditExplorer />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
