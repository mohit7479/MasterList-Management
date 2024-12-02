export const validateItem = (item, existingItems) => {
  const errors = {};

  // Mandatory Fields Validation
  if (!item.internal_item_name || item.internal_item_name.trim() === "") {
    errors.internal_item_name = "Internal Item Name is required";
  }

  if (!item.type || !["sell", "purchase", "component"].includes(item.type)) {
    errors.type =
      "Type is required and must be one of 'sell', 'purchase', or 'component'";
  }

  if (!item.uom || !["kgs", "nos"].includes(item.uom)) {
    errors.uom = "UoM is required and must be one of 'kgs' or 'nos'";
  }

  if (
    !item.additional_attributes ||
    !item.additional_attributes.hasOwnProperty("avg_weight_needed")
  ) {
    // If additional_attributes is not available or avg_weight_needed is not available
    errors["additional_attributes.avg_weight_needed"] =
      "Average weight field is not available";
  } else {
    if (!item.additional_attributes.avg_weight_needed) {
      errors["additional_attributes.avg_weight_needed"] =
        "Average weight is required";
    } else {
      // Check if avg_weight_needed is a string and convert it
      if (typeof item.additional_attributes.avg_weight_needed === "string") {
        const lowerCaseValue =
          item.additional_attributes.avg_weight_needed.toLowerCase();

        if (lowerCaseValue === "true") {
          item.additional_attributes.avg_weight_needed = true;
        } else if (lowerCaseValue === "false") {
          item.additional_attributes.avg_weight_needed = false;
        } else {
          errors["additional_attributes.avg_weight_needed"] =
            "Avg_weight_needed must be a boolean";
        }
      }

      // After converting, check if it's a boolean
      if (typeof item.additional_attributes.avg_weight_needed !== "boolean") {
        errors["additional_attributes.avg_weight_needed"] =
          "Avg_weight_needed must be a boolean";
      }
    }
  }

  if (
    item.type === "sell" &&
    (!item.additional_attributes?.scrap_type ||
      item.additional_attributes.scrap_type.trim() === "")
  ) {
    errors.scrap_type = "Scrap Type is required for 'Sell' items";
  }

  // Key Validations
  if (
    existingItems.some(
      (existingItem) =>
        existingItem.internal_item_name === item.internal_item_name &&
        existingItem.tenant_id === item.tenant_id
    )
  ) {
    errors.internal_item_name =
      "An item with this Internal Item Name already exists for the tenant";
  }

  // Default values for buffers if null
  if (
    item.min_buffer == null && // Covers both null and undefined
    (item.type === "sell" || item.type === "purchase")
  ) {
    errors.min_buffer =
      "min_buffer cannot be null for 'sell' or 'purchase' type";
  }

  if (item.max_buffer === null || item.max_buffer === undefined) {
    item.max_buffer = 0; // Default Max buffer to 0
  }

  // Validate buffers
  if (item.min_buffer < 0) {
    errors.min_buffer = "Min buffer cannot be negative";
  }
  if (item.max_buffer < 0) {
    errors.max_buffer = "Max buffer cannot be negative";
  }
  if (item.max_buffer < item.min_buffer) {
    errors.max_buffer =
      "Max buffer must be greater than or equal to Min buffer";
  }

  // Additional Validations
  if (
    (item.type === "sell" || item.type === "purchase") &&
    item.min_buffer === 0
  ) {
    errors.min_buffer =
      "Min buffer is required for 'Sell' and 'Purchase' items";
  }

  // Check for system-generated fields (if required to validate in the system):
  const systemGeneratedFields = [
    "created_by",
    "tenant_id",
    "id",
    "createdAt",
    "updatedAt",
  ];
  systemGeneratedFields.forEach((field) => {
    if (!item[field]) {
      errors[
        field
      ] = `${field} is a system-generated field and cannot be empty`;
    }
  });

  return errors;
};

export const validateBOM = (bom, existingBoms, allItems) => {
  const errors = {};

  // Ensure allItems and existingBoms are arrays
  if (!Array.isArray(allItems)) {
    throw new Error("allItems must be an array");
  }
  if (!Array.isArray(existingBoms)) {
    throw new Error("existingBoms must be an array");
  }

  console.log("Validating BOM", bom);
  console.log("Checking allItems for matching IDs:", allItems);

  // Validate item_id
  if (!bom.item_id || isNaN(Number(bom.item_id))) {
    errors.item_id = "Item ID must be a valid number.";
  } else if (Number(bom.item_id) <= 0) {
    errors.item_id = "Item ID must be a positive number.";
  }

  // Validate component_id
  if (!bom.component_id || isNaN(Number(bom.component_id))) {
    errors.component_id = "Component ID must be a valid number.";
  } else if (Number(bom.component_id) <= 0) {
    errors.component_id = "Component ID must be a positive number.";
  }

  // Validate quantity
  if (!bom.quantity || isNaN(Number(bom.quantity))) {
    errors.quantity = "Quantity must be a valid number.";
  } else if (Number(bom.quantity) <= 0 || Number(bom.quantity) > 100) {
    errors.quantity = "Quantity must be between 1 and 100.";
  }

  // Check if item_id exists in allItems
  const itemExists = allItems.some((item) => item.id === Number(bom.item_id));
  console.log(
    `Checking if item ${bom.item_id} exists in allItems: ${itemExists}`
  );
  if (!itemExists) {
    console.log(`Item not found: ${bom.item_id}`);
    errors.item_id = "Item does not exist in the database.";
  }

  // Check if component_id exists in allItems
  const componentExists = allItems.some(
    (item) => item.id === Number(bom.component_id)
  );
  console.log(
    `Checking if component ${bom.component_id} exists in allItems: ${componentExists}`
  );
  if (!componentExists) {
    console.log(`Component not found: ${bom.component_id}`);
    errors.component_id = "Component does not exist in the database.";
  }

  // Additional validation (Sell/Purchase items)
  const sellItemExists = allItems.some(
    (item) => item.id === Number(bom.item_id) && item.type === "sell"
  );
  if (bom.item_id && !bom.component_id && !sellItemExists) {
    errors.item_id = "Sell items must exist in the database.";
  }

  const purchaseItemExists = allItems.some(
    (item) => item.id === Number(bom.component_id) && item.type === "purchase"
  );
  if (bom.component_id && !bom.item_id && !purchaseItemExists) {
    errors.component_id = "Purchase items must exist in the database.";
  }

  // Check for duplicates in existingBoms
  const isDuplicate = existingBoms.some(
    (existingBom) =>
      existingBom.item_id === Number(bom.item_id) &&
      existingBom.component_id === Number(bom.component_id)
  );
  if (isDuplicate) {
    console.log("Duplicate BOM:", bom);
    errors.item_id =
      "This Item ID and Component ID combination already exists.";
  }

  console.log("Validation errors:", errors);

  return errors;
};

export const validateProcessStep = (step) => {
  const errors = {};

  // Validate process_id
  if (!step.process_id || isNaN(Number(step.process_id))) {
    errors.process_id = "Process ID must be a valid number";
  }

  // Validate item_id
  if (!step.item_id || isNaN(Number(step.item_id))) {
    errors.item_id = "Item ID must be a valid number";
  }

  // Validate sequence
  if (!step.sequence || isNaN(Number(step.sequence))) {
    errors.sequence = "Sequence must be a valid number";
  }

  // Validate conversion_ratio
  if (!step.conversion_ratio || isNaN(Number(step.conversion_ratio))) {
    errors.conversion_ratio = "Conversion ratio must be a valid number";
  } else if (
    Number(step.conversion_ratio) < 0 ||
    Number(step.conversion_ratio) > 100
  ) {
    errors.conversion_ratio = "Conversion ratio must be between 0 and 100";
  }

  // Validate description
  if (!step.description || !step.description.trim()) {
    errors.description = "Description is required";
  }

  // Validate createdAt
  if (!step.createdAt || isNaN(Date.parse(step.createdAt))) {
    errors.createdAt = "CreatedAt must be a valid ISO timestamp";
  }

  // Validate updatedAt
  if (!step.updatedAt || isNaN(Date.parse(step.updatedAt))) {
    errors.updatedAt = "UpdatedAt must be a valid ISO timestamp";
  }

  // Additional validations for relationships (optional)
  if (step.item_id && step.item_id <= 0) {
    errors.item_id = "Item ID must be a positive number";
  }

  if (step.process_id && step.process_id <= 0) {
    errors.process_id = "Process ID must be a positive number";
  }

  return errors;
};
