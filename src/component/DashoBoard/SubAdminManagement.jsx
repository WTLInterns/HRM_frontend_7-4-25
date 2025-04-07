import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-custom.css";
import { FaCalendarAlt, FaRegEnvelope, FaPhone, FaUser, FaStamp, FaSignature, FaUpload, FaPen, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";

const SubAdminManagement = () => {
  const [subAdmins, setSubAdmins] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", phone: "9876543210", dateJoined: "2023-05-15", status: "active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "8765432109", dateJoined: "2023-06-22", status: "active" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "7654321098", dateJoined: "2023-07-10", status: "inactive" },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateJoined: new Date(),
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [stampImage, setStampImage] = useState(null);
  const [signature, setSignature] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  
  // Preview URLs for uploads
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [stampImagePreview, setStampImagePreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");

  // Add a new state for the edit modal and selected sub admin
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);

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
      dateJoined: date,
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
    
    // Create a new sub admin object
    const newSubAdmin = {
      id: subAdmins.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateJoined: formData.dateJoined.toISOString().split('T')[0],
      status: "active"
    };
    
    // Add to the list
    setSubAdmins([...subAdmins, newSubAdmin]);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      dateJoined: new Date(),
    });
    setProfileImage(null);
    setStampImage(null);
    setSignature(null);
    setProfileImagePreview("");
    setStampImagePreview("");
    setSignaturePreview("");
    
    // Close the form
    setShowAddForm(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredSubAdmins = subAdmins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.phone.includes(searchTerm)
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSubAdmins.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubAdmins.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sub admin?")) {
      setSubAdmins(subAdmins.filter(admin => admin.id !== id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Add handleEdit function
  const handleEdit = (admin) => {
    setSelectedSubAdmin(admin);
    // Populate the form with the selected admin's data
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      dateJoined: new Date(admin.dateJoined),
    });
    setShowEditForm(true);
  };

  // Add handleUpdate function
  const handleUpdate = (e) => {
    e.preventDefault();
    
    // Create an updated sub admin object
    const updatedSubAdmin = {
      ...selectedSubAdmin,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateJoined: formData.dateJoined.toISOString().split('T')[0],
    };
    
    // Update the item in the list
    setSubAdmins(prevAdmins => 
      prevAdmins.map(admin => 
        admin.id === selectedSubAdmin.id ? updatedSubAdmin : admin
      )
    );
    
    // Reset form and close modal
    setShowEditForm(false);
    setSelectedSubAdmin(null);
    // Reset preview images if needed - we'll keep the originals in a real implementation
    
    // Show success message
    alert("Sub Admin updated successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <MdSupervisorAccount className="mr-2 text-blue-600" size={28} /> 
          Sub Admin Management
        </h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FaPlus className="mr-2 animate-pulse" /> Add New Sub Admin
        </button>
      </div>

      {/* Add Sub Admin Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-lg transition-all duration-500 animate-fadeIn hover:border-blue-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
            <FaUser className="mr-2" /> Add New Sub Admin
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Date Fields */}
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
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-sm"
                    placeholder="Enter sub admin name"
                    required
                  />
                </div>
              </div>
              
              {/* Date Joined with Calendar Picker */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date Joined
                </label>
                <div className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.dateJoined.toLocaleDateString()}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setCalendarVisible(!calendarVisible)}
                      readOnly
                    />
                  </div>
                  {calendarVisible && (
                    <div className="absolute mt-1 z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300">
                      <Calendar
                        onChange={handleDateSelect}
                        value={formData.dateJoined}
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
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
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
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
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
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
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
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
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
            
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 hover:shadow-md"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-all duration-300 flex items-center transform hover:-translate-y-1 active:translate-y-0 hover:shadow-md"
              >
                Add Sub Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search bar and pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:shadow-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center">
          <button 
            className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gray-100 active:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <FaChevronLeft className={currentPage === 1 ? "text-gray-300" : "text-blue-600"} />
          </button>
          <span className="mx-2 text-gray-600">Page {currentPage} of {totalPages || 1}</span>
          <button 
            className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gray-100 active:bg-gray-200"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <FaChevronRight className={currentPage === totalPages || totalPages === 0 ? "text-gray-300" : "text-blue-600"} />
          </button>
        </div>
      </div>

      {/* Sub Admins Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map(admin => (
                <tr key={admin.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{admin.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(admin.dateJoined)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 ${
                      admin.status === 'active' ? 'bg-green-100 text-green-800 animate-pulse-slow' : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 transition-all duration-300 transform hover:scale-125"
                        onClick={() => handleEdit(admin)}
                      >
                        <FaPen />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 transition-all duration-300 transform hover:scale-125"
                        onClick={() => handleDelete(admin.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No sub admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && selectedSubAdmin && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
            <FaUser className="mr-2" /> Edit Sub Admin
          </h2>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Name and Date Fields */}
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
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter sub admin name"
                    required
                  />
                </div>
              </div>
              
              {/* Date Joined with Calendar Picker */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date Joined
                </label>
                <div className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.dateJoined.toLocaleDateString()}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setCalendarVisible(!calendarVisible)}
                      readOnly
                    />
                  </div>
                  {calendarVisible && (
                    <div className="absolute mt-1 z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300">
                      <Calendar
                        onChange={handleDateSelect}
                        value={formData.dateJoined}
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
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Image Uploads - Reuse the same upload components */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image Upload */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Profile Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
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
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                          <FaUpload size={14} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaUser size={36} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to update profile image</span>
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
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
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                          <FaUpload size={14} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaStamp size={36} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to update stamp image</span>
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
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
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                          <FaUpload size={14} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaSignature size={36} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to update signature</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 hover:shadow-md"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-all duration-300 flex items-center transform hover:-translate-y-1 active:translate-y-0 hover:shadow-md"
              >
                Update Sub Admin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubAdminManagement; 