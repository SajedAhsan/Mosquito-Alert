import React from 'react';

/**
 * Skeleton Card - Loading placeholder
 * Animated placeholder while reports are being fetched
 */
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-80 bg-gray-300"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Location Skeleton */}
        <div className="flex items-start space-x-2 mb-3">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        {/* Badges Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-8 bg-gray-300 rounded-full w-32"></div>
          <div className="h-8 bg-gray-300 rounded-full w-28"></div>
          <div className="h-8 bg-gray-300 rounded-full w-24"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
