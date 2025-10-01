import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { TrackSelection } from './components/tracks/TrackSelection';
import { WageEmploymentSubSelection } from './components/tracks/WageEmploymentSubSelection';
import { TrackRecommendation } from './components/tracks/TrackRecommendation';
import { EntrepreneurDashboard } from './components/tracks/GroupA/EntrepreneurDashboard';
import { WageEmploymentDashboard } from './components/tracks/GroupC/WageEmploymentDashboard';
import { PathfinderDashboard } from './components/tracks/GroupC/PathfinderDashboard';
import { OpportunitySeekersDashboard } from './components/tracks/GroupC/OpportunitySeekersDashboard';
import { WorkforceReadyDashboard } from './components/tracks/GroupC/WorkforceReadyDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AssessmentQuestionnaire } from './components/assessment/AssessmentQuestionnaire';
import { LearningCoursesRecommendationPage } from './components/learning/LearningCoursesRecommendationPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/track-selection" />} />
      <Route path="/register" element={!user ? <Register /> : user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/track-selection" />} />
      
      <Route path="/career-assessment" element={
        <PrivateRoute>
          <AssessmentQuestionnaire 
            onComplete={(track, confidence) => {
              window.location.href = `/track-recommendation?track=${track}&confidence=${confidence}`;
            }}
            onBack={() => navigate('/track-selection')}
          />
        </PrivateRoute>
      } />
      
      <Route path="/track-recommendation" element={
        <PrivateRoute>
          <TrackRecommendation />
        </PrivateRoute>
      } />
      
      <Route path="/track-selection" element={
        <PrivateRoute>
          <TrackSelection />
        </PrivateRoute>
      } />
      
      <Route path="/wage-employment/selection" element={
        <PrivateRoute>
          <WageEmploymentSubSelection />
        </PrivateRoute>
      } />
      
      <Route path="/entrepreneur/dashboard" element={
        <PrivateRoute>
          <EntrepreneurDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/wage-employment/dashboard" element={
        <PrivateRoute>
          <WageEmploymentDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/pathfinder/dashboard" element={
        <PrivateRoute>
          <PathfinderDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/opportunity-seekers/dashboard" element={
        <PrivateRoute>
          <OpportunitySeekersDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/workforce-ready/dashboard" element={
        <PrivateRoute>
          <WorkforceReadyDashboard />
        </PrivateRoute>
      } />

      <Route path="/learning/recommendations" element={
        <PrivateRoute>
          <LearningCoursesRecommendationPage />
        </PrivateRoute>
      } />
      
      <Route path="/admin/dashboard" element={
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/" element={
        <Navigate to={user ? (user.role === 'admin' ? "/admin/dashboard" : "/track-selection") : "/login"} />
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;