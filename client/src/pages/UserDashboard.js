import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import ReportCard from '../components/ReportCard';
import { FaPlus, FaTrophy, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';

/**
 * User Dashboard
 * Shows personal reports, points, and risk alerts
 */
const UserDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [areaRisk, setAreaRisk] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      const { data } = await API.get('/auth/me');
      updateUser(data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [reportsRes, riskRes] = await Promise.all([
        API.get('/reports/my-reports'),
        API.get('/admin/analytics/area-risk'),
      ]);

      setMyReports(reportsRes.data);
      setAreaRisk(riskRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    refreshUserData();

    // Poll for updates every 10 seconds to catch new reports and admin validations
    const interval = setInterval(() => {
      refreshUserData();
      fetchData(); // Also refresh reports list
    }, 10000);

    // Refresh when window/tab becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
        refreshUserData();
      }
    };

    // Refresh when window gains focus
    const handleFocus = () => {
      fetchData();
      refreshUserData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await API.delete(`/reports/${reportId}`);
      
      // Remove from local state
      setMyReports(myReports.filter(report => report._id !== reportId));
      
      // Refresh user data to update points
      const { data } = await API.get('/auth/me');
      updateUser(data);
      
      alert('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      alert(error.response?.data?.message || 'Failed to delete report');
    }
  };

  // Get high-risk areas
  const highRiskAreas = areaRisk.filter((area) => area.riskLevel === 'High');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-lg">Track your reports and help keep your community safe</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Reports Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Points Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Your Points</p>
                    <p className="text-4xl font-bold text-green-600">{user.points || 0}</p>
                  </div>
                  <FaTrophy className="text-5xl text-yellow-500" />
                </div>
              </div>

              {/* Reports Card - Now Clickable */}
              <Link
                to="/my-reports"
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-4 text-white h-full">
                  <FaFileAlt className="text-5xl" />
                  <div>
                    <p className="text-2xl font-bold">My Reports</p>
                    <p className="text-sm opacity-90">View all your submissions</p>
                  </div>
                </div>
              </Link>

              {/* Leaderboard Link Card */}
              <Link
                to="/leaderboard"
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-semibold">View</p>
                    <p className="text-2xl font-bold">Leaderboard</p>
                  </div>
                  <FaTrophy className="text-5xl" />
                </div>
              </Link>
            </div>

            {/* Create Report Button */}
            <Link
              to="/create-report"
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-center transition duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <FaPlus className="text-xl" />
              <span className="text-lg">Create New Report</span>
            </Link>

            {/* My Reports Feed */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Reports</h2>
              {myReports.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't submitted any reports yet.</p>
                  <Link
                    to="/create-report"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                  >
                    Create Your First Report
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((report) => (
                    <ReportCard 
                      key={report._id} 
                      report={report} 
                      showDeleteButton={true}
                      onDelete={handleDeleteReport}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Risk Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                High-Risk Areas
              </h2>

              {highRiskAreas.length === 0 ? (
                <p className="text-gray-600 text-sm">No high-risk areas detected.</p>
              ) : (
                <div className="space-y-3">
                  {highRiskAreas.slice(0, 5).map((area, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-200 rounded-lg p-4"
                    >
                      <p className="font-semibold text-red-800">{area.location}</p>
                      <p className="text-sm text-red-600 mt-1">
                        {area.reportCount} reports • Risk Score: {area.riskScore}
                      </p>
                      <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800">
                        HIGH RISK
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Earn more points by submitting accurate reports with clear images!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
