import React, { useState, useEffect } from "react";
import Select from "react-select"; // For searchable dropdown
import { toast } from "react-toastify";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";
import { validateItem } from "../utils/validation";

const typeOptions = [
  { value: "sell", label: "Sell - Items to be sold" },
  { value: "component", label: "Component - Part of assemblies" },
  { value: "purchase", label: "Purchase - Items to be bought" },
];

const ItemsMaster = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    internal_item_name: "",
    tenant_id: 123,
    item_description: "",
    uom: "",
    created_by: "user1",
    last_updated_by: "user2",
    type: "",
    max_buffer: 0,
    min_buffer: 0,
    is_job_work: false, // Added for checkbox
    customer_item_name: "",
    is_deleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    additional_attributes: {
      drawing_revision_number: 1,
      drawing_revision_date: "2023-04-01",
      avg_weight_needed: 2.5,
      scrap_type: "scrap_a",
      shelf_floor_alternate_name: "shelf_1",
    },
  });
  const [editingItem, setEditingItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItemsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchItems();
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          toast.error("Invalid data format received");
        }
      } catch (error) {
        toast.error("Failed to fetch items");
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItemsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (editingItem) {
      setEditingItem((prev) => ({
        ...prev,
        [name]: inputValue,
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        [name]: inputValue,
      }));
    }
  };

  const handleTypeChange = (selectedOption) => {
    const selectedValue = selectedOption?.value || "";
    if (editingItem) {
      setEditingItem((prev) => ({
        ...prev,
        type: selectedValue,
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        type: selectedValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemToValidate = editingItem || newItem;
    const validationErrors = validateItem(itemToValidate);
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        if (editingItem) {
          const response = await updateItem(editingItem.id, editingItem);
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === editingItem.id ? response.data : item
            )
          );
          setEditingItem(null);
          toast.success("Item updated successfully");
        } else {
          const response = await createItem(newItem);
          setItems((prevItems) => [...prevItems, response.data]);
          toast.success("Item created successfully");
          resetNewItem();
        }
        setErrors({});
      } catch (error) {
        toast.error("Failed to save item");
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const resetNewItem = () => {
    setNewItem({
      internal_item_name: "",
      tenant_id: 123,
      item_description: "",
      uom: "",
      created_by: "user1",
      last_updated_by: "user2",
      type: "",
      max_buffer: 0,
      min_buffer: 0,
      is_job_work: false,
      customer_item_name: "",
      is_deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      additional_attributes: {
        drawing_revision_number: 1,
        drawing_revision_date: "2023-04-01",
        avg_weight_needed: 2.5,
        scrap_type: "scrap_a",
        shelf_floor_alternate_name: "shelf_1",
      },
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    resetNewItem();
    setErrors({});
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Items Master</h1>
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(newItem).map((key) => {
            if (key === "type") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <Select
                    options={typeOptions}
                    value={typeOptions.find(
                      (option) =>
                        option.value === (editingItem?.type || newItem.type)
                    )}
                    onChange={handleTypeChange}
                    placeholder="Select Type"
                  />
                </div>
              );
            }
            if (key === "is_job_work" && (editingItem?.type || newItem.type)) {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Work
                  </label>
                  <input
                    type="checkbox"
                    name="is_job_work"
                    checked={editingItem?.is_job_work || newItem.is_job_work}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              );
            }
            if (
              typeof newItem[key] === "object" &&
              key === "additional_attributes"
            ) {
              return Object.keys(newItem[key]).map((subKey) => (
                <div key={subKey}>
                  <label className="block text-sm font-medium text-gray-700">
                    {subKey.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    name={`additional_attributes.${subKey}`}
                    value={
                      editingItem
                        ? editingItem.additional_attributes[subKey]
                        : newItem.additional_attributes[subKey]
                    }
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3"
                  />
                </div>
              ));
            }
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type={typeof newItem[key] === "number" ? "number" : "text"}
                  name={key}
                  value={editingItem ? editingItem[key] : newItem[key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3"
                />
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md"
          >
            {editingItem ? "Update Item" : "Create Item"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="ml-4 bg-gray-200 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-4">Items List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items available</p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.internal_item_name}</td>
                <td>{item.type}</td>
                <td>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await deleteItem(item.id);
                        setItems((prevItems) =>
                          prevItems.filter((i) => i.id !== item.id)
                        );
                        toast.success("Item deleted successfully");
                      } catch {
                        toast.error("Failed to delete item");
                      }
                    }}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemsMaster;
