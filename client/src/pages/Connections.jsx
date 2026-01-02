import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";
import {
  dummyConnectionsData,
  dummyFollowersData,
  dummyFollowingData,
  dummyPendingConnectionsData,
} from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const Connections = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("Followers");

  const dataArray = [
    {
      label: "Followers",
      value: dummyFollowersData,
      icon: Users,
    },

    {
      label: "Following",
      value: dummyFollowingData,
      icon: UserCheck,
    },

    {
      label: "Pending",
      value: dummyPendingConnectionsData,
      icon: UserRoundPen,
    },

    {
      label: "Connections",
      value: dummyConnectionsData,
      icon: UserPlus,
    },
  ];

  return (
    <div className={`min-h-screen ${
      !isDarkMode ? "bg-gray-900" : "bg-slate-50"
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            !isDarkMode ? "text-gray-100" : "text-slate-900"
          }`}>
            Connections
          </h1>
          <p className={!isDarkMode ? "text-gray-400" : "text-slate-600"}>
            Manage your connections and grow your network.
          </p>
        </div>

        {/* Counts */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center gap-1 border h-20 w-40 shadow rounded-md ${
                  !isDarkMode 
                    ? "border-gray-700 bg-gray-800 text-gray-100" 
                    : "border-gray-200 bg-white text-slate-900"
                }`}
              >
                <b>{item.value.length}</b>
                <p className={!isDarkMode ? "text-gray-400" : "text-slate-600"}>
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className={`inline-flex flex-wrap items-center justify-center border rounded-md p-1 shadow-sm ${
          !isDarkMode 
            ? "border-gray-700 bg-gray-800" 
            : "border-gray-200 bg-white"
        }`}>
          {dataArray.map((tab) => {
            return (
              <button
                key={tab.label}
                onClick={() => setCurrentTab(tab.label)}
                className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                  currentTab === tab.label
                    ? !isDarkMode 
                      ? "bg-gray-700 font-medium text-gray-100" 
                      : "bg-white font-medium text-black"
                    : !isDarkMode 
                      ? "text-gray-400 hover:text-gray-100" 
                      : "text-gray-500 hover:text-black"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="ml-1">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    !isDarkMode 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Connections */}
        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.label === currentTab)
            .value.map((user) => {
              return (
                <div
                  key={user._id}
                  className={`w-full max-w-88 flex gap-5 p-6 shadow rounded-md ${
                    !isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Connection Details */}
                  <img
                    src={user.profile_picture}
                    alt="Profile Picture"
                    className="rounded-full w-12 h-12 shadow-md mx-auto"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${
                      !isDarkMode ? "text-gray-200" : "text-slate-700"
                    }`}>
                      {user.full_name}
                    </p>
                    <p className={!isDarkMode ? "text-gray-400" : "text-slate-500"}>
                      @{user.username}
                    </p>
                    <p className={`text-sm ${
                      !isDarkMode ? "text-gray-500" : "text-gray-600"
                    }`}>
                      {user.bio.slice(0, 30)}...
                    </p>

                    <div className="flex max-sm:flex-col gap-2 mt-4">
                      {/* Action Buttons */}
                      {
                        <button
                          onClick={() => navigate(`/profile/${user._id}`)}
                          className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
                        >
                          View Profile
                        </button>
                      }

                      {currentTab == "Following" && (
                        <button className={`w-full p-2 text-sm rounded active:scale-95 transition cursor-pointer ${
                          !isDarkMode 
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                            : "bg-slate-100 hover:bg-slate-200 text-black"
                        }`}>
                          Unfollow
                        </button>
                      )}

                      {currentTab == "Pending" && (
                        <button className={`w-full p-2 text-sm rounded active:scale-95 transition cursor-pointer ${
                          !isDarkMode 
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                            : "bg-slate-100 hover:bg-slate-200 text-black"
                        }`}>
                          Accept
                        </button>
                      )}

                      {currentTab == "Connections" && (
                        <button
                          onClick={() => navigate(`/messages/${user._id}`)}
                          className={`w-full p-2 text-sm rounded active:scale-95 transition cursor-pointer flex items-center justify-center gap-1 ${
                            !isDarkMode 
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                              : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Connections;