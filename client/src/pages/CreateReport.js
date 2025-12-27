import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { FaCloudUploadAlt, FaTimes, FaCheckCircle, FaRobot } from 'react-icons/fa';
import LocationPicker from '../components/LocationPicker';

/**
 * Create Report Form Component
 * Facebook-style image upload with instant preview + AI validation
 */
const CreateReport = () => {
  const navigate = useNavigate();
  const { user, updateUser, refreshUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    locationText: '',
    description: '',
    breedingType: '',
    severity: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiValidating, setAiValidating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const { locationText, description, breedingType, severity } = formData;
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [locationInput, setLocationInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle image selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  /**
   * Real AI Validation using Roboflow Workflow
   */
  const validateImageWithAI = async (file) => {
    setAiValidating(true);
    setAiResult(null);

    try {
      // Create FormData to send image to backend
      const formData = new FormData();
      formData.append('image', file);

      // Call backend AI validation endpoint
      const { data } = await API.post('/ai/validate-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 35000 // 35 second timeout
      });

      setAiValidating(false);
      setAiResult(data);

      return data;

    } catch (error) {
      console.error('AI Validation Error:', error);
      setAiValidating(false);

      // Fallback if AI service fails - reject image
      const fallbackResult = {
        isValid: false,
        confidence: 0,
        verdict: 'ERROR',
        reasoning: [
          '❌ AI validation failed',
          '⚠️ Service temporarily unavailable',
          '💡 Please try again or contact support'
        ],
        fallback: true
      };

      setAiResult(fallbackResult);
      return fallbackResult;
    }
  };

  /**
   * Handle file processing with AI validation
   */
  const handleFile = async (file) => {
    if (file) {
      // Validate file type
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        setError('Only JPG, JPEG, and PNG images are allowed');
        setSuccess('');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        setSuccess('');
        return;
      }

      // Create preview first
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Run AI validation
      setError('');
      setSuccess('🤖 AI is analyzing your image...');

      const aiValidation = await validateImageWithAI(file);

      if (aiValidation.isValid) {
        setImage(file);
        setSuccess('✅ Photo validated successfully! This appears to be a valid mosquito breeding site.');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        // Reject the image
        setImagePreview(null);
        setImage(null);
        setError('❌ AI Validation Failed: This image does not appear to show a mosquito breeding site. Please upload a valid photo showing standing water, containers, or drainage areas.');
        setTimeout(() => {
          setError('');
          setAiResult(null);
        }, 8000);
      }
    }
  };

  /**
   * Remove selected image
   */
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setAiResult(null);
  };

  /**
   * Drag and drop handlers
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  /**
   * Submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation - allow if either coords are set OR locationInput has value
    if ((!selectedCoords && !locationInput.trim()) || !breedingType || !severity) {
      setError('Please enter a location and fill all required fields');
      return;
    }

    if (!image) {
      setError('Image is required! Please upload an image.');
      return;
    }

    // Prepare form data
    const reportData = new FormData();
    // Attach coordinates as a JSON string so server can parse an object
    if (selectedCoords) {
      reportData.append('location', JSON.stringify(selectedCoords));
    } else if (locationInput.trim()) {
      // If no coords but have location text, use a default coordinate with location text
      reportData.append('location', JSON.stringify({ lat: 0, lng: 0, address: locationInput.trim() }));
    }
    // Attach optional textual location description
    if (locationText && locationText.trim() !== '') {
      reportData.append('locationText', locationText.trim());
    } else if (locationInput && locationInput.trim() !== '') {
      reportData.append('locationText', locationInput.trim());
    }
    // Attach optional description
    if (description && description.trim() !== '') {
      reportData.append('description', description.trim());
    }
    reportData.append('breedingType', breedingType);
    reportData.append('severity', severity);
    reportData.append('image', image);

    setLoading(true);

    try {
      const { data } = await API.post('/reports', reportData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setEarnedPoints(data.pointsEarned || 10);
      setShowSuccessModal(true);
      
      // Refresh user points from server
      await refreshUser();

      // Reset form
          setFormData({ locationText: '', description: '', breedingType: '', severity: '' });
      setImage(null);
      setImagePreview(null);
          setSelectedCoords(null);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Animated Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-scaleIn">
            {/* Animated Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Circle animation */}
                <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center animate-drawCircle">
                  {/* Checkmark animation */}
                  <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      className="animate-drawCheck" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="3" 
                      d="M5 13l4 4L19 7"
                      strokeDasharray="30"
                      strokeDashoffset="30"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
              Report Created Successfully!
            </h3>
            
            {/* Points Earned */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
              <p className="text-center text-green-700 font-semibold text-lg">
                🎉 You earned <span className="text-2xl font-bold text-green-600">{earnedPoints}</span> points!
              </p>
            </div>

            {/* Redirecting message */}
            <p className="text-gray-500 text-center text-sm">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Report Mosquito Breeding Site
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* AI Validation Result */}
        {aiResult && !aiValidating && (
          <div className={`${aiResult.isValid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} border rounded-lg p-4 mb-4`}>
            <div className="flex items-start">
              <FaRobot className={`text-2xl ${aiResult.isValid ? 'text-green-600' : 'text-red-600'} mr-3 mt-1`} />
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${aiResult.isValid ? 'text-green-800' : 'text-red-800'} mb-2`}>
                  🤖 AI Validation: {aiResult.verdict} {aiResult.confidence > 0 && `(${aiResult.confidence}% confidence)`}
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {aiResult.reasoning.map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
                {aiResult.fallback && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    * AI service was unavailable. Image will be manually reviewed by admin.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {aiValidating && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <FaRobot className="text-2xl text-blue-600 mr-3 animate-pulse" />
              <div>
                <h3 className="font-bold text-blue-800">🔍 AI is analyzing your image...</h3>
                <p className="text-sm text-blue-600">This may take a few seconds</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section - Facebook Style */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Upload Image <span className="text-red-500">*</span>
            </label>

            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition duration-300"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              /* Drag & Drop Area */
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition duration-300 cursor-pointer ${
                  dragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaCloudUploadAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Drag & Drop your image here
                  </p>
                  <p className="text-sm text-gray-500 mb-2">or</p>
                  <span className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg inline-block transition duration-300">
                    Click to Upload
                  </span>
                  <p className="text-xs text-gray-400 mt-4">
                    JPG, JPEG, PNG (Max 5MB)
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Location Picker + optional text */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <LocationPicker 
              onLocationSelect={(coords, inputValue) => {
                setSelectedCoords(coords);
                if (inputValue !== undefined) {
                  setLocationInput(inputValue);
                }
              }} 
            />

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Location description (optional)
              </label>
              <input
                type="text"
                name="locationText"
                value={locationText}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Park Street, Downtown"
              />
              {selectedCoords && (
                <div className="text-sm text-gray-600 mt-2">
                  ✓ Coordinates: Lat {selectedCoords.lat.toFixed(6)}, Lng {selectedCoords.lng.toFixed(6)}
                </div>
              )}
              {!selectedCoords && locationInput && (
                <div className="text-sm text-blue-600 mt-2">
                  ✓ Location: {locationInput}
                </div>
              )}
            </div>
          </div>

          {/* Breeding Type Select */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Breeding Type <span className="text-red-500">*</span>
            </label>
            <select
              name="breedingType"
              value={breedingType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select breeding type</option>
              <option value="Standing Water">Standing Water</option>
              <option value="Trash">Trash</option>
              <option value="Drain">Drain</option>
            </select>
          </div>

          {/* Severity Select */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Severity <span className="text-red-500">*</span>
            </label>
            <select
              name="severity"
              value={severity}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select severity level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Add any additional details about the breeding site..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting Report...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
