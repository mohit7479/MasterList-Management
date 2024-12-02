import React, { useRef, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { validateItem, validateBOM } from "../utils/validation";

const BASE_URL = "https://api-assignment.inveesync.in";

const FileHandler = () => {
  const fileInputRef = useRef(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [visibleSection, setVisibleSection] = useState("");

  const handleFileUpload = async (event) => {
    setUploadErrors([]);
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const validExtensions = [".csv", ".json", ".xlsx", ".xls"];
    const fileExtension = file.name.split(".").pop();
    if (!validExtensions.includes(`.${fileExtension}`)) {
      toast.error(
        "Unsupported file type. Please upload .csv, .json, or Excel files."
      );
      return;
    }

    if (!uploadType) {
      toast.error("Please select an upload type before uploading a file.");
      return;
    }

    setIsUploading(true);

    try {
      // Fetch the allItems data here (example using fetch)
      const allItemsResponse = await axios.get(`${BASE_URL}/items`);
      const allItems = allItemsResponse.data || []; // Ensure allItems is populated

      if (allItems.length === 0) {
        toast.error("No items found in the database.");
        setIsUploading(false);
        return;
      }

      let parsedData = [];

      // Parse the file
      if (fileExtension === "csv") {
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
        });
        parsedData = result.data;
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(sheet);
      } else if (fileExtension === "json") {
        const text = await file.text();
        parsedData = JSON.parse(text);
      }

      // Assuming `existingBoms` is already fetched or passed in
      const existingBoms = []; // Replace with actual fetched BOM data

      // Transform and validate data
      const transformedData = parsedData.map((record) => {
        const transformedRecord = { ...record };

        // Transform flat keys with "__" into nested objects
        Object.keys(record).forEach((key) => {
          if (key.includes("__")) {
            const [parent, child] = key.split("__");
            transformedRecord[parent] = transformedRecord[parent] || {};
            transformedRecord[parent][child] = record[key];
            delete transformedRecord[key];
          }
        });

        return transformedRecord;
      });

      const validData = [];
      const errors = [];
      transformedData.forEach((record, index) => {
        let validationErrors = {};
        if (uploadType === "items") {
          validationErrors = validateItem(record, []); // Pass existing items if needed
        } else if (uploadType === "bom") {
          validationErrors = validateBOM(record, existingBoms, allItems);
        }

        if (Object.keys(validationErrors).length > 0) {
          const errorMessage = `Row ${index + 1}: ${JSON.stringify(
            validationErrors
          )}`;
          errors.push(errorMessage);
        } else {
          validData.push({
            ...record,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });

      if (errors.length > 0) {
        errors.forEach((error) => console.error(error));
        setUploadErrors(errors);
        toast.error(
          `Validation Errors found in rows: ${errors
            .map((err) => err.split(":")[0])
            .join(", ")}`
        );
      }

      // Upload valid records
      if (validData.length > 0) {
        for (const data of validData) {
          try {
            await axios.post(`${BASE_URL}/${uploadType}`, data, {
              headers: { "Content-Type": "application/json" },
            });
          } catch (error) {
            console.error(
              `Failed to upload record: ${JSON.stringify(data)}. Error: ${
                error.message
              }`
            );
          }
        }
        toast.success(
          `Successfully uploaded ${validData.length} valid records!`
        );
      } else {
        toast.warn("No valid records to upload.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to process the file due to a server error.";
      toast.error(`Upload failed: ${errorMessage}`);
      console.error("File processing error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async (templateName) => {
    try {
      // Fetch the CSV template from the public/templates directory
      const response = await fetch(`/templates/${templateName}.csv`);

      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }

      const csvData = await response.text();
      if (!csvData || csvData.trim().length === 0) {
        throw new Error("Template is empty or invalid.");
      }

      // Create a Blob from the CSV string, ensuring proper MIME type for CSV
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      // Save the CSV file using FileSaver.js
      saveAs(blob, `${templateName}-template.csv`);

      // Show a success notification
      toast.success(`${templateName} template downloaded successfully!`);
    } catch (error) {
      console.error("Template download error:", error);
      toast.error(
        `Failed to download ${templateName} template: ${error.message}`
      );
    }
  };

  const handleDownload = async (dataType, isTemplate = false) => {
    const endpoint = isTemplate
      ? `${BASE_URL}/template/${dataType}`
      : `${BASE_URL}/${dataType}`;

    try {
      const response = await axios.get(endpoint);

      if (!Array.isArray(response.data)) {
        throw new Error("Fetched data is not in the expected format (array).");
      }

      const csv = Papa.unparse(response.data);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const fileName = isTemplate
        ? `${dataType}-template.csv`
        : `${dataType}.csv`;

      saveAs(blob, fileName);
      toast.success(`Downloaded ${fileName} successfully!`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${dataType}: ${error.message}`);
    }
  };

  const handleUploadClick = (type) => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        File Handling
      </h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setVisibleSection("upload")}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-700 hover:shadow-xl transition-all w-full sm:w-auto"
        >
          Upload Data
        </button>
        <button
          onClick={() => setVisibleSection("downloadTemplate")}
          className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-purple-500 hover:to-purple-700 hover:shadow-xl transition-all w-full sm:w-auto"
        >
          Download Template
        </button>
        <button
          onClick={() => setVisibleSection("downloadData")}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 hover:shadow-xl transition-all w-full sm:w-auto"
        >
          Download Data
        </button>
      </div>
      {visibleSection === "upload" && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, .json, .xlsx, .xls"
            className="hidden"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {["items", "bom"].map((type) => (
              <button
                key={type}
                onClick={() => handleUploadClick(type)}
                disabled={isUploading}
                className={`${
                  isUploading && uploadType === type
                    ? "bg-gray-300 text-gray-600"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                } p-4 rounded-lg`}
              >
                Upload {type.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
          {uploadErrors.length > 0 && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
              <h3 className="font-semibold">Upload Errors</h3>
              <ul className="list-disc pl-5">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {visibleSection === "downloadTemplate" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Download Template</h3>
          <button
            onClick={() => handleDownloadTemplate("items")}
            className="bg-blue-500 text-white p-4 rounded-lg w-full sm:w-auto mb-4 mr-2"
          >
            Download Item Template
          </button>
          <button
            onClick={() => handleDownloadTemplate("bom")}
            className="bg-green-500 text-white p-4 rounded-lg w-full sm:w-auto"
          >
            Download BOM Template
          </button>
        </div>
      )}
      {visibleSection === "downloadData" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Download Data</h3>
          <button
            onClick={() => handleDownload("items")}
            className="bg-blue-500 text-white p-4 rounded-lg w-full sm:w-auto mb-4 mr-4"
          >
            Download Items
          </button>
          <button
            onClick={() => handleDownload("bom")}
            className="bg-green-500 text-white p-4 rounded-lg w-full sm:w-auto mb-4"
          >
            Download BOM
          </button>
        </div>
      )}
    </div>
  );
};

export default FileHandler;
