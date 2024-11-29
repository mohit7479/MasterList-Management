import React from "react";
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

  const navItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Items Master", icon: ClipboardListIcon, path: "/items-master" },

    { name: "Processes", icon: CogIcon, path: "/processes" },
    {
      name: "Bill of Materials",
      icon: ClipboardListIcon,
      path: "/bill-of-materials",
    },
    { name: "Process Steps", icon: ClipboardListIcon, path: "/process-steps" },
    { name: "File Handler", icon: ClipboardListIcon, path: "/file-handler" },

    { name: "Audit Log", icon: ClipboardListIcon, path: "/audit-log" },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold text-lg">
          Manufacturing Dashboard
        </span>
      </div>
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
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 bg-gray-700">
        {
          <>
            <h3 className="text-white font-semibold mb-2">Pending Setup</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <ExclamationCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Complete Items Master</span>
              </li>
            </ul>
          </>
        }
      </div>
    </div>
  );
};

export default Sidebar;
