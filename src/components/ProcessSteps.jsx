import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/solid";

const ProcessSteps = () => {
  const [processSteps, setProcessSteps] = useState([
    {
      id: 1,
      process_id: 1,
      item_id: 1,
      sequence: 1,
      conversion_ratio: 80,
      description: "First step",
    },
  ]);

  const [newStep, setNewStep] = useState({
    process_id: "",
    item_id: "",
    sequence: "",
    conversion_ratio: "",
    description: "",
  });

  const handleInputChange = (e) => {
    setNewStep({ ...newStep, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here
    setProcessSteps([
      ...processSteps,
      { id: processSteps.length + 1, ...newStep },
    ]);
    setNewStep({
      process_id: "",
      item_id: "",
      sequence: "",
      conversion_ratio: "",
      description: "",
    });
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
          <div>
            <label
              htmlFor="conversion_ratio"
              className="block text-sm font-medium text-gray-700"
            >
              Conversion Ratio
            </label>
            <input
              type="number"
              name="conversion_ratio"
              id="conversion_ratio"
              value={newStep.conversion_ratio}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Process Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={newStep.description}
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
            Add Process Step
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
                Conversion Ratio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {step.conversion_ratio}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {step.description}
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
