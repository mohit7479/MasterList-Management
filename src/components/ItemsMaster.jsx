import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";
import { validateItem } from "../utils/validation";

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
    const { name, value } = e.target;
    const updatedValue = name.startsWith("additional_attributes.")
      ? {
          ...newItem.additional_attributes,
          [name.split(".")[1]]: value,
        }
      : { [name]: value };

    if (editingItem) {
      setEditingItem((prev) => ({
        ...prev,
        [name]: value,
        ...updatedValue,
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        [name]: value,
        ...updatedValue,
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
          
          const response =await createItem(newItem);
          console.log(response);
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
          {/* Dynamic inputs based on fields */}
          {Object.keys(newItem).map((key) => {
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
              <th>Name</th>
              <th>Type</th>
              <th>UoM</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item?.id || index}>
                  <td>{item?.internal_item_name || "N/A"}</td>
                  <td>{item?.type || "N/A"}</td>
                  <td>{item?.uom || "N/A"}</td>
                  <td>
                    <button onClick={() => setEditingItem(item)}>Edit</button>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this item?"
                          )
                        ) {
                          try {
                            await deleteItem(item.id);
                            setItems((prevItems) =>
                              prevItems.filter((i) => i.id !== item.id)
                            );
                            toast.success("Item deleted successfully");
                          } catch (error) {
                            console.error("Error deleting item:", error);
                            toast.error("Failed to delete item");
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No items available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemsMaster;

// import React, { useState, useEffect } from "react";
// import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
// import { validateItem } from "../utils/validation";
// import {
//   fetchItems,
//   createItem,
//   updateItem,
//   deleteItem,
// } from "../services/api";
// import { toast } from "react-toastify";

// const ItemsMaster = () => {
//   const [items, setItems] = useState([]);
//   const [newItem, setNewItem] = useState({
//     name: "",
//     type: "",
//     uom: "",
//     avg_weight: "",
//   });
//   const [editingItem, setEditingItem] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect( async() => {
//     const response =await createItem();
//     console.log(response);
//   });

//   const fetchItemsData = () => {
//     setIsLoading(true);
//     try {
//       const response = fetchItems();
//       console.log(response);
//       // Ensure response.data is an array
//       if (Array.isArray(response.data)) {
//         setItems(response.data);
//       } else {
//         toast.error("Invalid data format received");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch items");
//       console.error("Error fetching items:", error); // Log the error for debugging
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (editingItem) {
//       setEditingItem({ ...editingItem, [name]: value });
//     } else {
//       setNewItem({ ...newItem, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const itemToValidate = editingItem || newItem;
//     const validationErrors = validateItem(itemToValidate);
//     if (Object.keys(validationErrors).length === 0) {
//       setIsLoading(true);
//       try {
//         if (editingItem) {
//           const response = await updateItem(editingItem.id, editingItem);
//           setItems(
//             items.map((item) =>
//               item.id === editingItem.id ? response.data : item
//             )
//           );
//           setEditingItem(null);
//           toast.success("Item updated successfully");
//         } else {
//           const response = await createItem(newItem);
//           setItems([...items, response.data]);
//           setNewItem({ name: "", type: "", uom: "", avg_weight: "" });
//           toast.success("Item created successfully");
//         }
//         setErrors({});
//       } catch (error) {
//         toast.error("Failed to save item");
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setErrors(validationErrors);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setNewItem({ name: "", type: "", uom: "", avg_weight: "" });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       setIsLoading(true);
//       try {
//         await deleteItem(id);
//         setItems(items.filter((item) => item.id !== id));
//         toast.success("Item deleted successfully");
//       } catch (error) {
//         toast.error("Failed to delete item");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleCancel = () => {
//     setEditingItem(null);
//     setNewItem({ name: "", type: "", uom: "", avg_weight: "" });
//     setErrors({});
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Items Master</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="mb-6 bg-white p-6 rounded-lg shadow"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Internal Item Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               id="name"
//               value={editingItem ? editingItem.name : newItem.name}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-500">{errors.name}</p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="type"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Type
//             </label>
//             <select
//               name="type"
//               id="type"
//               value={editingItem ? editingItem.type : newItem.type}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.type ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             >
//               <option value="">Select type</option>
//               <option value="sell">Sell</option>
//               <option value="purchase">Purchase</option>
//               <option value="component">Component</option>
//             </select>
//             {errors.type && (
//               <p className="mt-1 text-sm text-red-500">{errors.type}</p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="uom"
//               className="block text-sm font-medium text-gray-700"
//             >
//               UoM
//             </label>
//             <input
//               type="text"
//               name="uom"
//               id="uom"
//               value={editingItem ? editingItem.uom : newItem.uom}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.uom ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             />
//             {errors.uom && (
//               <p className="mt-1 text-sm text-red-500">{errors.uom}</p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="avg_weight"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Average Weight Needed
//             </label>
//             <input
//               type="number"
//               name="avg_weight"
//               id="avg_weight"
//               value={editingItem ? editingItem.avg_weight : newItem.avg_weight}
//               onChange={handleInputChange}
//               className={`mt-1 block w-full border ${
//                 errors.avg_weight ? "border-red-500" : "border-gray-300"
//               } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             />
//             {errors.avg_weight && (
//               <p className="mt-1 text-sm text-red-500">{errors.avg_weight}</p>
//             )}
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end space-x-2">
//           {editingItem ? (
//             <>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 {isLoading ? "Updating..." : "Update Item"}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 disabled={isLoading}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
//               {isLoading ? "Adding..." : "Add Item"}
//             </button>
//           )}
//         </div>
//       </form>
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Type
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 UoM
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Avg Weight Needed
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {items.map((item) => (
//               <tr key={item.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {item.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.type}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.uom}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {item.avg_weight}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button
//                     onClick={() => handleEdit(item)}
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     <PencilIcon className="h-5 w-5 inline" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     className="text-red-600 hover:text-red-900 ml-4"
//                   >
//                     <TrashIcon className="h-5 w-5 inline" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ItemsMaster;
