import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/solid";

const BillOfMaterials = () => {
  const [boms, setBoms] = useState([
    { id: 1, item_id: 1, component_id: 2, quantity: 5 },
  ]);

  const [newBom, setNewBom] = useState({
    item_id: "",
    component_id: "",
    quantity: "",
  });

  const handleInputChange = (e) => {
    setNewBom({ ...newBom, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here
    setBoms([...boms, { id: boms.length + 1, ...newBom }]);
    setNewBom({ item_id: "", component_id: "", quantity: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bill of Materials</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              value={newBom.item_id}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="component_id"
              className="block text-sm font-medium text-gray-700"
            >
              Component ID
            </label>
            <input
              type="number"
              name="component_id"
              id="component_id"
              value={newBom.component_id}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={newBom.quantity}
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
            Add BoM Entry
          </button>
        </div>
      </form>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Component ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {boms.map((bom) => (
              <tr key={bom.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bom.item_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bom.component_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bom.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillOfMaterials;
