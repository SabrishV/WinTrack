import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm text-gray-600 overflow-auto">{error.message}</pre>
        <div className="mt-4 text-sm text-gray-500">
          <p>Please try refreshing the page. If the problem persists, contact support.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { currentUser, loading } = useAuth();

  // Add debugging logs
  useEffect(() => {
    console.log('App rendered, auth state:', { currentUser, loading });
  }, [currentUser, loading]);

  if (loading) {
    console.log('App is in loading state');
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  console.log('App is not loading, currentUser:', currentUser);

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error caught by ErrorBoundary:', error);
        console.error('Component stack:', info.componentStack);
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 