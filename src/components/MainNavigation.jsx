import React from "react";
import { Tab } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map categories to their routes
  const categories = {
    "Items Master": "/items-master",
    Processes: "/processes",
    "Bill of Materials (BoM)": "/bill-of-materials",
    "Process Steps": "/process-steps",
  };

  // Determine the active tab based on the current route
  const activeIndex = Object.values(categories).indexOf(location.pathname);

  return (
    <div className="bg-white shadow">
      <Tab.Group
        selectedIndex={activeIndex} // Synchronize with the route
        onChange={(index) => {
          const path = Object.values(categories)[index];
          if (path) navigate(path); // Navigate to the corresponding route on tab change
        }}
      >
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-blue-700 rounded-lg
                 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                 ${
                   selected
                     ? "bg-white shadow"
                     : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                 }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default MainNavigation;
