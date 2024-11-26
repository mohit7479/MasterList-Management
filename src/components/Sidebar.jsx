import React from "react";
import {
  HomeIcon,
  CogIcon,
  ClipboardListIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Adjust the import based on your context location

const Sidebar = () => {
  const { state } = useAppContext();

  const navItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Items Master", icon: ClipboardListIcon, path: "/items-master" },
    {
      name: "Bill of Materials",
      icon: ClipboardListIcon,
      path: "/bill-of-materials",
    },
    { name: "Processes", icon: CogIcon, path: "/processes" },
    { name: "Process Steps", icon: ClipboardListIcon, path: "/process-steps" },
    { name: "File Handler", icon: ClipboardListIcon, path: "/file-handler" },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold text-lg">
          Manufacturing Dashboard
        </span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path} // Use 'to' for navigation with react-router
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 bg-gray-700">
        {state.user ? (
          <>
            <h3 className="text-white font-semibold mb-2">Pending Setup</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <ExclamationCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Complete Items Master</span>
              </li>
            </ul>
          </>
        ) : (
          <h3 className="text-white font-semibold">
            Please log in to view pending tasks.
          </h3>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
