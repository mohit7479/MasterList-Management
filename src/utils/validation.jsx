export const validateItem = (item = {}) => {
  const errors = {};

  // Check for top-level properties
  if (!item.internal_item_name || item.internal_item_name.trim() === "")
    errors.internal_item_name = "Internal item name is required";

  if (!item.type || item.type.trim() === "") errors.type = "Type is required";

  if (!item.uom || item.uom.trim() === "")
    errors.uom = "Unit of Measurement (UoM) is required";

  if (!item.item_description || item.item_description.trim() === "")
    errors.item_description = "Item description is required";

  if (item.max_buffer !== undefined && isNaN(item.max_buffer))
    errors.max_buffer = "Max buffer must be a valid number";

  if (item.min_buffer !== undefined && isNaN(item.min_buffer))
    errors.min_buffer = "Min buffer must be a valid number";

  if (
    item.max_buffer !== undefined &&
    item.min_buffer !== undefined &&
    item.min_buffer > item.max_buffer
  )
    errors.min_buffer = "Min buffer cannot be greater than max buffer";

  // Check for nested `additional_attributes`
  const additionalAttributes = item.additional_attributes || {};

  if (
    !additionalAttributes.drawing_revision_number ||
    isNaN(additionalAttributes.drawing_revision_number)
  )
    errors.drawing_revision_number =
      "Drawing revision number must be a valid number";

  if (
    !additionalAttributes.drawing_revision_date ||
    additionalAttributes.drawing_revision_date.trim() === ""
  )
    errors.drawing_revision_date = "Drawing revision date is required";

  if (
    !additionalAttributes.avg_weight_needed ||
    isNaN(additionalAttributes.avg_weight_needed)
  )
    errors.avg_weight_needed = "Average weight needed must be a valid number";

  if (
    !additionalAttributes.scrap_type ||
    additionalAttributes.scrap_type.trim() === ""
  )
    errors.scrap_type = "Scrap type is required";

  if (
    !additionalAttributes.shelf_floor_alternate_name ||
    additionalAttributes.shelf_floor_alternate_name.trim() === ""
  )
    errors.shelf_floor_alternate_name =
      "Shelf/floor alternate name is required";

  // Return the errors object
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

