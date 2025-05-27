
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is on research-context route, redirect to home
    if (location.pathname === '/research-context') {
      console.log("Redirecting from removed research-context route to home");
      navigate('/', { replace: true });
      return;
    }
    
    console.error(`404 Error: User attempted to access non-existent route: ${location.pathname}`);
  }, [location.pathname, navigate]);

  // If it's the research-context route, show loading while redirecting
  if (location.pathname === '/research-context') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
