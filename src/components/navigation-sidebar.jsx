import { CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Tenant Configuration", to: "/config", completed: true },
  { name: "Items Master", to: "/items-master", completed: true },
  { name: "Processes", to: "/processes", completed: false },
  { name: "Bill of Materials", to: "/bill-of-materials", completed: false },
  { name: "Process Steps", to: "/process-steps", completed: false },
];

const quickActions = [
  { name: "Upload Bulk Data", to: "#" },
  { name: "Download Templates", to: "#" },
  { name: "View Audit Log", to: "#" },
];

export function NavigationSidebar() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the desired path
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white">
      <div className="flex flex-1 flex-col space-y-8 px-4 py-6">
        <div>
          <h2 className="text-sm font-semibold">Setup Progress</h2>
          <ul role="list" className="mt-4 space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.to)} // Trigger navigation on click
                  className={cn(
                    "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold",
                    item.completed
                      ? "bg-gray-50 text-primary"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Quick Actions</h2>
          <ul role="list" className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <li key={action.name}>
                <button
                  onClick={() => handleNavigation(action.to)} // Trigger navigation on click
                  className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  {action.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
