import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";

const baseUrl = "https://api-assignment.inveesync.in";

const ProcessSteps = () => {
  const [processSteps, setProcessSteps] = useState([]);
  const [editingStep, setEditingStep] = useState(null);
  const [newStep, setNewStep] = useState({
    process_id: "",
    item_id: "",
    sequence: "",
    created_by: "user3",
    last_updated_by: "user3",
    createdAt: "",
    updatedAt: "",
  });

  const fetchProcessSteps = async () => {
    try {
      const response = await axios.get(`${baseUrl}/process-step`);
      setProcessSteps(response.data);
    } catch (error) {
      console.error("Error fetching process steps:", error);
    }
  };
  // Fetch process steps
  useEffect(() => {
    fetchProcessSteps();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setNewStep({ ...newStep, [e.target.name]: e.target.value });
  };

  // Add or update a process step
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTime = new Date().toISOString();
    const stepWithTimestamps = {
      ...newStep,
      updatedAt: currentTime,
    };

    if (editingStep) {
      // Update an existing step
      try {
        await axios.put(
          `${baseUrl}/process-step/${editingStep.id}`,
          stepWithTimestamps
        );
        setProcessSteps(
          processSteps.map((step) =>
            step.id === editingStep.id
              ? { ...step, ...stepWithTimestamps }
              : step
          )
        );
        setEditingStep(null);
      } catch (error) {
        console.error(
          "Error updating process step:",
          error.response?.data || error.message
        );
      }
    } else {
      // Add a new step
      try {
        const response = await axios.post(`${baseUrl}/process-step`, {
          ...stepWithTimestamps,
          createdAt: currentTime,
        });
        setProcessSteps([...processSteps, response.data]);
      } catch (error) {
        console.error(
          "Error adding process step:",
          error.response?.data || error.message
        );
      }
    }

    // Reset form
    setNewStep({
      process_id: "",
      item_id: "",
      sequence: "",
      created_by: "user3",
      last_updated_by: "user3",
      createdAt: "",
      updatedAt: "",
    });
  };

  // Handle edit
  const handleEdit = (step) => {
    setEditingStep(step);
    setNewStep({
      process_id: step.process_id,
      item_id: step.item_id,
      sequence: step.sequence,
      created_by: step.created_by,
      last_updated_by: step.last_updated_by,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/process-step/${id}`);
      setProcessSteps(processSteps.filter((step) => step.id !== id));
    } catch (error) {
      console.error(
        "Error deleting process step:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Process Steps</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="process_id"
              className="block text-sm font-medium text-gray-700"
            >
              Process ID
            </label>
            <input
              type="number"
              name="process_id"
              id="process_id"
              value={newStep.process_id}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="item_id"
              className="block text-sm font-medium text-gray-700"
            >
              Item ID
            </label>
            <input
              type="number"
              name="item_id"
              id="item_id"
              value={newStep.item_id}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="sequence"
              className="block text-sm font-medium text-gray-700"
            >
              Sequence
            </label>
            <input
              type="number"
              name="sequence"
              id="sequence"
              value={newStep.sequence}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {editingStep ? "Update Process Step" : "Add Process Step"}
          </button>
        </div>
      </form>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Process ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sequence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processSteps.map((step) => (
              <tr key={step.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {step.process_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {step.item_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {step.sequence}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                  <button
                    onClick={() => handleEdit(step)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(step.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessSteps;
