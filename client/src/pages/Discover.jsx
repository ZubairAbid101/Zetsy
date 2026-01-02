import React, { useState } from "react";
import { Search } from "lucide-react";
import { dummyConnectionsData } from "../assets/assets.js";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import { useTheme } from "../context/AppContext";

const Discover = () => {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState("");
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setUsers([]);
      setLoading(true);

      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className={`min-h-screen ${
      !isDarkMode 
        ? "bg-gray-900" 
        : "bg-gradient-to-b from-slate-50 to-white"
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            !isDarkMode ? "text-gray-100" : "text-slate-900"
          }`}>
            Discover People
          </h1>
          <p className={!isDarkMode ? "text-gray-400" : "text-slate-600"}>
            Connect with professionals from various fields and expand your
            network.
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 shadow-md rounded-md border ${
          !isDarkMode 
            ? "border-gray-700 bg-gray-800/80" 
            : "border-slate-200/60 bg-white/80"
        }`}>
          <div className="p-6">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                !isDarkMode ? "text-gray-400" : "text-slate-400"
              }`} />
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
                type="text"
                placeholder="Search people by name, username, bio or location..."
                className={`pl-10 sm:pl-12 py-2 w-full border rounded-md max-sm:text-sm ${
                  !isDarkMode 
                    ? "border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400" 
                    : "border-gray-300 bg-white text-slate-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="flex flex-wrap gap-6">
          {users.map((user) => {
            return <UserCard key={user._id} user={user} />;
          })}
        </div>

        {loading && <Loading />}
      </div>
    </div>
  );
};

export default Discover;