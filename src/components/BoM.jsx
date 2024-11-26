import React, { useState, useEffect } from "react";
import axios from "axios";

const BoM = () => {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = " https://api-assignment.inveesync.in//bom"; // Replace with your API endpoint

  // Fetch initial data from the server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setFormData(
        response.data.map((row) => ({ ...row, error: validateRow(row) }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate a row
  const validateRow = (row) => {
    if (!row.item_id || !row.component_id || !row.quantity) {
      return "All mandatory fields must be filled.";
    }
    if (row.quantity && !Number.isInteger(Number(row.quantity))) {
      return "Quantity must be an integer for BothNos UoM.";
    }
    return "";
  };

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    updatedFormData[index].error = validateRow(updatedFormData[index]);
    setFormData(updatedFormData);
  };

  // Add a new row
  const addRow = async () => {
    const newRow = { item_id: "", component_id: "", quantity: "", error: "" };
    try {
      const response = await axios.post(API_URL, newRow);
      setFormData([...formData, { ...response.data, error: "" }]);
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  // Update a row
  const updateRow = async (index) => {
    const rowToUpdate = formData[index];
    if (rowToUpdate.error) {
      alert("Please fix errors before updating.");
      return;
    }
    try {
      await axios.put(`${API_URL}/${rowToUpdate.id}`, rowToUpdate);
      alert("Row updated successfully!");
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

  // Remove a row
  const removeRow = async (index) => {
    const rowToDelete = formData[index];
    try {
      await axios.delete(`${API_URL}/${rowToDelete.id}`);
      setFormData(formData.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Bill of Materials</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300 bg-white shadow-sm rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Item ID</th>
              <th className="p-2 border">Component ID</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Error</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((row, index) => (
              <tr key={index}>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={row.item_id}
                    onChange={(e) =>
                      handleInputChange(index, "item_id", e.target.value)
                    }
                    placeholder="Enter Item ID"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={row.component_id}
                    onChange={(e) =>
                      handleInputChange(index, "component_id", e.target.value)
                    }
                    placeholder="Enter Component ID"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    className="border p-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={row.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    placeholder="Enter Quantity"
                  />
                </td>
                <td className="p-2 border text-red-500">{row.error}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => updateRow(index)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => removeRow(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={addRow}
      >
        Add Row
      </button>
    </div>
  );
};

export default BoM;
