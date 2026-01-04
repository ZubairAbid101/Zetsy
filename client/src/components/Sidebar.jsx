import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, LogOut } from "lucide-react";
import { useTheme } from '../context/AppContext';
import { UserButton, useClerk } from "@clerk/clerk-react";
import { assets, dummyUserData } from "../assets/assets.js";
import MenuItems from "./MenuItems";
import ThemeToggle from "./ThemeToggle.jsx";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = dummyUserData;
  const { signOut } = useClerk();
  const {isDarkMode} = useTheme();

  return (
    <div
      className={`w-60 xl-w-72 ${isDarkMode ? 'bg-white' : 'bg-gray-900'}  ${!isDarkMode ? "border-gray-700" : "border-gray-300"} border-r flex flex-col justify-between items-center max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:left-0 z-20 ${
        sidebarOpen ? "translate-x-0" : "max-sm:translate-x-[-100%]"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-26 ml-7 my-2 cursor-pointer"
        />
        <hr className={`mb-8 ${!isDarkMode ? "border-gray-700" : "border-gray-300"}`} />

        {/* Menu Items */}
        <MenuItems setSidebarOpen={setSidebarOpen} />

        {/* Create Post */}
        <Link
          to="/create-post"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* User Information */}
      <div className={`w-full border-t ${!isDarkMode ? "border-gray-700" : "border-gray-300"} p-4 px-7 flex items-center justify-between`}>
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />

          <div>
            <h1 className={`text-sm font-medium ${!isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{user.full_name}</h1>
            <p className={`text-xs ${!isDarkMode ? "text-gray-400" : "text-gray-500"}`}>@{user.username}</p>
          </div>
        </div>

        <ThemeToggle />

        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
