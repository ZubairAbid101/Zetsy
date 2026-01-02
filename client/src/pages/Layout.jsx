import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { dummyUserData } from "../assets/assets.js";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import { useTheme } from "../context/AppContext.jsx";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = dummyUserData;
  const { isDarkMode } = useTheme();
  
  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}>
        <Outlet />
      </div>

      {sidebarOpen ? (
        <X
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
        />
      ) : (
        <Menu
          onClick={() => setSidebarOpen(true)}
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
