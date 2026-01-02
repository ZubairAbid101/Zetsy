import React from "react";
import { CalendarHeart, MapPin, PenBox, Verified } from "lucide-react";
import moment from "moment";
import { useTheme } from "../context/AppContext";

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative py-4 px-6 md:px-8 ${
        !isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Profile Photo */}
        <div
          className={`w-32 h-32 border-4 shadow-lg absolute -top-16 rounded-full ${
            !isDarkMode ? "border-gray-800" : "border-white"
          }`}
        >
          <img
            src={user.profile_picture}
            alt="User Profile Picture"
            className="absolute rounded-full z-2"
          />
        </div>

        <div className="w-full pt-16 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              {/* Full Name and Verified Icon */}
              <div className="flex items-center gap-3">
                <h1
                  className={`text-2xl font-bold ${
                    !isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {user.full_name}
                </h1>
                <Verified className="w-6 h-6 text-blue-500" />
              </div>
              {/* Username */}
              <p className={!isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {user.username ? `@${user.username}` : "Add a username"}
              </p>
            </div>

            {/* Edit Button */}
            {!profileId && (
              <button
                onClick={() => {
                  setShowEdit(true);
                }}
                className={`flex items-center gap-2 border px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 cursor-pointer ${
                  !isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 text-gray-200"
                    : "border-gray-300 hover:bg-gray-50 text-gray-900"
                }`}
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* User Bio */}
          <p
            className={`text-sm max-w-md mt-4 ${
              !isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {user.bio}
          </p>

          {/* Location and Join Date */}
          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mt-4 ${
              !isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user.location ? user.location : "Add location"}
            </span>

            <span className="flex items-center gap-1.5">
              <CalendarHeart className="w-4 h-4" />
              Joined{" "}
              <span className="font-medium">
                {moment(user.createdAt).format("MMMM YYYY")}
              </span>
            </span>
          </div>

          {/* Profile Metrics */}
          <div
            className={`flex items-center gap-6 mt-6 border-t pt-4 ${
              !isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Post Count */}
            <div>
              <span
                className={`sm:text-xl font-bold ${
                  !isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {posts.length}
              </span>
              <span
                className={`text-xs sm:text-sm ml-1.5 ${
                  !isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Posts
              </span>
            </div>

            {/* Followers Count */}
            <div>
              <span
                className={`sm:text-xl font-bold ${
                  !isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {user.followers.length}
              </span>
              <span
                className={`text-xs sm:text-sm ml-1.5 ${
                  !isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Followers
              </span>
            </div>

            {/* Following Count */}
            <div>
              <span
                className={`sm:text-xl font-bold ${
                  !isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {user.following.length}
              </span>
              <span
                className={`text-xs sm:text-sm ml-1.5 ${
                  !isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
