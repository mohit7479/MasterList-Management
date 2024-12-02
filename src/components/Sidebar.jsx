import React, { useState } from "react";
import {
  HomeIcon,
  CogIcon,
  ClipboardListIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Sidebar = () => {
  const { state } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar

  const navItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Items Master", icon: ClipboardListIcon, path: "/items-master" },
    {
      name: "Bill of Materials",
      icon: ClipboardListIcon,
      path: "/bill-of-materials",
    },
    { name: "File Handler", icon: ClipboardListIcon, path: "/file-handler" },
    { name: "Audit Log", icon: ClipboardListIcon, path: "/audit-log" },
  ];

  return (
    <div
      className={`flex flex-col bg-gray-800 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-0 md:w-64"
      } md:w-64`} // Sidebar width for small and large screens
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
        <span
          className={`text-white font-bold text-lg ${
            isSidebarOpen ? "" : "hidden"
          }`}
        >
          Manufacturing Dashboard
        </span>
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white lg:hidden"
        >
          {isSidebarOpen ? "<<" : ">>"}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 bg-gray-800">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <item.icon className="mr-4 h-6 w-6" />
            <span className={`${isSidebarOpen ? "" : "hidden"}`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Pending Setup */}
      <div className="p-4 bg-gray-700">
        <h3
          className={`text-white font-semibold mb-2 ${
            isSidebarOpen ? "" : "hidden"
          }`}
        >
          Pending Setup
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center text-gray-300">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />
            <span className={`${isSidebarOpen ? "" : "hidden"}`}>
              Complete Items Master
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
