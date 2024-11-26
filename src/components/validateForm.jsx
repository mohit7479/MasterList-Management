// validateForm.js
export const validateForm = (formData) => {
  const errors = {};
  if (!formData.internal_item_name)
    errors.internal_item_name = "This field is required.";
  if (!formData.type) errors.type = "Please select a type.";
  if (!formData.uom) errors.uom = "Unit of Measurement is required.";
  if (!formData.avg_weight_needed)
    errors.avg_weight_needed = "Average Weight is required.";

  if (
    (formData.type === "Sell" || formData.type === "Purchase") &&
    !formData.scrap_type
  ) {
    errors.scrap_type = "Scrap type is required for Sell/Purchase items.";
  }

  return errors;
};
