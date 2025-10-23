import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">📋 TaskTrackr</h1>
            <div className="flex space-x-2">
              <Link to="/dashboard" className="hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition">
                Dashboard
              </Link>
              <Link to="/projects" className="hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition">
                Projects
              </Link>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
