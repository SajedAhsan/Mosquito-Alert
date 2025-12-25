import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaTools, FaCheck } from 'react-icons/fa';

/**
 * Report Card Component - Facebook-style card
 * Displays mosquito report in a social media feed style
 */
const ReportCard = ({ report, showDeleteButton = false, onDelete }) => {
  // Get severity badge color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get status badge color and icon
  const getStatusBadge = (status) => {
    switch (status) {
      case 'VALID':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <FaCheckCircle className="inline mr-1" />,
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <FaTools className="inline mr-1" />,
        };
      case 'CLEARED':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: <FaCheck className="inline mr-1" />,
        };
      case 'PENDING':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <FaClock className="inline mr-1" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <FaClock className="inline mr-1" />,
        };
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get image URL
  const imageUrl = report.imagePath 
    ? `http://localhost:5000/${report.imagePath.replace(/\\/g, '/')}`
    : null;

  const statusBadge = getStatusBadge(report.status);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 mb-4">
      {/* User Info Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <FaMapMarkerAlt className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {report.userId?.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <FaCalendarAlt className="mr-1" />
                {formatDate(report.date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Status Badge */}
            <span className={`${statusBadge.bg} ${statusBadge.text} text-xs font-semibold px-3 py-1 rounded-full border`}>
              {statusBadge.icon}
              {report.status}
            </span>

            {/* Delete Button */}
            {showDeleteButton && onDelete && (
              <button
                onClick={() => onDelete(report._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full transition duration-300"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image - Prominent Display */}
      {imageUrl && (
        <div className="w-full bg-gray-100">
          <img
            src={imageUrl}
            alt="Mosquito breeding site"
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
      )}

      {/* Report Details */}
      <div className="p-4 space-y-3">
        {/* Location */}
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span className="text-gray-700 font-medium">{report.location}</span>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2">
          {/* Breeding Type Badge */}
          <span className="badge text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
            {report.breedingType}
          </span>

          {/* Severity Badge */}
          <span className={`badge text-xs font-semibold px-3 py-1 rounded-full border ${getSeverityColor(report.severity)}`}>
            Severity: {report.severity}
          </span>

          {/* Points Badge - only show if awarded */}
          {report.pointsAwarded !== 0 && (
            <span className={`badge text-xs font-semibold px-3 py-1 rounded-full border ${report.pointsAwarded > 0 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
              {report.pointsAwarded > 0 ? '+' : ''}{report.pointsAwarded} pts
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
