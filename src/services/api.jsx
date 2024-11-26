import axios from "axios";

// Base URL for API
const BASE_URL = "https://api-assignment.inveesync.in";

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- ITEMS ----------
export const fetchItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/items`, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch items.");
  }
};

export const createItem = async (data) => {
  console.log(data);
  try {
    const payload = {
      tenant_id: data.tenant_id || 1, // Default to 1 if tenant_id is not provided
      internal_item_name: data.internal_item_name,
      item_description: data.item_description,
      uom: data.uom,
      type: data.type,
      max_buffer: data.max_buffer,
      min_buffer: data.min_buffer,
      customer_item_name: data.customer_item_name,
      created_by: data.created_by,
      last_updated_by: data.last_updated_by,
      is_deleted: data.is_deleted || false,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      additional_attributes: {
        drawing_revision_number:
          data.additional_attributes.drawing_revision_number,
        drawing_revision_date: data.additional_attributes.drawing_revision_date,
        avg_weight_needed: data.additional_attributes.avg_weight_needed,
        scrap_type: data.additional_attributes.scrap_type,
        shelf_floor_alternate_name:
          data.additional_attributes.shelf_floor_alternate_name,
      },
    };

    const response = await axios.post(`${BASE_URL}/items`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw new Error(error.response?.data?.message || "Failed to create item.");
  }
};

// Update an Item
export const updateItem = async (itemId, data) => {
  if (!itemId || !data) {
    throw new Error("Invalid parameters: itemId and data are required.");
  }

  try {
    const response = await axios.put(`${BASE_URL}/items/${itemId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update the item."
    );
  }
};

// Delete an Item
export const deleteItem = async (itemId) => {
  if (!itemId) {
    throw new Error("Invalid parameter: itemId is required.");
  }

  try {
    const response = await axios.delete(`${BASE_URL}/items/${itemId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete the item."
    );
  }
};

// ---------- PROCESSES ----------
export const fetchProcesses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/processes`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching processes:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch processes."
    );
  }
};

export const createProcess = async (data) => {
  try {
    const payload = {
      tenant_id: data.tenant_id,
      process_name: data.process_name,
      quality_check: data.quality_check, // Boolean
      scrap: data.scrap, // Boolean
      is_assembly: data.is_assembly, // Boolean
      average_weight: data.average_weight,
      type: data.type,
      created_by: data.created_by,
    };

    const response = await axios.post(`${BASE_URL}/processes`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating process:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create process."
    );
  }
};

// ---------- BILL OF MATERIALS (BOM) ----------
export const fetchBillOfMaterials = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bill-of-materials`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching BOM:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch BOM.");
  }
};

export const createBillOfMaterials = async (data) => {
  try {
    const payload = {
      item_id: data.item_id,
      component_id: data.component_id,
      quantity: data.quantity,
      tenant_id: data.tenant_id,
      created_by: data.created_by,
    };

    const response = await axios.post(
      `${BASE_URL}/bill-of-materials`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating BOM:", error);
    throw new Error(error.response?.data?.message || "Failed to create BOM.");
  }
};

// ---------- PROCESS STEPS ----------
export const fetchProcessSteps = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/process-steps`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching process steps:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch process steps."
    );
  }
};

export const createProcessStep = async (data) => {
  try {
    const payload = {
      process_id: data.process_id,
      item_id: data.item_id,
      sequence: data.sequence,
      tenant_id: data.tenant_id,
      conversion_ratio: data.conversion_ratio,
      process_description: data.process_description,
      created_by: data.created_by,
    };

    const response = await axios.post(`${BASE_URL}/process-steps`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating process step:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create process step."
    );
  }
};

// Upload a CSV File
export const uploadCSV = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/items/upload-csv`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    throw new Error(error.response?.data?.message || "Failed to upload CSV.");
  }
};


