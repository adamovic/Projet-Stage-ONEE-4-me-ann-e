import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing         from './pages/Landing.jsx';
import Login           from './pages/Login.jsx';
import WizardShell     from './pages/wizard/WizardShell.jsx';
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import AdminDashboard  from './pages/admin/AdminDashboard.jsx';
import './styles/globals.css';

export default function App() {
  const [session, setSession] = useState(null);

  function handleLogin(user) {
    setSession(user);
  }

  function handleLogout() {
    setSession(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={
          session
            ? <Navigate to={session.role === 'admin' ? '/admin' : '/employee'} replace />
            : <Login onLogin={handleLogin} />
        } />

        {/* Wizard — accessible sans auth pour la démo */}
        <Route path="/wizard" element={<WizardShell session={session} />} />

        {/* Employee dashboard */}
        <Route path="/employee" element={
          session
            ? <EmployeeDashboard session={session} onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        } />

        {/* Admin dashboard */}
        <Route path="/admin" element={
          session?.role === 'admin'
            ? <AdminDashboard session={session} onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
