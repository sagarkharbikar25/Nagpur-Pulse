import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuthProvider, useAuth } from './hooks/useAuth';

// Public & Onboarding
import SplashPage from './pages/SplashPage';
import AuthPage from './pages/AuthPage';
import PermissionsOnboardingPage from './pages/PermissionsOnboardingPage';

// Citizen Suite (Open / Optional Login)
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SubmitIssuePage from './pages/SubmitIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';
import HotspotDetailPage from './pages/HotspotDetailPage';
import CitizenLiveFeedPage from './pages/citizen/CitizenLiveFeedPage';
import CitizenWardStatusPage from './pages/citizen/CitizenWardStatusPage';
import CitizenInfrastructurePage from './pages/citizen/CitizenInfrastructurePage';
import CitizenCivicAIPage from './pages/citizen/CitizenCivicAIPage';

// Authority Suite (Protected)
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AuthorityWardStatusPage from './pages/authority/AuthorityWardStatusPage';
import AuthorityInfrastructurePage from './pages/authority/AuthorityInfrastructurePage';
import AuthorityLiveFeedPage from './pages/authority/AuthorityLiveFeedPage';
import AuthorityCivicAIHubPage from './pages/authority/AuthorityCivicAIHubPage';

// Admin Suite (Protected)
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminLiveFeedPage from './pages/admin/AdminLiveFeedPage';
import AdminWardPerformancePage from './pages/admin/AdminWardPerformancePage';
import AdminInfrastructurePage from './pages/admin/AdminInfrastructurePage';
import AdminCivicAIHubPage from './pages/admin/AdminCivicAIHubPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Role-Based Protected route wrapper
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Array<'citizen' | 'authority' | 'admin'>;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F141C]">
        <div className="w-8 h-8 border-2 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  let storedUser = null;
  try {
    const raw = localStorage.getItem('nagpur_pulse_user');
    if (raw) storedUser = JSON.parse(raw);
  } catch {
    // ignore
  }

  const activeUser = user || storedUser;

  if (!activeUser) {
    return <Navigate to={`/auth?role=${allowedRoles?.[0] || 'official'}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeUser.role)) {
    return <Navigate to={`/auth?role=${allowedRoles[0]}`} replace />;
  }

  return <>{children}</>;
};

// App with Auth context
const AppInner = () => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Routes>
          {/* Public & Entry */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<PermissionsOnboardingPage />} />

          {/* Citizen Suite (Freely Accessible without Forced Login) */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submit" element={<SubmitIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/hotspots/:id" element={<HotspotDetailPage />} />
          <Route path="/citizen/dashboard" element={<DashboardPage />} />
          <Route path="/citizen/feed" element={<CitizenLiveFeedPage />} />
          <Route path="/citizen/wards" element={<CitizenWardStatusPage />} />
          <Route path="/citizen/infrastructure" element={<CitizenInfrastructurePage />} />
          <Route path="/citizen/ai-assistant" element={<CitizenCivicAIPage />} />

          {/* Authority Suite (Strict Role Protection: Authority / Admin) */}
          <Route
            path="/authority/dashboard"
            element={
              <ProtectedRoute allowedRoles={['authority', 'admin']}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/ward-status"
            element={
              <ProtectedRoute allowedRoles={['authority', 'admin']}>
                <AuthorityWardStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/infrastructure"
            element={
              <ProtectedRoute allowedRoles={['authority', 'admin']}>
                <AuthorityInfrastructurePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/feed"
            element={
              <ProtectedRoute allowedRoles={['authority', 'admin']}>
                <AuthorityLiveFeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/ai-hub"
            element={
              <ProtectedRoute allowedRoles={['authority', 'admin']}>
                <AuthorityCivicAIHubPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Suite (Strict Role Protection: Admin Only) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feed"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLiveFeedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ward-performance"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWardPerformancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/infrastructure"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminInfrastructurePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ai-hub"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCivicAIHubPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
