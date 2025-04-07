import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";
import { FaCalendarAlt, FaRegEnvelope, FaPhone, FaUser, FaStamp, FaSignature, FaUpload } from "react-icons/fa";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    dateOfBirth: new Date(),
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [stampImage, setStampImage] = useState(null);
  const [signature, setSignature] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  
  // Preview URLs for uploads
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [stampImagePreview, setStampImagePreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateSelect = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
    setCalendarVisible(false);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    
    switch (type) {
      case "profile":
        setProfileImage(file);
        setProfileImagePreview(previewUrl);
        break;
      case "stamp":
        setStampImage(file);
        setStampImagePreview(previewUrl);
        break;
      case "signature":
        setSignature(file);
        setSignaturePreview(previewUrl);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file uploads
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phoneNo", formData.phoneNo);
    data.append("dateOfBirth", formData.dateOfBirth.toISOString());
    
    if (profileImage) data.append("profileImage", profileImage);
    if (stampImage) data.append("stampImage", stampImage);
    if (signature) data.append("signature", signature);
    
    // Here you would typically send the data to your API
    console.log("Form data to submit:", {
      ...formData,
      profileImage,
      stampImage,
      signature
    });
    
    // Mock submission success
    alert("Profile form submitted successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
        <FaUser className="mr-2" /> Profile Information Form
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          
          {/* Date of Birth with Calendar Picker */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.dateOfBirth.toLocaleDateString()}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setCalendarVisible(!calendarVisible)}
                  readOnly
                />
              </div>
              {calendarVisible && (
                <div className="absolute mt-1 z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300">
                  <Calendar
                    onChange={handleDateSelect}
                    value={formData.dateOfBirth}
                    className="calendar-small"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRegEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNo">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Profile Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors duration-200">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "profile")}
              />
              <label htmlFor="profileImage" className="cursor-pointer flex flex-col items-center justify-center">
                {profileImagePreview ? (
                  <div className="relative">
                    <img 
                      src={profileImagePreview} 
                      alt="Profile Preview" 
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
                    />
                    <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full">
                      <FaUpload size={14} />
                    </div>
                  </div>
                ) : (
                  <>
                    <FaUser size={36} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload profile image</span>
                  </>
                )}
              </label>
            </div>
          </div>
          
          {/* Stamp Image Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Stamp Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors duration-200">
              <input
                type="file"
                id="stampImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "stamp")}
              />
              <label htmlFor="stampImage" className="cursor-pointer flex flex-col items-center justify-center">
                {stampImagePreview ? (
                  <div className="relative">
                    <img 
                      src={stampImagePreview} 
                      alt="Stamp Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                    />
                    <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full">
                      <FaUpload size={14} />
                    </div>
                  </div>
                ) : (
                  <>
                    <FaStamp size={36} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload stamp image</span>
                  </>
                )}
              </label>
            </div>
          </div>
          
          {/* Signature Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Signature
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors duration-200">
              <input
                type="file"
                id="signature"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "signature")}
              />
              <label htmlFor="signature" className="cursor-pointer flex flex-col items-center justify-center">
                {signaturePreview ? (
                  <div className="relative">
                    <img 
                      src={signaturePreview} 
                      alt="Signature Preview" 
                      className="w-32 h-32 object-contain mx-auto mb-2"
                    />
                    <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full">
                      <FaUpload size={14} />
                    </div>
                  </div>
                ) : (
                  <>
                    <FaSignature size={36} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload signature</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 flex items-center"
          >
            Save Profile Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 