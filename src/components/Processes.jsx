import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../context/AppContext";

const Processes = () => {
  const { state, dispatch } = useAppContext();
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

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/process`);
      if (!response.ok) {
        throw new Error("Failed to fetch processes");
      }
      const data = await response.json();
      setProcesses(data);
      // toast.success("Processes loaded successfully!");
    } catch (error) {
      console.error("Error fetching processes:", error);
      toast.error("Error loading processes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleInputChange = (e) => {
    setNewProcess({ ...newProcess, [e.target.name]: e.target.value });
  };

  const logAction = (actionType, processDetails) => {
    const logEntry = {
      timestamp: new Date().toLocaleString(),
      user: state.user ? state.user.name : "Guest",
      action: actionType,
      details: processDetails,
    };

    dispatch({
      type: "ADD_LOG",
      payload: logEntry,
    });
  };

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

      logAction("Created", `Added new process: ${addedProcess.process_name}`);
      toast.success("Process added successfully!");
    } catch (error) {
      console.error("Error adding process:", error);
      toast.error("Failed to add process.");
    }
  };

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

      logAction("Updated", `Updated process: ${updatedProcess.process_name}`);
      toast.success("Process updated successfully!");
    } catch (error) {
      console.error("Error updating process:", error);
      toast.error("Failed to update process.");
    }
  };

  const handleDeleteProcess = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/process/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete process");
      }

      setProcesses(processes.filter((process) => process.id !== id));

      const deletedProcess = processes.find((process) => process.id === id);
      logAction("Deleted", `Deleted process: ${deletedProcess.process_name}`);
      toast.success("Process deleted successfully!");
    } catch (error) {
      console.error("Error deleting process:", error);
      toast.error("Failed to delete process.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(process.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(process.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() =>
                        handleUpdateProcess(process.id, { ...process })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteProcess(process.id)}
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
