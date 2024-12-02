import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";
import { validateItem } from "../utils/validation";
import { boolean } from "zod";

const typeOptions = [
  { value: "sell", label: "Sell - Items to be sold" },
  { value: "component", label: "Component - Part of assemblies" },
  { value: "purchase", label: "Purchase - Items to be bought" },
];

const uomOptions = [
  { value: "kgs", label: "Kgs" },
  { value: "nos", label: "Nos" },
];

const ItemsMaster = () => {
  const [items, setItems] = useState([]);
  const { dispatch } = useAppContext();
  const [newItem, setNewItem] = useState({
    internal_item_name: "",
    tenant_id: 123,
    item_description: "",
    uom: "kgs",
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
      drawing_revision_date: "",
      avg_weight_needed: boolean,
      scrap_type: "",
      shelf_floor_alternate_name: "",
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

    if (name.startsWith("additional_attributes.")) {
      const key = name.split(".")[1];
      if (editingItem) {
        setEditingItem((prev) => ({
          ...prev,
          additional_attributes: {
            ...prev.additional_attributes,
            [key]: inputValue,
          },
        }));
      } else {
        setNewItem((prev) => ({
          ...prev,
          additional_attributes: {
            ...prev.additional_attributes,
            [key]: inputValue,
          },
        }));
      }
    } else if (editingItem) {
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

  const handleUOMChange = (selectedOption) => {
    const selectedValue = selectedOption?.value || "";
    if (editingItem) {
      setEditingItem((prev) => ({
        ...prev,
        uom: selectedValue,
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        uom: selectedValue,
      }));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemToValidate = editingItem || newItem;

    // Create an object to hold validation errors
    const validationErrors = validateItem(itemToValidate, items);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      // Display errors for each field
      for (const [key, value] of Object.entries(validationErrors)) {
        toast.error(value); // Display each error message
      }
      return;
    }

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
        dispatch({
          type: "ADD_LOG",
          payload: {
            timestamp: new Date().toISOString(),
            user: "Admin",
            action: "Delete",
            details: `Item ID ${editingItem.id} Updated`,
          },
        });
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
  };

  const resetNewItem = () => {
    setNewItem({
      internal_item_name: "",
      tenant_id: 123,
      item_description: "",
      uom: "kgs",
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
        drawing_revision_date: "",
        avg_weight_needed: 0,
        scrap_type: "",
        shelf_floor_alternate_name: "",
      },
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    resetNewItem();
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
      dispatch({
        type: "ADD_LOG",
        payload: {
          timestamp: new Date().toISOString(),
          user: "Admin",
          action: "Delete",
          details: `Item  ${id} deleted`,
        },
      });
    } catch (error) {
      toast.error("Failed to delete item");
    }
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
                  {errors[key] && (
                    <span className="text-red-600 text-sm">{errors[key]}</span>
                  )}
                </div>
              );
            } else if (key === "uom") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    UOM
                  </label>
                  <Select
                    options={uomOptions}
                    value={uomOptions.find(
                      (option) =>
                        option.value === (editingItem?.uom || newItem.uom)
                    )}
                    onChange={handleUOMChange}
                    placeholder="Select UOM"
                  />
                  {errors[key] && (
                    <span className="text-red-600 text-sm">{errors[key]}</span>
                  )}
                </div>
              );
            } else if (key === "additional_attributes") {
              return Object.keys(newItem.additional_attributes).map((attr) => (
                <div key={attr}>
                  <label className="block text-sm font-medium text-gray-700">
                    {attr.replace(/_/g, " ")}
                  </label>
                  {attr === "avg_weight_needed" ? (
                    <input
                      type="checkbox"
                      name={`additional_attributes.${attr}`}
                      checked={
                        editingItem
                          ? editingItem.additional_attributes[attr]
                          : newItem.additional_attributes[attr]
                      }
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <input
                      type="text"
                      name={`additional_attributes.${attr}`}
                      value={
                        editingItem
                          ? editingItem.additional_attributes[attr]
                          : newItem.additional_attributes[attr]
                      }
                      onChange={handleInputChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  )}
                  {errors[`additional_attributes.${attr}`] && (
                    <span className="text-red-600 text-sm">
                      {errors[`additional_attributes.${attr}`]}
                    </span>
                  )}
                </div>
              ));
            }
          })}
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="mr-4 px-6 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            {editingItem ? "Update" : "Create"} Item
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Items List</h2>
      {isLoading ? (
        <p>Loading items...</p>
      ) : (
        <div className="space-y-4">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
              >
                {item.id}
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.internal_item_name}
                  </h3>
                  <p className="text-sm">{item.type}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No items available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemsMaster;

// import React, { useState, useEffect } from "react";
// import Select from "react-select"; // For searchable dropdown
// import { toast } from "react-toastify"; // For notifications
// import {
//   fetchItems,
//   createItem,
//   updateItem,
//   deleteItem,
// } from "../services/api"; // API calls
// import { validateItem } from "../utils/validation"; // Validation utility

// const typeOptions = [
//   { value: "sell", label: "Sell - Items to be sold" },
//   { value: "component", label: "Component - Part of assemblies" },
//   { value: "purchase", label: "Purchase - Items to be bought" },
// ];

// const ItemsMaster = () => {
//   const [items, setItems] = useState([]);
//   const [newItem, setNewItem] = useState({
//     internal_item_name: "",
//     tenant_id: 123,
//     item_description: "",
//     uom: "",
//     created_by: "user1",
//     last_updated_by: "user2",
//     type: "",
//     max_buffer: 0,
//     min_buffer: 0,
//     is_job_work: false,
//     customer_item_name: "",
//     is_deleted: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     additional_attributes: {
//       drawing_revision_number: 1,
//       drawing_revision_date: "",
//       avg_weight_needed: 0,
//       scrap_type: "",
//       shelf_floor_alternate_name: "",
//     },
//   });
//   const [editingItem, setEditingItem] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchItemsData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetchItems();
//         if (Array.isArray(response.data)) {
//           setItems(response.data);
//         } else {
//           toast.error("Invalid data format received");
//         }
//       } catch (error) {
//         toast.error("Failed to fetch items");
//         console.error("Error fetching items:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchItemsData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const inputValue = type === "checkbox" ? checked : value;

//     if (editingItem) {
//       setEditingItem((prev) => ({
//         ...prev,
//         [name]: inputValue,
//       }));
//     } else {
//       setNewItem((prev) => ({
//         ...prev,
//         [name]: inputValue,
//       }));
//     }
//   };

//   const handleTypeChange = (selectedOption) => {
//     const selectedValue = selectedOption?.value || "";
//     if (editingItem) {
//       setEditingItem((prev) => ({
//         ...prev,
//         type: selectedValue,
//       }));
//     } else {
//       setNewItem((prev) => ({
//         ...prev,
//         type: selectedValue,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const itemToValidate = editingItem || newItem;

//     // Validation
//     const validationErrors = validateItem(itemToValidate, items);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       toast.error("Validation errors. Please check your inputs.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       if (editingItem) {
//         const response = await updateItem(editingItem.id, editingItem);
//         setItems((prevItems) =>
//           prevItems.map((item) =>
//             item.id === editingItem.id ? response.data : item
//           )
//         );
//         setEditingItem(null);
//         toast.success("Item updated successfully");
//       } else {
//         const response = await createItem(newItem);
//         setItems((prevItems) => [...prevItems, response.data]);
//         toast.success("Item created successfully");
//         resetNewItem();
//       }
//       setErrors({});
//     } catch (error) {
//       toast.error("Failed to save item");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetNewItem = () => {
//     setNewItem({
//       internal_item_name: "",
//       tenant_id: 123,
//       item_description: "",
//       uom: "",
//       created_by: "user1",
//       last_updated_by: "user2",
//       type: "",
//       max_buffer: 0,
//       min_buffer: 0,
//       is_job_work: false,
//       customer_item_name: "",
//       is_deleted: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       additional_attributes: {
//         drawing_revision_number: 1,
//         drawing_revision_date: "",
//         avg_weight_needed: 0,
//         scrap_type: "",
//         shelf_floor_alternate_name: "",
//       },
//     });
//   };

//   const handleCancel = () => {
//     setEditingItem(null);
//     resetNewItem();
//     setErrors({});
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteItem(id);
//       setItems((prevItems) => prevItems.filter((item) => item.id !== id));
//       toast.success("Item deleted successfully");
//     } catch (error) {
//       toast.error("Failed to delete item");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Items Master</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="mb-6 bg-white p-6 rounded-lg shadow"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {Object.keys(newItem).map((key) => {
//             if (key === "type") {
//               return (
//                 <div key={key}>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Type
//                   </label>
//                   <Select
//                     options={typeOptions}
//                     value={typeOptions.find(
//                       (option) =>
//                         option.value === (editingItem?.type || newItem.type)
//                     )}
//                     onChange={handleTypeChange}
//                     placeholder="Select Type"
//                   />
//                   {errors[key] && (
//                     <span className="text-red-600 text-sm">{errors[key]}</span>
//                   )}
//                 </div>
//               );
//             }
//             return (
//               <div key={key}>
//                 <label className="block text-sm font-medium text-gray-700">
//                   {key.replace(/_/g, " ")}
//                 </label>
//                 <input
//                   type={typeof newItem[key] === "number" ? "number" : "text"}
//                   name={key}
//                   value={editingItem ? editingItem[key] : newItem[key]}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3"
//                 />
//                 {errors[key] && (
//                   <span className="text-red-600 text-sm">{errors[key]}</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         <div className="mt-6">
//           <button
//             type="submit"
//             className="bg-indigo-600 text-white py-2 px-4 rounded-md"
//           >
//             {editingItem ? "Update Item" : "Create Item"}
//           </button>
//           {editingItem && (
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="ml-4 bg-gray-200 py-2 px-4 rounded-md"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//       <h2 className="text-xl font-semibold mb-4">Items List</h2>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : items.length === 0 ? (
//         <p>No items available</p>
//       ) : (
//         <table className="min-w-full">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.id}</td>
//                 <td>{item.internal_item_name}</td>
//                 <td>{item.type}</td>
//                 <td>
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ItemsMaster;
