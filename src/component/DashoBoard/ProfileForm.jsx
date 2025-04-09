import React, { useState } from "react";
import { FaCalendarAlt, FaRegEnvelope, FaPhone, FaUser, FaStamp, FaSignature, FaEdit, FaSave, FaTimes, FaCheck, FaIdCard, FaBriefcase, FaBuilding, FaUserTie } from "react-icons/fa";

const ProfileForm = () => {
  // Mock admin data (in a real app, this would come from API/context)
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@wtlhrm.com",
    phoneNo: "+91 9876543210",
    companyName: "WTL Technologies",
  });
  
  const [editMode, setEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tempData, setTempData] = useState({...profileData});
  
  // Images
  const [companyLogo, setCompanyLogo] = useState("/image/admin-profile.jpg");
  const [stampImage, setStampImage] = useState("");
  const [signature, setSignature] = useState("");
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({
      ...tempData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setTempData({...profileData});
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = () => {
    setProfileData({...tempData});
    setEditMode(false);
    setShowSuccessModal(true);
    
    // Hide success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    
    switch(type) {
      case 'logo':
        setCompanyLogo(previewUrl);
        break;
      case 'stamp':
        setStampImage(previewUrl);
        break;
      case 'signature':
        setSignature(previewUrl);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-slate-800 text-white rounded-lg shadow-xl p-6 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center">
          <FaUser className="mr-2" /> Profile Information
        </h2>
        
        {/* Edit/Save Buttons */}
        <div>
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="bg-slate-700 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <FaIdCard /> Personal Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">First Name</p>
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  {editMode ? (
                    <input
                      type="text"
                      name="firstName"
                      value={tempData.firstName}
                      onChange={handleInputChange}
                      className="bg-slate-800 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-white">{profileData.firstName}</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Last Name</p>
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  {editMode ? (
                    <input
                      type="text"
                      name="lastName"
                      value={tempData.lastName}
                      onChange={handleInputChange}
                      className="bg-slate-800 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-white">{profileData.lastName}</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <FaRegEnvelope className="text-blue-400" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={tempData.email}
                      onChange={handleInputChange}
                      className="bg-slate-800 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-white">{profileData.email}</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-400" />
                  {editMode ? (
                    <input
                      type="text"
                      name="phoneNo"
                      value={tempData.phoneNo}
                      onChange={handleInputChange}
                      className="bg-slate-800 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-white">{profileData.phoneNo}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Information */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <FaBuilding /> Company Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Company Name</p>
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-blue-400" />
                  {editMode ? (
                    <input
                      type="text"
                      name="companyName"
                      value={tempData.companyName}
                      onChange={handleInputChange}
                      className="bg-slate-800 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-white">{profileData.companyName}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Images Section */}
      <div className="bg-slate-700 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <FaIdCard /> Images & Signature
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company Logo */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Company Logo</p>
            <div className="relative bg-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-slate-600 p-4 h-48">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="max-h-40 max-w-full object-contain"
                  onError={(e) => {e.target.src = "/image/lap2.jpg"}}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FaBuilding size={32} className="mx-auto mb-2" />
                  <p>No logo uploaded</p>
                </div>
              )}
              
              {editMode && (
                <div className="absolute bottom-2 right-2">
                  <input
                    type="file"
                    id="companyLogoUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                  />
                  <label 
                    htmlFor="companyLogoUpload" 
                    className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300"
                  >
                    <FaEdit />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          {/* Stamp Image */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Stamp Image</p>
            <div className="relative bg-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-slate-600 p-4 h-48">
              {stampImage ? (
                <img 
                  src={stampImage} 
                  alt="Stamp" 
                  className="max-h-40 max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FaStamp size={32} className="mx-auto mb-2" />
                  <p>No stamp uploaded</p>
                </div>
              )}
              
              {editMode && (
                <div className="absolute bottom-2 right-2">
                  <input
                    type="file"
                    id="stampImageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'stamp')}
                  />
                  <label 
                    htmlFor="stampImageUpload" 
                    className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300"
                  >
                    <FaEdit />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          {/* Signature */}
          <div>
            <p className="text-gray-400 text-sm mb-2">Signature</p>
            <div className="relative bg-slate-800 rounded-lg overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-slate-600 p-4 h-48">
              {signature ? (
                <img 
                  src={signature} 
                  alt="Signature" 
                  className="max-h-40 max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FaSignature size={32} className="mx-auto mb-2" />
                  <p>No signature uploaded</p>
                </div>
              )}
              
              {editMode && (
                <div className="absolute bottom-2 right-2">
                  <input
                    type="file"
                    id="signatureUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'signature')}
                  />
                  <label 
                    htmlFor="signatureUpload" 
                    className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all duration-300"
                  >
                    <FaEdit />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit/Save Buttons - visible on mobile */}
      <div className="md:hidden flex justify-center mt-6">
        {editMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300"
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="bg-slate-800 border border-blue-600 rounded-lg shadow-2xl p-6 z-10 w-full max-w-md mx-4 transform transition-all animate-scaleIn">
            <div className="flex items-center gap-3 text-green-500 mb-4">
              <div className="bg-green-500 rounded-full p-2 text-white">
                <FaCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Success</h3>
            </div>
            <p className="text-gray-300 mb-6">Profile information updated successfully!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm; 