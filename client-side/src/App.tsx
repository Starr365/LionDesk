import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import Activate from './pages/Activate';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Docs from './pages/Docs';

// Provider contexts
import { AuthProvider } from './components/shared/AuthContext';
import { SocketProvider } from './components/shared/SocketContext';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/shared/ScrollToTop';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/activate" element={<Activate />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
