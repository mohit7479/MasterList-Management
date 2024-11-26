import axios from "axios";

// Base URL for API
const BASE_URL = "https://api-assignment.inveesync.in";

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Items API
// export const fetchItems = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/items`);
//     return response;
//   } catch (error) {
//     throw new Error("Failed to fetch items.");
//   }
// };

// const item = {
//   internal_item_name: "ABC123",
//   tenant_id: 123,
//   item_description: "Sample Item",
//   uom: "Nos",
//   created_by: "user1",
//   last_updated_by: "user2",
//   type: "sell",
//   max_buffer: 10,
//   min_buffer: 5,
//   customer_item_name: "Customer ABC",
//   is_deleted: false,
//   createdAt: "2023-04-01T12:00:00Z",
//   updatedAt: "2023-04-10T15:30:00Z",
//   additional_attributes: {
//     drawing_revision_number: 1,
//     drawing_revision_date: "2023-04-01",
//     avg_weight_needed: 2.5,
//     scrap_type: "scrap_a",
//     shelf_floor_alternate_name: "shelf_1",
//   }
// }
// export const createItem = async () => {
//   try {
//     const response = await axios.post(`${BASE_URL}/items`, item, {
//       headers: { "Content-Type": "application/json" },
//     });
//     console.log(item);

//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create item.");
//   }
// };

// export const updateItem = async (id, item) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/items/${id}`, item, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to update item.");
//   }
// };

// export const deleteItem = async (id) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/items/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to delete item.");
//   }
// };

// // BOMs API
// export const fetchBOMs = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/bom`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch BOMs.");
//   }
// };

// export const createBOM = async (bom) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/bom`, bom, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create BOM.");
//   }
// };

// export const updateBOM = async (id, bom) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/bom/${id}`, bom, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to update BOM.");
//   }
// };

// export const deleteBOM = async (id) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/bom/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to delete BOM.");
//   }
// };

// // Processes API
// export const fetchProcesses = async (id) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/process`, { params: { id } });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch processes.");
//   }
// };

// export const createProcess = async (process) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/process`, process, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create process.");
//   }
// };

// export const updateProcess = async (id, process) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/process/${id}`, process, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to update process.");
//   }
// };

// export const deleteProcess = async (id) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/process/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to delete process.");
//   }
// };

// // Process Steps API
// export const fetchProcessSteps = async (itemId, processId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/process-step`, {
//       params: { item_id: itemId, process_id: processId },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch process steps.");
//   }
// };

// export const createProcessStep = async (step) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/process-step`, step, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create process step.");
//   }
// };

// export const updateProcessStep = async (id, step) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/process-step/${id}`, step, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to update process step.");
//   }
// };

// export const deleteProcessStep = async (id) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/process-step/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to delete process step.");
//   }
// };

// // File upload API
// export const uploadCSV = async (type, file) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("type", type);

//     const response = await axios.post(`${BASE_URL}/upload`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to upload file.");
//   }
// };
