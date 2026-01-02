import React from "react";
import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const MenuItems = ({ setSidebarOpen }) => {
  const {isDarkMode} = useTheme();

  return (
    <div className={`px-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} space-y-1 font-medium`}>
      {menuItemsData.map(({ to, label, Icon }) => {
        return (
          <NavLink
            key={to}
            onClick={() => setSidebarOpen(false)}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-3.5 py-2 flex items-center gap-3 rounded-xl ${
                isActive ? "bg-indigo-50 text-indigo-700" : "hover-bg-gray-50"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        );
      })}
    </div>
  );
};

export default MenuItems;
