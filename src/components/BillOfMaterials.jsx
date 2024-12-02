import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { validateBOM } from "../utils/validation";

const BASE_URL = "https://api-assignment.inveesync.in";

const BillOfMaterials = () => {
  const { dispatch } = useAppContext();
  const [boms, setBoms] = useState([]);
  const [newBom, setNewBom] = useState({
    item_id: "",
    component_id: "",
    quantity: "",
    created_by: "u1",
    last_updated_by: "u2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [editBomId, setEditBomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState([]); // Fetch this list from your database

  const fetchBoms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/bom`);
      setBoms(response.data);
    } catch (err) {
      toast.error("Failed to fetch BOMs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items`);
      setAllItems(response.data);
    } catch (err) {
      toast.error("Failed to fetch items.");
    }
  };

  useEffect(() => {
    fetchBoms();
    fetchAllItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateBOM(newBom, boms, allItems);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }
    try {
      const payload = {
        item_id: parseInt(newBom.item_id, 10),
        component_id: parseInt(newBom.component_id, 10),
        quantity: parseInt(newBom.quantity, 10),
        created_by: newBom.created_by,
        last_updated_by: newBom.last_updated_by,
      };

      if (editBomId) {
        await axios.put(`${BASE_URL}/bom/${editBomId}`, payload);
        setBoms((prev) =>
          prev.map((bom) =>
            bom.id === editBomId ? { ...bom, ...payload } : bom
          )
        );
        toast.success("BOM updated successfully!");
      } else {
        const response = await axios.post(`${BASE_URL}/bom`, payload);
        setBoms([...boms, response.data]);
        toast.success("BOM added successfully!");
      }

      setNewBom({
        item_id: "",
        component_id: "",
        quantity: "",
        created_by: "u1",
        last_updated_by: "u2",
      });
      setEditBomId(null);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(
        `Error details: ${JSON.stringify(err.response?.data || err.message)}`
      );
    }
  };

  const handleInputChange = (e) => {
    setNewBom({ ...newBom, [e.target.name]: e.target.value });
  };

  // Delete a BOM entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this BOM entry?")) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/bom/${id}`);
      setBoms(boms.filter((bom) => bom.id !== id));
      toast.success("BOM deleted successfully!");
      dispatch({
        type: "ADD_LOG",
        payload: {
          timestamp: new Date().toISOString(),
          user: "Admin",
          action: "Delete",
          details: `BOM ID ${id} deleted`,
        },
      });
    } catch (err) {
      toast.error("Failed to delete BOM entry. Please try again.");
    }
  };

  // Populate fields for editing
  const handleEdit = (bom) => {
    setNewBom({
      item_id: bom.item_id,
      component_id: bom.component_id,
      quantity: bom.quantity,
      created_by: bom.created_by,
      last_updated_by: bom.last_updated_by,
    });
    setEditBomId(bom.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bill of Materials</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-md border"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "item_id",
            "component_id",
            "quantity",
            "created_by",
            "last_updated_by",
          ].map((field, idx) => (
            <div key={idx}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                type={field === "quantity" ? "number" : "text"}
                name={field}
                id={field}
                value={newBom[field]}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {editBomId ? "Update" : "Add"} BoM Entry
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : boms.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Item ID",
                  "Component ID",
                  "Quantity",
                  "Created By",
                  "Last Updated By",
                  "Actions",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bom.created_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bom.last_updated_by}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(bom)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bom.id)}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No BOMs found</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default BillOfMaterials;
