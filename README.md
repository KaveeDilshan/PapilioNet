🦋 PapilioNet – AI-Powered Butterfly Species Classifier

PapilioNet is a hybrid deep learning–based web platform built to classify butterfly species in Sri Lanka as a final year research project. 
This system uses an ensemble of EfficientNetB1 and ResNet50 with Squeeze-and-Excitation (SE) blocks to accurately identify butterfly species at the **species level**, not just genus or family level. 
It features an interactive web interface with real-time predictions, feedback mechanisms, and educational content.

---

📌 Features

- 🧠 **Ensemble Model** (EfficientNetB1 + ResNet50 with SE blocks)
- 🎯 **High Accuracy** (99%) across 30 species
- 📊 **Top-3 Similar Species** predictions with confidence scores
- 🖼️ **Multiple Image Uploads**
- 📋 **Educational Butterfly Quiz**
- 🔁 **User Feedback Loop** for model correction
- 🌐 **Responsive UI** with React + TailwindCSS
- 🧪 Built-in **augmentation and preprocessing** pipeline

---

## 🛠️ Tech Stack

| Layer          | Technology                                               |
|----------------|-----------------------------------------------------------|
| **Frontend**   | React, TailwindCSS, ScrollSpy                             |
| **Backend**    | Flask, Flask-CORS, TensorFlow, OpenCV, Pandas             |
| **Model**      | EfficientNetB1, ResNet50, SE Blocks, ImageDataGenerator   |
| **Data Source**| iNaturalist, Wikimedia Commons                            |
| **Deployment** | Localhost (Flask API + React UI)                          |
