import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTools,
  FaCheck,
  FaAward
} from 'react-icons/fa';

/**
 * Report Feed Card - Facebook-style Post Layout
 * Image-first design for My Reports page
 */
const ReportFeedCard = ({ report, onDelete }) => {
  // Format date to human-readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge styling
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Reported',
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: <FaClock className="inline mr-1" />
        };
      case 'VALID':
        return {
          label: 'Verified',
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: <FaCheckCircle className="inline mr-1" />
        };
      case 'IN_PROGRESS':
        return {
          label: 'In Progress',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: <FaTools className="inline mr-1" />
        };
      case 'CLEARED':
        return {
          label: 'Cleaned',
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          border: 'border-purple-300',
          icon: <FaCheck className="inline mr-1" />
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: <FaClock className="inline mr-1" />
        };
    }
  };

  // Get severity badge styling
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'High':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300'
        };
      case 'Medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300'
        };
      case 'Low':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300'
        };
    }
  };

  // Get breeding type emoji
  const getBreedingIcon = (type) => {
    switch (type) {
      case 'Standing Water':
        return '💧';
      case 'Trash':
        return '🗑️';
      case 'Drain':
        return '🚿';
      default:
        return '📍';
    }
  };

  const imageUrl = report.imagePath 
    ? `http://localhost:5000/${report.imagePath.replace(/\\/g, '/')}`
    : null;

  const statusConfig = getStatusConfig(report.status);
  const severityConfig = getSeverityConfig(report.severity);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image - Full Width, Image First */}
      {imageUrl && (
        <div className="relative w-full h-80 bg-gray-200">
          <img
            src={imageUrl}
            alt={`Breeding site at ${typeof report.location === 'string' ? report.location : 'specified location'}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
            }}
          />
          
          {/* Status Badge Overlay - Top Right */}
          <div className="absolute top-4 right-4">
            <span className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm bg-opacity-90`}>
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-start space-x-2 mb-3">
          <FaMapMarkerAlt className="text-red-500 text-xl mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {report.locationText || report.location?.address || 'Location not specified'}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          {report.description ? (
            <p className="text-gray-700 text-base leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
              {report.description}
            </p>
          ) : (
            <p className="text-gray-400 text-sm italic">
              No description added
            </p>
          )}
        </div>

        {/* Breeding Type & Severity Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Breeding Type */}
          <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-4 py-1.5 rounded-full text-sm font-semibold">
            {getBreedingIcon(report.breedingType)} {report.breedingType}
          </span>

          {/* Severity */}
          <span className={`${severityConfig.bg} ${severityConfig.text} ${severityConfig.border} border px-4 py-1.5 rounded-full text-sm font-semibold`}>
            ⚠️ {report.severity} Severity
          </span>

          {/* Points Badge (if awarded) */}
          {report.pointsAwarded !== undefined && report.pointsAwarded !== 0 && (
            <span className={`${report.pointsAwarded > 0 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} border px-4 py-1.5 rounded-full text-sm font-semibold`}>
              <FaAward className="inline mr-1" />
              {report.pointsAwarded > 0 ? '+' : ''}{report.pointsAwarded} pts
            </span>
          )}
        </div>

        {/* Footer - Date & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Submission Date */}
          <div className="flex items-center text-gray-500 text-sm">
            <FaCalendarAlt className="mr-2" />
            <span>{formatDate(report.date)}</span>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(report._id)}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFeedCard;
