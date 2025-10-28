// @ts-nocheck
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { AddPostPage } from './components/AddPostPage';
import { NGOPostsPage } from './components/NGOPostsPage';
import { EventsPage } from './components/EventsPage';
import { Toaster } from './components/ui/sonner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

const NGORoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  return user && user.role === 'ngo' ? <>{children}</> : <Navigate to="/home" replace />;
};

const VolunteerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  return user && user.role === 'volunteer' ? <>{children}</> : <Navigate to="/ngo/posts" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <VolunteerRoute>
              <EventsPage />
            </VolunteerRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/add-post"
        element={
          <ProtectedRoute>
            <NGORoute>
              <AddPostPage />
            </NGORoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/posts"
        element={
          <ProtectedRoute>
            <NGORoute>
              <NGOPostsPage />
            </NGORoute>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </Router>
  );
}
