import React, { useState } from "react";
import "./mainpage.css";

function Application() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      setImageFile(null);
      setImageUrl(null);
      setPrediction(""); // Reset prediction when non-image file is uploaded
    } else {
      setError("");
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setPrediction(""); // Reset prediction when new image is uploaded
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      alert("Please upload an image file.");
      return;
    }

    try {
      const prediction = await predictDigit(imageFile);
      setPrediction(prediction);
      console.log("Predicted Digit:", prediction);
    } catch (error) {
      console.error(error);
      alert("An error occurred during prediction. Please try again.");
    }
  };

  const predictDigit = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const predictionResponse = await fetch(
        "https://banglahandwrittendigitrecognizationapi.azurewebsites.net/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!predictionResponse.ok) {
        throw new Error("Failed to predict digit. Please try again.");
      }

      const predictionData = await predictionResponse.json();
      const predictedDigit = predictionData;

      return predictedDigit;
    } catch (error) {
      throw new Error("An error occurred during prediction. Please try again.");
    }
  };

  return (
    <div className="Application">
      <h1>Bangla Handwritten Digit Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="imageFile">Upload image:</label>
        <input type="file" id="imageFile" onChange={handleImageChange} />
        {imageUrl && (
          <div className="image-preview">
            <img src={imageUrl} alt="Uploaded digit" />
          </div>
        )}
        <button type="submit">Predict Digit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {prediction && <p>Predicted Digit: {prediction}</p>}
    </div>
  );
}

export default Application;
