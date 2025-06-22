import React from "react";

function ResultCard({ result }) {
  return (
    <div className="p-4 mb-4 bg-gray-50 rounded shadow">
      {result.error ? (
        <p className="text-red-500">{result.error}</p>
      ) : (
        <>
          <img
            src={result.uploaded_image_url}
            alt="Uploaded"
            className="w-full h-88 object-cover rounded mb-4"
          />
          <p><strong>Species Name:</strong> {result.species_name}</p>
          <p><strong>Scientific Name:</strong> {result.scientific_name}</p>
          <p><strong>Taxonomy:</strong> {result.taxonomy}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p className="mt-4"><strong>Top 3 Similar Species:</strong></p>
          <ul className="list-disc ml-6">
            {result.similar_species.map((species, idx) => (
              <li key={idx}>
                {species.species_name} - {species.confidence}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ResultCard;
