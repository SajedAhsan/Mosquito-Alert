import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { FaTrophy, FaMedal, FaAward, FaStar, FaCrown } from 'react-icons/fa';

/**
 * Public Leaderboard Page
 * Shows top contributors - accessible to all users
 */
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get('/admin/leaderboard');
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get medal/trophy icon and color based on rank
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaCrown className="text-4xl text-yellow-500" />;
      case 1:
        return <FaMedal className="text-4xl text-gray-400" />;
      case 2:
        return <FaMedal className="text-4xl text-orange-600" />;
      default:
        return <FaStar className="text-4xl text-blue-500" />;
    }
  };

  // Get background color based on rank
  const getRankBgColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
      case 1:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
      case 2:
        return 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // Get rank badge
  const getRankBadge = (index) => {
    if (index < 3) {
      const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-600'];
      const labels = ['1st Place', '2nd Place', '3rd Place'];
      return (
        <span className={`${colors[index]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {labels[index]}
        </span>
      );
    }
    return (
      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
        #{index + 1}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FaTrophy className="text-6xl mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-3">🏆 Leaderboard</h1>
          <p className="text-xl">Top Contributors Making a Difference!</p>
          <p className="text-sm mt-2 opacity-90">
            Ranked by points earned from valid mosquito breeding site reports
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
          <div className="flex items-start">
            <FaAward className="text-blue-500 text-2xl mr-3 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">How Points Work</h3>
              <p className="text-blue-800 text-sm">
                • <strong>VALID</strong> reports: 10 points • <strong>NEEDS REVIEW</strong>: 5 points • <strong>INVALID</strong>: 0 points
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No contributors yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div
                key={user._id}
                className={`${getRankBgColor(index)} rounded-lg shadow-lg border-2 p-6 transition duration-300 hover:shadow-xl hover:scale-102 transform`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Rank Icon & User Info */}
                  <div className="flex items-center space-x-4">
                    {/* Rank Icon */}
                    <div className="flex-shrink-0">
                      {getRankIcon(index)}
                    </div>

                    {/* User Details */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                        {getRankBadge(index)}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  {/* Right: Points */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <FaTrophy className="text-yellow-500 text-xl" />
                      <div>
                        <p className="text-4xl font-bold text-green-600">{user.points}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Points</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges for Top 3 */}
                {index < 3 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      {index === 0 && (
                        <>
                          <FaTrophy className="text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-700">
                            Champion Contributor 🎖️
                          </span>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <FaMedal className="text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            Outstanding Contributor ⭐
                          </span>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <FaMedal className="text-orange-600" />
                          <span className="text-sm font-semibold text-orange-700">
                            Excellent Contributor 🌟
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Want to climb the ranks? 📈</h3>
          <p className="mb-4">Submit high-quality reports with clear images to earn more points!</p>
          <a
            href="/create-report"
            className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Submit a Report
          </a>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
