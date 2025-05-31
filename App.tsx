import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navbar, Footer, Spinner } from './components/SharedUI';
import { ChatAssistant } from './components/ChatAssistant'; // Import ChatAssistant
import { LandingPage } from './pages/LandingPage';
import { LoginPage, UserRegistrationPage, AdminOrganizationRegistrationPage } from './pages/AuthPages';
import { SubmitComplaintPage, UserDashboardPage } from './pages/UserWorkflowPages';
import { GuestCheckStatusPage, ComplaintDetailsPage } from './pages/GuestAndComplaintDetailsPages';
import { AdminDashboardPage, AdminManageDepartmentsPage } from './pages/AdminWorkflowPages';
import { HRMDashboardPage, DepartmentDashboardPage } from './pages/HrmAndDepartmentPages';
import { ROUTE_PATHS } from './constants';
import { useAuth } from './contexts/AuthContext';
import { Role } from './types';

const ProtectedRoute: React.FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }

  if (!currentUser) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Optional: Redirect to a generic "Unauthorized" page or back to their own dashboard
    return <Navigate to={ROUTE_PATHS.LANDING} replace />; 
  }

  return <Outlet />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        {children}
      </main>
      {currentUser && <ChatAssistant />} {/* Render ChatAssistant if user is logged in */}
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTE_PATHS.LANDING} element={<LandingPage />} />
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.HRM_LOGIN} element={<LoginPage />} /> 
        <Route path={ROUTE_PATHS.DEPARTMENT_LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.REGISTER_USER} element={<UserRegistrationPage />} />
        <Route path={ROUTE_PATHS.REGISTER_ORGANIZATION} element={<AdminOrganizationRegistrationPage />} />
        <Route path={ROUTE_PATHS.GUEST_CHECK_STATUS} element={<GuestCheckStatusPage />} />
        <Route path={ROUTE_PATHS.COMPLAINT_DETAILS} element={<ComplaintDetailsPage />} /> {/* Access control within component */}


        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
          <Route path={ROUTE_PATHS.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTE_PATHS.ADMIN_MANAGE_DEPARTMENTS} element={<AdminManageDepartmentsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[Role.HRM]} />}>
          <Route path={ROUTE_PATHS.HRM_DASHBOARD} element={<HRMDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[Role.DEPARTMENT]} />}>
          <Route path={ROUTE_PATHS.DEPARTMENT_DASHBOARD} element={<DepartmentDashboardPage />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={[Role.USER, Role.IMPACT_PLAYER]} />}> {/* Impact player might share user dash */}
          <Route path={ROUTE_PATHS.USER_DASHBOARD} element={<UserDashboardPage />} />
          <Route path={ROUTE_PATHS.USER_SUBMIT_COMPLAINT} element={<SubmitComplaintPage />} />
          {/* USER_VIEW_COMPLAINT is covered by COMPLAINT_DETAILS with internal auth */}
        </Route>
        
        {/* Impact Player specific dashboard if needed, otherwise they might use user dashboard with specific filters */}
        <Route element={<ProtectedRoute allowedRoles={[Role.IMPACT_PLAYER]} />}>
            {/* <Route path={ROUTE_PATHS.IMPACT_PLAYER_DASHBOARD} element={<ImpactPlayerDashboardPage />} /> */}
            {/* Placeholder for ImpactPlayerDashboardPage, not fully implemented due to complexity */}
        </Route>


        {/* Fallback / Not Found */}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.LANDING} replace />} />
      </Routes>
    </AppLayout>
  );
};

export default App;