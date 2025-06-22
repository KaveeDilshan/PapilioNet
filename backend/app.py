import os
import time
import json
import numpy as np
import pandas as pd
import tensorflow as tf
import cv2
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from uuid import uuid4

# Flask app setup
app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR = r"E:\FYP\backend"
MODEL_PATH = os.path.join(BASE_DIR, "finalHybridModel.keras")
CSV_PATH = os.path.join(BASE_DIR, "butterfly_species_info.csv")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
CLASS_INDICES_PATH = os.path.join(BASE_DIR, "class_indices.json")
FEEDBACK_PATH = os.path.join(BASE_DIR, "feedback.csv")

# Allowed File Extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
CONFIDENCE_THRESHOLD = 0.60  # Minimum confidence to classify as a butterfly

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB file size limit
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the trained model
try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load class indices mapping
try:
    with open(CLASS_INDICES_PATH, "r") as f:
        class_indices = json.load(f)
    index_to_species = {v: k for k, v in class_indices.items()}  # Reverse mapping
    print("Loaded class indices:", class_indices)
except Exception as e:
    print(f"Error loading class indices JSON: {e}")
    class_indices = {}

# Load species info CSV
try:
    species_info_df = pd.read_csv(CSV_PATH)
    species_info = {row["Species Name"]: row for _, row in species_info_df.iterrows()}
    print(f"Loaded {len(species_info)} species from CSV.")
except Exception as e:
    print(f"Error loading species info CSV: {e}")
    species_info = {}

# Validate allowed file types
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Preprocess image before prediction
def preprocess_image(image_path, img_height=224, img_width=224):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Invalid image file.")
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (img_height, img_width))
        return np.expand_dims(image / 255.0, axis=0)  # Normalize image
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {e}")

# Image Access Route
@app.route("/uploads/<filename>")
def serve_uploaded_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Prediction Route
@app.route("/predict", methods=["POST"])
def predict():
    if "files" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    top_n = int(request.form.get("top_n", 3))  # Default to top-3 similar species
    results = []

    for file in files:
        if not allowed_file(file.filename):
            return jsonify({"error": f"Invalid file type: {file.filename}"}), 400

        try:
            # Secure filename
            sanitized_filename = secure_filename(file.filename)
            unique_filename = f"{uuid4().hex}_{sanitized_filename}"
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
            file.save(file_path)

            # Measure inference time
            start_time = time.time()
            image = preprocess_image(file_path)
            predictions = model.predict(image)[0]  # Get raw prediction probabilities
            inference_time = round(time.time() - start_time, 3)

            # Get predicted class
            predicted_idx = np.argmax(predictions)
            confidence = float(np.max(predictions))

            # Confidence threshold for rejecting non-butterfly images
            if confidence < CONFIDENCE_THRESHOLD:
                print(f"❗ Rejected non-butterfly image: {file.filename} (Confidence: {confidence:.2f})")
                results.append({
                    "uploaded_image_url": f"http://127.0.0.1:5000/uploads/{unique_filename}",
                    "species_name": "Unknown",
                    "scientific_name": "N/A",
                    "taxonomy": "N/A",
                    "status": "N/A",
                    "confidence": f"{confidence * 100:.2f}%",
                    "similar_species": [],
                    "inference_time": f"{inference_time} sec",
                    "message": "No butterfly detected. Please upload a butterfly image."
                })
                continue  # Skip classification for this image

            # Ensure predicted index matches class label mapping
            predicted_species = index_to_species.get(predicted_idx, "Unknown")
            species_data = species_info.get(predicted_species, {
                "Species Name": "Unknown",
                "Scientific Name": "N/A",
                "Taxonomy": "N/A",
                "Status": "N/A"
            })

            # Getting top-N similar species dynamically
            sorted_indices = np.argsort(predictions)[-top_n:][::-1]  # Getting top-N indices
            similar_species = [
                {
                    "species_name": index_to_species.get(idx, "Unknown"),
                    "confidence": f"{predictions[idx] * 100:.2f}%"
                }
                for idx in sorted_indices if idx in index_to_species
            ]

            # Append result
            results.append({
                "uploaded_image_url": f"http://127.0.0.1:5000/uploads/{unique_filename}",
                "species_name": species_data["Species Name"],
                "scientific_name": species_data["Scientific Name"],
                "taxonomy": species_data["Taxonomy"],
                "status": species_data["Status"],
                "confidence": f"{confidence * 100:.2f}%",
                "similar_species": similar_species,
                "inference_time": f"{inference_time} sec",
            })

        except Exception as e:
            results.append({"error": f"Error processing file {file.filename}: {str(e)}"})

    return jsonify(results), 200

# Quiz Score API
@app.route('/api/quiz-result', methods=['POST'])
def quiz_result():
    data = request.get_json()
    print("Quiz Score:", data)
    # Save to DB
    return jsonify({"message": "Score received!"}), 200

# Feedback Route
@app.route("/feedback", methods=["POST"])
def submit_feedback():
    try:
        data = request.json
        original_species = data.get("originalSpecies", "Unknown")
        corrected_species = data.get("correctedSpecies", "Unknown")
        confidence = data.get("confidence", "N/A")

        if original_species == "Unknown" and corrected_species == "Unknown":
            return jsonify({"error": "Feedback must contain a valid species name"}), 400

        # Store feedback in CSV
        with open(FEEDBACK_PATH, "a") as f:
            f.write(f"{original_species},{corrected_species},{confidence}\n")

        return jsonify({"message": "Feedback received successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
