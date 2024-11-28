import React, { useState } from "react";

const BulkDataManagement = () => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file.name);
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bulk Data Management</h1>
      <input type="file" onChange={handleFileUpload} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default BulkDataManagement;
