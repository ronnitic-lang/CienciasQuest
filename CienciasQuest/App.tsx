
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './views/Login';
import StudentMap from './views/StudentMap';
import Quiz from './views/Quiz';
import TeacherDashboard from './views/TeacherDashboard';
import AdminDashboard from './views/AdminDashboard';
import Profile from './views/Profile';
import Leaderboard from './views/Leaderboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (user.role === 'TEACHER' && user.status === 'pending') {
      return <Navigate to="/" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
    const { user } = useAuth();
    
    return (
        <Routes>
            <Route path="/" element={
                user ? (
                    user.role === 'ADMIN' ? <Navigate to="/admin-panel" replace /> : <Navigate to="/dashboard" replace />
                ) : <Login />
            } />
            
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    {user?.role === 'TEACHER' ? <TeacherDashboard /> : <StudentMap />}
                </ProtectedRoute>
            } />

            <Route path="/leaderboard" element={
                <ProtectedRoute>
                    <Leaderboard />
                </ProtectedRoute>
            } />
            
            <Route path="/admin-panel" element={
                <ProtectedRoute>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            
            <Route path="/quiz/:unitId" element={
                <ProtectedRoute>
                    <Quiz />
                </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </AuthProvider>
  );
};

export default App;
