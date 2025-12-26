import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { FaCloudUploadAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';
import LocationPicker from '../components/LocationPicker';

/**
 * Create Report Form Component
 * Facebook-style image upload with instant preview
 */
const CreateReport = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    locationText: '',
    breedingType: '',
    severity: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { locationText, breedingType, severity } = formData;
  const [selectedCoords, setSelectedCoords] = useState(null);

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
   * Handle file processing
   */
  const handleFile = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        setError('Only JPG, JPEG, and PNG images are allowed');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImage(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove selected image
   */
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
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

    // Validation
    if (!selectedCoords || !breedingType || !severity) {
      setError('Please choose a location on the map and fill other fields');
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
    }
    // Attach optional textual location description
    if (locationText && locationText.trim() !== '') {
      reportData.append('locationText', locationText.trim());
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

      setSuccess(`Report created successfully! You earned ${data.pointsEarned} points.`);
      
      // Update user points
      updateUser({ points: user.points + data.pointsEarned });

      // Reset form
          setFormData({ locationText: '', breedingType: '', severity: '' });
      setImage(null);
      setImagePreview(null);
          setSelectedCoords(null);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Report Mosquito Breeding Site
        </h2>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaCheckCircle className="mr-2" />
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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
              Location (pick on map) <span className="text-red-500">*</span>
            </label>
            <LocationPicker onLocationSelect={setSelectedCoords} />

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
                  Selected coordinates: Lat {selectedCoords.lat.toFixed(6)}, Lng {selectedCoords.lng.toFixed(6)}
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
