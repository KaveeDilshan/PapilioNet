import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import Gallery from "./components/Gallery";
import Quiz from "./components/Quiz";
import logo from "./images/logo.ico";
import { Link } from "react-scroll";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "gallery", "predict", "quiz", "contact"];
      let currentSection = "home";

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 3) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gradient-to-r from-blue-100 to-green-200 text-gray-900"}>
      
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg fixed w-full z-50 transition-all">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-center">
            <img src={logo} alt="PapilioNet Logo" className="h-10 w-10 mr-3" />
            <h1 className="text-2xl font-bold">PapilioNet</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              {["home", "about", "gallery", "predict", "quiz", "contact"].map((section) => (
                <li key={section}>
                  <Link
                    to={section}
                    smooth={true}
                    duration={500}
                    className={`cursor-pointer hover:underline transition-all ${
                      activeSection === section ? "font-bold text-yellow-300" : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-all"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      {/* Home Section */}
      <section id="home" className="pt-20 pb-12 text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">Welcome to PapilioNet</h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto">
          🌿 Discover, Identify, and Learn About Butterflies in Sri Lanka.  
          This AI-powered web app helps you <b>identify butterfly species</b> by analyzing images.
        </p>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white shadow-lg rounded-2xl p-8 mx-auto max-w-4xl mt-6">
        <h2 className="text-3xl font-semibold text-blue-600 text-center mb-4">Why Use PapilioNet?</h2>
        <ul className="text-left text-gray-600 space-y-3">
          <li>✅ <strong>Fast and Accurate</strong> - Uses AI to classify butterfly species.</li>
          <li>✅ <strong>Advanced Image Processing</strong> - Enhances image quality for better recognition.</li>
          <li>✅ <strong>Educational & Interactive</strong> - Learn about Sri Lankan butterfly species.</li>
          <li>✅ <strong>Supports Multiple Images</strong> - Upload multiple images for batch processing.</li>
        </ul>
      </section>
      <br />

      {/* Gallery Section */}
      <section id="gallery">
        <Gallery />
      </section>

      {/* "Did You Know" Section with Interactive Facts */}
      <section className="bg-yellow-200 p-6 mt-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">🦋 Did You Know?</h2>
        <div className="mt-4 text-lg text-gray-700 space-y-5 max-w-4xl mx-auto">
          {[
            "Sri Lanka is home to over 245 species of butterflies, with 23 species found nowhere else in the world!",
            "Butterflies play a vital role in pollination, helping plants reproduce and maintain biodiversity.",
            "The Sri Lankan Birdwing (Troides darsius) has vibrant golden-yellow and black wings, making it one of the largest butterflies in Sri Lanka.",
            "The Common Jezebel (Delias eucharis) is a master of camouflage! Its bright colors warn predators that it’s poisonous.",
            "The Tree Nymph (Idea iasonia) has a slow, floating flight pattern, making it look like a piece of paper drifting in the wind.",
            "Did you know that butterflies can predict the weather? Many species seek shelter before a storm.",
          ].map((fact, index) => (
            <p key={index} className="hover:scale-105 transition-all cursor-pointer">{fact}</p>
          ))}
        </div>
      </section>

      {/* Prediction Section */}
      <section id="predict" className="bg-white shadow-lg rounded-2xl p-8 mx-auto max-w-4xl mt-6">
        <h2 className="text-3xl font-semibold text-blue-600 text-center mb-4">How It Works?</h2>
        <ol className="text-left text-gray-600 list-decimal list-inside space-y-2">
          <li>🖼️ <strong>Upload</strong> a butterfly image.</li>
          <li>📊 <strong>AI Analyzes</strong> the image.</li>
          <li>🔎 <strong>View</strong> the prediction & confidence score.</li>
          <li>📖 <strong>Explore</strong> species info & similar species.</li>
        </ol>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 text-center">Upload Your Butterfly Image Below</h2>
          <FileUpload />
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="bg-yellow-100 py-10 mt-8">
        <Quiz />
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-blue-600 text-white py-10 text-center mt-8">
        <h2 className="text-3xl font-semibold">📩 Get in Touch</h2>
        <p className="text-lg mt-3">For queries, contact us at <strong>papilionet@support.com</strong></p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>© 2025 PapilioNet - All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
