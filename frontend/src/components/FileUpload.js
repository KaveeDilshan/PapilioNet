import React, { useState } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";
import Feedback from "./Feedback";

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setResults(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while processing your request.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-semibold text-blue-600">Upload Butterfly Images</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded ${
            loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload"}
        </button>
      </form>

      {/* Display Results */}
      <div className="mt-6">
        {results.length > 0 && results.map((result, idx) => (
          <div key={idx} className="mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
            <ResultCard result={result} />
            
            {/* ✅ Integrate Feedback Component Below Each Prediction */}
            <Feedback prediction={result} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
