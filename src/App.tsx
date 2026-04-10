import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Main Application Pages
import DashboardPage from './pages/DashboardPage';
import PoliciesPage from './pages/PoliciesPage';
import SIPPage from './pages/SIPPage';
import SWPPage from './pages/SWPPage';
import LumpsumPage from './pages/LumpsumPage';
import GoalSIPPage from './pages/GoalSIPPage';
import CAGRPage from './pages/CAGRPage';
import InflationPage from './pages/InflationPage';
import RetirementPage from './pages/RetirementPage';

const App = () => {
  const { setUser, setInitialized, setLoading } = useAuthStore();

  useEffect(() => {
    // BYPASS MODE: Automatically logging in as a mock user
    console.log("BYPASS MODE: Skipping Firebase Auth");
    setUser({
      id: 'local-demo-123',
      email: 'demo@finlytic.app',
      displayName: 'Demo User',
      photoURL: '',
      createdAt: new Date().toISOString(),
    });
    setLoading(false);
    setInitialized(true);
    
    // Previous Firebase listener is commented out:
    /*
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      if (firebaseUser) {
        setUser({ ... });
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
    });
    return () => unsubscribe();
    */
  }, [setUser, setInitialized, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="" element={<Navigate to="login" replace />} />
        </Route>

        {/* Main Application Routes (Public for calculation, Private for saving) */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="sip" element={<SIPPage />} />
          <Route path="swp" element={<SWPPage />} />
          <Route path="lumpsum" element={<LumpsumPage />} />
          <Route path="goal" element={<GoalSIPPage />} />
          <Route path="cagr" element={<CAGRPage />} />
          <Route path="inflation" element={<InflationPage />} />
          <Route path="retirement" element={<RetirementPage />} />
          
          {/* Protected Area: User Policies */}
          <Route path="policies" element={
            <ProtectedRoute>
              <PoliciesPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
