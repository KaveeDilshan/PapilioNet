import React from "react";

import common_tiger_butterfly from "../images/common-tiger-butterfly.jpg";
import jezebel from "../images/jezebel.jpg";
import crimsonRose from "../images/crimson-rose.jpg";

const butterflySpecies = [
  { name: "Common Tiger Butterfly", img: common_tiger_butterfly, fact: "Moderately fast but careless flight." },
  { name: "Common Jezebel", img: jezebel, fact: "Its bright colors warn predators of toxicity." },
  { name: "Crimson Rose", img: crimsonRose, fact: "Known for its long migrations." },
];

function Gallery() {
  return (
    <section className="bg-gray-100 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700">🦋 Sri Lankan Butterflies</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
        {butterflySpecies.map((butterfly, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded-lg text-center">
            <img src={butterfly.img} alt={butterfly.name} className="rounded-lg mx-auto h-48 w-auto"/>
            <h3 className="text-xl font-semibold mt-4">{butterfly.name}</h3>
            <p className="text-gray-600 mt-2">{butterfly.fact}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
