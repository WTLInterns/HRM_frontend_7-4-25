import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave, FaTimes, FaCheckCircle } from "react-icons/fa";
import "../DashoBoard/animations.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Master Admin",
    email: "admin@example.com",
    phone: "123-456-7890",
    organization: "HRM System",
    role: "Master Administrator"
  });
  const [formData, setFormData] = useState({ ...userData });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setFormData({ ...userData });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save changes
    setUserData({ ...formData });
    setIsEditing(false);
    
    // Show success modal instead of alert
    setShowSuccessModal(true);
    
    // Auto-hide the success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  return (
    <div className="p-6 bg-slate-800/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-700 animate-fadeIn text-gray-100">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-slate-800 rounded-lg shadow-xl border border-green-600 w-full max-w-md p-6 z-10 animate-scaleIn transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg animate-pulse-slow">
                <FaCheckCircle className="text-white text-3xl" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">Success!</h3>
              <p className="text-green-300">Profile updated successfully!</p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md shadow-md transition-all duration-300 flex items-center justify-center"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-900/50 rounded-full text-blue-400">
            <FaUser className="text-xl md:text-2xl" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">Profile Information</h2>
        </div>
        
        <button
          onClick={handleEditToggle}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 ${
            isEditing 
              ? "bg-red-900/70 text-red-200 hover:bg-red-800"
              : "bg-blue-900/70 text-blue-200 hover:bg-blue-800"
          }`}
        >
          {isEditing ? (
            <>
              <FaTimes size={16} />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <FaEdit size={16} />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-blue-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 transition-all duration-300 ${
                  isEditing 
                    ? "bg-slate-700 border border-slate-600 text-gray-100" 
                    : "bg-slate-800 border border-slate-700 text-gray-300 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-blue-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 transition-all duration-300 ${
                  isEditing 
                    ? "bg-slate-700 border border-slate-600 text-gray-100" 
                    : "bg-slate-800 border border-slate-700 text-gray-300 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
          
          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-blue-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 transition-all duration-300 ${
                  isEditing 
                    ? "bg-slate-700 border border-slate-600 text-gray-100" 
                    : "bg-slate-800 border border-slate-700 text-gray-300 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
          
          {/* Organization */}
          <div className="space-y-2">
            <label htmlFor="organization" className="block text-sm font-medium text-gray-300">
              Organization
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-blue-400" />
              </div>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3 transition-all duration-300 ${
                  isEditing 
                    ? "bg-slate-700 border border-slate-600 text-gray-100" 
                    : "bg-slate-800 border border-slate-700 text-gray-300 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-md shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <FaSave size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile; 