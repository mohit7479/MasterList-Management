import React, { useRef, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // For handling Excel files

const BASE_URL = "https://api-assignment.inveesync.in";

const FileHandler = () => {
  const fileInputRef = useRef(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [visibleSection, setVisibleSection] = useState("");

  const handleFileUpload = async (event) => {
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
      let parsedData = [];

      if (fileExtension === "csv") {
        const text = await file.text();
        const result = Papa.parse(text, { header: true });
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

      // Add createdAt and updatedAt fields and sanitize data
      const enrichedData = parsedData.map((record) => {
        return {
          ...record,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Sanitize integer fields (replace "" with null or parse to an integer)
          quantity:
            record.quantity === "" ? null : parseInt(record.quantity, 10),
          price: record.price === "" ? null : parseFloat(record.price),
          // Add more fields as needed
        };
      });

      // Send each record to the API
      for (const data of enrichedData) {
        await axios.post(`${BASE_URL}/${uploadType}`, data, {
          headers: { "Content-Type": "application/json" },
        });
      }

      toast.success(`Successfully uploaded ${enrichedData.length} records!`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to upload due to a server error.";
      toast.error(`Failed to upload ${uploadType}: ${errorMessage}`);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async (templateName) => {
    try {
      const response = await axios.get(`/templates/${templateName}.json`, {
        responseType: "blob",
      });
      saveAs(response.data, `${templateName}-template.json`);
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
      const response = await axios.get(endpoint, { responseType: "blob" });
      const fileName = isTemplate
        ? `${dataType}-template.csv`
        : `${dataType}.csv`;
      saveAs(response.data, fileName);
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
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setVisibleSection("upload")}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-700 hover:shadow-xl transition-all"
        >
          Upload Data
        </button>
        <button
          onClick={() => setVisibleSection("downloadTemplate")}
          className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-purple-500 hover:to-purple-700 hover:shadow-xl transition-all"
        >
          Download Template
        </button>
        <button
          onClick={() => setVisibleSection("downloadData")}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 hover:shadow-xl transition-all"
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
          <div className="grid grid-cols-2 gap-4">
            {["items", "bom", "process", "process-step"].map((type) => (
              <button
                key={type}
                onClick={() => handleUploadClick(type)}
                disabled={isUploading}
                className={`${
                  isUploading && uploadType === type
                    ? "bg-gray-300 text-gray-600"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                } font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all`}
              >
                {isUploading && uploadType === type
                  ? `Uploading ${type}...`
                  : `Upload ${type}`}
              </button>
            ))}
          </div>
        </div>
      )}
      {visibleSection === "downloadTemplate" && (
        <div className="grid grid-cols-2 gap-4">
          {["items-master", "bom", "process", "process-item"].map((type) => (
            <button
              key={type}
              onClick={() => handleDownloadTemplate(type)}
              className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Download {type} Template
            </button>
          ))}
        </div>
      )}
      {visibleSection === "downloadData" && (
        <div className="grid grid-cols-2 gap-4">
          {["items", "bom", "process", "process-step"].map((type) => (
            <button
              key={type}
              onClick={() => handleDownload(type)}
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Download {type}
            </button>
          ))}
        </div>
      )}
      {uploadErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <h3 className="font-semibold">Upload Errors:</h3>
          <ul>
            {uploadErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileHandler;
