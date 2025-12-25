import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaBug, FaTrophy } from 'react-icons/fa';

/**
 * Navigation Bar Component
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaBug className="text-3xl text-green-500" />
            <span className="text-2xl font-bold text-gray-800">
              Mosquito Alert+
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center space-x-6">
              {/* Dashboard Link */}
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center space-x-2 text-gray-700 hover:text-green-500 transition duration-200"
              >
                <FaTachometerAlt />
                <span className="font-medium">Dashboard</span>
              </Link>

              {/* Leaderboard Link - Show for all users */}
              <Link
                to="/leaderboard"
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500 transition duration-200"
              >
                <FaTrophy />
                <span className="font-medium">Leaderboard</span>
              </Link>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  {!isAdmin && (
                    <p className="text-xs text-green-600 font-bold">
                      {user.points || 0} Points
                    </p>
                  )}
                  {isAdmin && (
                    <p className="text-xs text-purple-600 font-bold">Admin</p>
                  )}
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <FaUser className="text-green-600" />
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
