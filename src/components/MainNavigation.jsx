import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const MainNavigation = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [categories] = useState({
    "Items Master": "/items-master", // Add paths for each category
    Processes: "/processes",
    "Bill of Materials (BoM)": "/bill-of-materials",
    "Process Steps": "/process-steps",
  });

  return (
    <div className="bg-white shadow">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              onClick={() => navigate(categories[category])} // Navigate to the path when the tab is clicked
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
