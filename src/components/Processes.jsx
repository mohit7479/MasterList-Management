import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/solid";

const Processes = () => {
  const [processes, setProcesses] = useState([]);
  const [newProcess, setNewProcess] = useState({
    process_name: "",
    factory_id: "",
    tenant_id: "",
    type: "internal",
    created_by: "",
    last_updated_by: "",
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(false);

  const baseUrl = "https://api-assignment.inveesync.in";

  // Fetch processes
  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/process`);
      if (!response.ok) {
        throw new Error("Failed to fetch processes");
      }
      const data = await response.json();
      setProcesses(data);
    } catch (error) {
      console.error("Error fetching processes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setNewProcess({ ...newProcess, [e.target.name]: e.target.value });
  };

  // Add process
  const handleAddProcess = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProcess),
      });
      if (!response.ok) {
        throw new Error("Failed to add process");
      }
      const addedProcess = await response.json();
      setProcesses([...processes, addedProcess]);
      setNewProcess({
        process_name: "",
        factory_id: "",
        tenant_id: "",
        type: "internal",
        created_by: "",
        last_updated_by: "",
        createdAt: "",
        updatedAt: "",
      });
    } catch (error) {
      console.error("Error adding process:", error);
    }
  };

  // Update process
  const handleUpdateProcess = async (id, updatedData) => {
    try {
      const response = await fetch(`${baseUrl}/process/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update process");
      }
      const updatedProcess = await response.json();
      setProcesses(
        processes.map((process) =>
          process.id === id ? updatedProcess : process
        )
      );
    } catch (error) {
      console.error("Error updating process:", error);
    }
  };

  // Delete process
  const handleDeleteProcess = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/process/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete process");
      }
      const result = await response.json();
      setProcesses(processes.filter((process) => process.id !== id));
      console.log(result.message);
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Processes
      </h1>
      <form
        onSubmit={handleAddProcess}
        className="mb-6 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="process_name"
              className="block text-sm font-medium text-gray-700"
            >
              Process Name
            </label>
            <input
              type="text"
              name="process_name"
              id="process_name"
              value={newProcess.process_name}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="factory_id"
              className="block text-sm font-medium text-gray-700"
            >
              Factory ID
            </label>
            <input
              type="number"
              name="factory_id"
              id="factory_id"
              value={newProcess.factory_id}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tenant_id"
              className="block text-sm font-medium text-gray-700"
            >
              Tenant ID
            </label>
            <input
              type="number"
              name="tenant_id"
              id="tenant_id"
              value={newProcess.tenant_id}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow focus:outline-none"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-2" />
            Add Process
          </button>
        </div>
      </form>
      {loading ? (
        <p className="text-center text-gray-500">Loading processes...</p>
      ) : processes.length === 0 ? (
        <p className="text-center text-gray-500">No processes available.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg max-w-5xl mx-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Process Name",
                  "Factory ID",
                  "Tenant ID",
                  "Type",
                  "CreatedAt",
                  "UpdatedAt",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processes.map((process) => (
                <tr
                  key={process.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.process_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.factory_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.tenant_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.updatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateProcess(process.id, {
                          ...process,
                          process_name: process.name,
                        })
                      }
                      className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteProcess(process.id)}
                      className="text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Processes;
