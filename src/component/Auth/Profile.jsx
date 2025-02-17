import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";

const Profile = () => {
  const { user, logoutUser, fetchUserProfile } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserProfile();
    console.log(user);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-700 to-blue-500">
        <div className="text-white text-lg">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto max-w-5xl p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Profile Header */}
          <div className="flex items-center justify-center flex-col mb-10">
            <div className="w-24 h-24 mb-4 overflow-hidden rounded-full border-4 border-purple-200">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 text-lg">{user.role}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <MdEmail className="text-purple-600 text-xl" />
              <p className="text-gray-700 text-lg">{user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <HiOutlineUserGroup className="text-purple-600 text-xl" />
              <p className="text-gray-700 text-lg">{user.role}</p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
