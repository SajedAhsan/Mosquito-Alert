import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { 
  FaPlus, 
  FaFilter, 
  FaSearch, 
  FaTimes,
  FaExclamationCircle 
} from 'react-icons/fa';
import ReportFeedCard from '../components/ReportFeedCard';
import SkeletonCard from '../components/SkeletonCard';

/**
 * My Reports Page - Facebook-style Feed
 * Displays all reports submitted by the logged-in user
 * Features: Filters, Search, Status tracking, Infinite scroll
 */
const MyReports = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [breedingTypeFilter, setBreedingTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch user reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await API.get('/reports/my-reports');
      setReports(data);
      setFilteredReports(data);
      
      // Refresh user data for updated points
      const userData = await API.get('/auth/me');
      updateUser(userData.data);
      
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Refresh reports every 10 seconds to catch admin validations
    const interval = setInterval(() => {
      fetchReports();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, breedingTypeFilter, severityFilter, reports]);

  const applyFilters = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Breeding type filter
    if (breedingTypeFilter !== 'ALL') {
      filtered = filtered.filter(report => report.breedingType === breedingTypeFilter);
    }

    // Severity filter
    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(report => report.severity === severityFilter);
    }

    setFilteredReports(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setBreedingTypeFilter('ALL');
    setSeverityFilter('ALL');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'ALL' || breedingTypeFilter !== 'ALL' || severityFilter !== 'ALL';

  // Handle report deletion
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await API.delete(`/reports/${reportId}`);
      
      // Remove from state
      setReports(reports.filter(r => r._id !== reportId));
      
      // Refresh user data
      const { data } = await API.get('/auth/me');
      updateUser(data);
      
      alert('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      alert(error.response?.data?.message || 'Failed to delete report');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">My Reports</h1>
            <p className="text-lg">Loading your reporting history...</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">My Reports</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 text-3xl mr-4" />
              <div>
                <h3 className="text-red-800 font-bold text-lg mb-2">Failed to Load Reports</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchReports}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">My Reports</h1>
            <p className="text-lg">Your reporting history</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-gray-300 text-8xl mb-6">📋</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Reports Yet</h2>
            <p className="text-gray-600 text-lg mb-8">
              You haven't submitted any mosquito breeding site reports.<br />
              Start contributing to your community's health today!
            </p>
            <Link
              to="/create-report"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition duration-300 shadow-lg"
            >
              <FaPlus />
              <span>Report a Breeding Spot</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Reports</h1>
              <p className="text-lg">
                {filteredReports.length} {filteredReports.length === 1 ? 'Report' : 'Reports'}
                {' • '}
                {user.points || 0} Points
              </p>
            </div>
            <Link
              to="/create-report"
              className="bg-white text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center space-x-2 shadow-lg"
            >
              <FaPlus />
              <span>New Report</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Search Bar */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                showFilters || hasActiveFilters
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="VALID">Valid</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLEARED">Cleared</option>
                  </select>
                </div>

                {/* Breeding Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Breeding Type
                  </label>
                  <select
                    value={breedingTypeFilter}
                    onChange={(e) => setBreedingTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="ALL">All Types</option>
                    <option value="Standing Water">Standing Water</option>
                    <option value="Trash">Trash</option>
                    <option value="Drain">Drain</option>
                  </select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="ALL">All Severities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold transition duration-300"
                  >
                    <FaTimes />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        {hasActiveFilters && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        )}

        {/* Reports Feed */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-300 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reports Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search term
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <ReportFeedCard
                key={report._id}
                report={report}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
