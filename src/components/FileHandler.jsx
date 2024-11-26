import React, { useRef, useState } from "react";
import { uploadCSV } from "../services/api";
import { toast } from "react-toastify";

const FileHandler = () => {
  const fileInputRef = useRef(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const response = await uploadCSV("items", file);
        toast.success(
          `Uploaded ${response.data.rowsProcessed} rows successfully`
        );
        if (response.data.errors.length > 0) {
          setUploadErrors(response.data.errors);
        } else {
          setUploadErrors([]);
        }
      } catch (error) {
        toast.error("Failed to upload file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDownload = (dataType) => {
    // This function remains the same as it doesn't interact with the API
    // You can keep the existing implementation
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">File Handling</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isUploading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
        {uploadErrors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-red-600">
              Upload Errors:
            </h3>
            <ul className="list-disc pl-5">
              {uploadErrors.map((error, index) => (
                <li key={index} className="text-red-500">
                  Row {error.row}: {error.error}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex space-x-4">
          <button
            onClick={() => handleDownload("items")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Items
          </button>
          <button
            onClick={() => handleDownload("boms")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Download BOMs
          </button>
          <button
            onClick={() => handleDownload("processes")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Processes
          </button>
          <button
            onClick={() => handleDownload("processSteps")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Process Steps
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileHandler;
