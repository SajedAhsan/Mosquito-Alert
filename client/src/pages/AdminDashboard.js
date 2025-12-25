import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import ReportCard from '../components/ReportCard';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaUsers, FaCheckCircle, FaClock, FaTools, FaCheck, FaTrophy } from 'react-icons/fa';

/**
 * Admin Dashboard
 * Shows categorized reports (Pending, In Progress, Cleared) + Analytics + Leaderboard
 */
const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [breedingDistribution, setBreedingDistribution] = useState([]);
  const [areaRisk, setAreaRisk] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, weeklyRes, breedingRes, riskRes, leaderboardRes, reportsRes] =
        await Promise.all([
          API.get('/admin/analytics/overview'),
          API.get('/admin/analytics/weekly-reports'),
          API.get('/admin/analytics/breeding-distribution'),
          API.get('/admin/analytics/area-risk'),
          API.get('/admin/leaderboard'),
          API.get('/reports'),
        ]);

      setOverview(overviewRes.data);
      setWeeklyReports(weeklyRes.data);
      setBreedingDistribution(breedingRes.data);
      setAreaRisk(riskRes.data);
      setLeaderboard(leaderboardRes.data);
      setAllReports(reportsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    const confirmMessages = {
      'VALID': 'Mark this report as VALID? User will earn +10 points.',
      'INVALID': 'Mark this report as INVALID? User will lose -5 points.',
      'IN_PROGRESS': 'Move this report to IN PROGRESS?',
      'CLEARED': 'Mark this spot as CLEARED?',
      'PENDING': 'Move this report back to PENDING?'
    };

    if (!window.confirm(confirmMessages[newStatus] || `Change status to ${newStatus}?`)) {
      return;
    }

    try {
      const { data } = await API.put(`/reports/${reportId}/status`, { status: newStatus });
      
      // Refresh data
      fetchData();
      
      // Show success message
      alert(data.message || 'Report status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update report status');
    }
  };

  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Filter reports by status
  const pendingReports = allReports.filter(r => r.status === 'PENDING');
  const validReports = allReports.filter(r => r.status === 'VALID');
  const inProgressReports = allReports.filter(r => r.status === 'IN_PROGRESS');
  const clearedReports = allReports.filter(r => r.status === 'CLEARED');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg">Validate reports and monitor system performance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                <p className="text-3xl font-bold text-green-600">{overview.totalUsers}</p>
              </div>
              <FaUsers className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending</p>
                <p className="text-3xl font-bold text-gray-600">{overview.pendingReports || 0}</p>
              </div>
              <FaClock className="text-4xl text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Valid</p>
                <p className="text-3xl font-bold text-green-600">{overview.validReports || 0}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{overview.inProgressReports || 0}</p>
              </div>
              <FaTools className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Cleared</p>
                <p className="text-3xl font-bold text-purple-600">{overview.clearedReports || 0}</p>
              </div>
              <FaCheck className="text-4xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
              <nav className="flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 whitespace-nowrap ${
                    activeTab === 'pending'
                      ? 'border-gray-500 text-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ⏱️ Pending ({pendingReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('valid')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 whitespace-nowrap ${
                    activeTab === 'valid'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ✅ Valid ({validReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('inprogress')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 whitespace-nowrap ${
                    activeTab === 'inprogress'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🔧 In Progress ({inProgressReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('cleared')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 whitespace-nowrap ${
                    activeTab === 'cleared'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🏁 Cleared ({clearedReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📊 Analytics
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 whitespace-nowrap ${
                    activeTab === 'leaderboard'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🏆 Leaderboard
                </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Pending Reports Tab */}
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ⏱️ Pending Reports - Awaiting Validation
                </h2>
                {pendingReports.length === 0 ? (
                  <p className="text-gray-600">No pending reports</p>
                ) : (
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div key={report._id} className="relative">
                        <ReportCard report={report} />
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(report._id, 'VALID')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                          >
                            ✓ Mark Valid (+10 pts)
                          </button>
                          <button
                            onClick={() => handleStatusChange(report._id, 'INVALID')}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                          >
                            ✗ Mark Invalid (-5 pts)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

              {/* Valid Reports Tab */}
              {activeTab === 'valid' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    ✅ Valid Reports - Verified
                  </h2>
                  {validReports.length === 0 ? (
                    <p className="text-gray-600">No valid reports yet</p>
                  ) : (
                    <div className="space-y-4">
                      {validReports.map((report) => (
                        <div key={report._id} className="relative">
                          <ReportCard report={report} />
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(report._id, 'IN_PROGRESS')}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                              🔧 Move to In Progress
                            </button>
                            <button
                              onClick={() => handleStatusChange(report._id, 'PENDING')}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                              ← Back to Pending
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* In Progress Tab */}
              {activeTab === 'inprogress' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    🔧 Reports In Progress
                  </h2>
                  {inProgressReports.length === 0 ? (
                    <p className="text-gray-600">No reports in progress</p>
                  ) : (
                    <div className="space-y-4">
                      {inProgressReports.map((report) => (
                        <div key={report._id} className="relative">
                          <ReportCard report={report} />
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(report._id, 'CLEARED')}
                              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                              ✓ Mark as Cleared
                            </button>
                            <button
                              onClick={() => handleStatusChange(report._id, 'PENDING')}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                            >
                              ← Back to Pending
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {/* Cleared Tab */}
            {activeTab === 'cleared' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ✅ Cleared Reports - Completed
                </h2>
                {clearedReports.length === 0 ? (
                  <p className="text-gray-600">No cleared reports yet</p>
                ) : (
                  <div className="space-y-4">
                    {clearedReports.map((report) => (
                      <ReportCard key={report._id} report={report} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Analytics & Charts</h2>
                
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Weekly Reports */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Weekly Reports</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyReports}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Breeding Distribution */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Breeding Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={breedingDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {breedingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Area Risk Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Area Risk Assessment</h3>
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Report Count</th>
                        <th className="px-4 py-2 text-left">Risk Score</th>
                        <th className="px-4 py-2 text-left">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaRisk.map((area, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{area.location}</td>
                          <td className="px-4 py-2">{area.reportCount}</td>
                          <td className="px-4 py-2">{area.riskScore}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                area.riskLevel === 'High'
                                  ? 'bg-red-100 text-red-800'
                                  : area.riskLevel === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {area.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  Top Contributors
                </h2>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user._id}
                      className={`p-4 rounded-lg ${
                        index === 0
                          ? 'bg-yellow-50 border-2 border-yellow-500'
                          : index === 1
                          ? 'bg-gray-50 border-2 border-gray-400'
                          : index === 2
                          ? 'bg-orange-50 border-2 border-orange-600'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-600">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600">{user.points}</p>
                          <p className="text-xs text-gray-500">POINTS</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
