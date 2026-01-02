import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, MessageSquare } from "lucide-react";
import { dummyConnectionsData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const Messages = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen relative ${
        !isDarkMode ? "bg-gray-900" : "bg-slate-50"
      }`}
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              !isDarkMode ? "text-gray-100" : "text-slate-900"
            }`}
          >
            Messages
          </h1>
          <p className={!isDarkMode ? "text-gray-400" : "text-slate-600"}>
            Connect with your friends and family through messages.
          </p>
        </div>

        {/* Connected Users */}
        <div className="flex flex-col gap-3">
          {dummyConnectionsData.map((user) => {
            return (
              <div
                key={user._id}
                className={`max-w-xl flex flex-warp gap-5 p-6 shadow rounded-md ${
                  !isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Connection Details */}
                <img
                  src={user.profile_picture}
                  alt="Profile Picture"
                  className="rounded-full size-12 mx-auto"
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      !isDarkMode ? "text-gray-200" : "text-slate-700"
                    }`}
                  >
                    {user.full_name}
                  </p>
                  <p
                    className={!isDarkMode ? "text-gray-400" : "text-slate-500"}
                  >
                    {user.username}
                  </p>
                  <p
                    className={`text-sm ${
                      !isDarkMode ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    {user.bio}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  {/* Message Button */}
                  <button
                    onClick={() => navigate(`/messages/${user._id})`)}
                    className={`size-10 flex items-center justify-center text-sm rounded active:scale-95 transition cursor-pointer gap-1 ${
                      !isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>

                  {/* View Profile Button */}
                  <button
                    onClick={() => navigate(`/profile/${user._id})`)}
                    className={`size-10 flex items-center justify-center text-sm rounded active:scale-95 transition cursor-pointer gap-1 ${
                      !isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
