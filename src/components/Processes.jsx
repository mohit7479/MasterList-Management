import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import { useAppContext } from "../context/AppContext";

const Processes = () => {
  const { state, dispatch } = useAppContext();
  const [newProcess, setNewProcess] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    setNewProcess({ ...newProcess, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProcess.name && newProcess.description) {
      dispatch({
        type: "ADD_PROCESS",
        payload: {
          id: state.processes.length + 1,
          ...newProcess,
        },
      });
      setNewProcess({ name: "", description: "" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Processes</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Process Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={newProcess.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={newProcess.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Process
          </button>
        </div>
      </form>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.processes.map((process) => (
              <tr key={process.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {process.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {process.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Processes;
