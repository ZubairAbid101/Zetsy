import React from "react";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import { dummyUserData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const UserCard = ({ user }) => {
  const { isDarkMode } = useTheme();
  const currentUser = dummyUserData;

  const handleFollow = async () => {};

  const handleConnectionRequest = async () => {};

  return (
    <div
      key={user._id}
      className={`p-4 pt-6 flex flex-col justify-between w-72 shadow border rounded-md ${
        !isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      }`}
    >
      {/* User Information */}
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt="Profile Picture"
          className="rounded-full w-16 shadow-md mx-auto"
        />
        <p className={`mt-4 font-semibold ${
          !isDarkMode ? "text-gray-100" : "text-slate-900"
        }`}>
          {user.full_name}
        </p>
        {user.username && (
          <p className={`font-light ${
            !isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            @{user.username}
          </p>
        )}
        {user.bio && (
          <p className={`mt-2 text-center text-sm px-4 ${
            !isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            {user.bio}
          </p>
        )}
      </div>

      {/* User Location and Followers */}
      <div className={`flex items-center justify-center gap-2 mt-4 text-xs ${
        !isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}>
        {/* Location */}
        <div className={`flex items-center gap-1 border rounded-full px-3 py-1 ${
          !isDarkMode ? "border-gray-600" : "border-gray-300"
        }`}>
          <MapPin className="w-4 h-4" />
          {user.location}
        </div>

        {/* Followers */}
        <div className={`flex items-center gap-1 border rounded-full px-3 py-1 ${
          !isDarkMode ? "border-gray-600" : "border-gray-300"
        }`}>
          <span>{user.followers.length}</span>Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className="w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
        </button>

        {/* Connection Button */}
        <button
          onClick={handleConnectionRequest}
          className={`flex items-center justify-center w-16 border group rounded-md cursor-pointer active:scale-95 transition ${
            !isDarkMode 
              ? "border-gray-600 text-gray-400 hover:border-gray-500" 
              : "border-gray-300 text-slate-500 hover:border-gray-400"
          }`}
        >
          {currentUser?.connections.includes(user._id) ? (
            <MessageCircle className="w-5 h-5 group-hover:scale-105 transition" />
          ) : (
            <Plus className="w-5 h-5 group-hover:scale-105 transition" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;