export const validateItem = (item) => {
  const errors = {};

  // Check if the item name is provided
  if (!item.internal_item_name) {
    errors.internal_item_name = "Item name is required.";
  }

  // Check if the item description is provided
  if (!item.item_description) {
    errors.item_description = "Item description is required.";
  }

  // Check if unit of measure (uom) is provided
  if (!item.uom) {
    errors.uom = "Unit of measure (UOM) is required.";
  }

  // Check if the type is provided
  if (!item.type) {
    errors.type = "Item type is required.";
  }

  // Check if max_buffer and min_buffer are non-negative
  if (item.max_buffer < 0) {
    errors.max_buffer = "Max buffer should be a positive number.";
  }

  if (item.min_buffer < 0) {
    errors.min_buffer = "Min buffer should be a positive number.";
  }

  // Check if additional attributes are valid
  if (item.additional_attributes) {
    if (!item.additional_attributes.drawing_revision_number) {
      errors.drawing_revision_number = "Drawing revision number is required.";
    }
    if (!item.additional_attributes.drawing_revision_date) {
      errors.drawing_revision_date = "Drawing revision date is required.";
    }
    if (isNaN(item.additional_attributes.avg_weight_needed)) {
      errors.avg_weight_needed = "Average weight needed should be a number.";
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
