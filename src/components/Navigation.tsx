
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">Memory AI</Link>
      </div>
      <div className="flex items-center space-x-8">
        <Link to="/saved" className="text-gray-600 hover:text-gray-900">Saved</Link>
        <Link to="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
        <Link to="/account" className="text-gray-600 hover:text-gray-900">Account</Link>
      </div>
    </nav>
  );
};
