export const validateItem = (item, existingItems) => {
  const errors = {};

  // Check for empty mandatory fields
  if (!item.internal_item_name || item.internal_item_name.trim() === "") {
    errors.internal_item_name = "Internal item name is required.";
  }
  if (!item.uom || item.uom.trim() === "") {
    errors.uom = "Unit of Measure (UOM) is required.";
  }
  if (!item.type || item.type.trim() === "") {
    errors.type = "Type is required.";
  }

  // Check for duplicate internal item name
  if (
    existingItems &&
    existingItems.some(
      (existingItem) =>
        existingItem.internal_item_name === item.internal_item_name &&
        existingItem.id !== item.id // Allow updating the same item
    )
  ) {
    errors.internal_item_name = "Duplicate internal item name.";
  }

  // Check for valid type
  const validTypes = ["sell", "component", "purchase"];
  if (!validTypes.includes(item.type)) {
    errors.type = `Invalid type. Valid types are: ${validTypes.join(", ")}`;
  }

  // Buffer validation
  if (item.min_buffer > item.max_buffer) {
    errors.min_buffer = "Min buffer cannot be greater than max buffer.";
  }
  if (item.min_buffer < 0 || item.max_buffer < 0) {
    errors.min_buffer = "Buffer values must be non-negative.";
  }

  // Type-specific validations
  if (
    item.type === "sell" &&
    (!item.customer_item_name || item.customer_item_name.trim() === "")
  ) {
    errors.customer_item_name =
      "Customer item name is required for 'sell' type.";
  }

  // Validate additional_attributes
  if (item.additional_attributes) {
    if (
      typeof item.additional_attributes.drawing_revision_number !== "number"
    ) {
      errors["additional_attributes.drawing_revision_number"] =
        "Drawing revision number must be a number.";
    }
    if (isNaN(Date.parse(item.additional_attributes.drawing_revision_date))) {
      errors["additional_attributes.drawing_revision_date"] =
        "Invalid date format for drawing revision date.";
    }
    if (item.additional_attributes.avg_weight_needed < 0) {
      errors["additional_attributes.avg_weight_needed"] =
        "Average weight needed cannot be negative.";
    }
    if (
      !item.additional_attributes.scrap_type ||
      item.additional_attributes.scrap_type.trim() === ""
    ) {
      errors["additional_attributes.scrap_type"] = "Scrap type is required.";
    }
    if (
      item.additional_attributes.shelf_floor_alternate_name === null ||
      item.additional_attributes.shelf_floor_alternate_name.trim() === ""
    ) {
      errors["additional_attributes.shelf_floor_alternate_name"] =
        "Shelf floor alternate name is required.";
    }
  }

  return errors;
};

export const validateBOM = (bom) => {
  const errors = {};

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
  } else if (Number(bom.quantity) <= 0) {
    errors.quantity = "Quantity must be a positive number.";
  }

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
