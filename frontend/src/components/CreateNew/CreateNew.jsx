import React, { useState, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";
import "./CreateNew.css";
import data from "../../data.json"

const CreateNew = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    category: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    file: "",
  });
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    file: false,
  });

  const handleClose = () => {
    setStep(1);
    setFormData({
      title: "",
      description: "",
      file: null,
      category: "",
    });
    setErrors({
      title: "",
      description: "",
      file: "",
    });
    setTouched({
      title: false,
      description: false,
      file: false,
    });
    onClose();
  };

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return !value.trim() ? "Title is required" : "";
      case "description":
        return !value.trim() ? "Description is required" : "";
      case "file":
        return !value ? "Please upload a file" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, formData[fieldName]),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setTouched((prev) => ({ ...prev, file: true }));

    if (!file) {
      setErrors((prev) => ({ ...prev, file: "Please select a file" }));
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.type.startsWith("image/") &&
      file.size > 5 * 1024 * 1024
    ) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF and image files up to 5MB are allowed",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {
      title: validateField("title", formData.title),
      description: validateField("description", formData.description),
      file: validateField("file", formData.file),
    };

    setErrors(newErrors);
    setTouched({
      title: true,
      description: true,
      file: true,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const createCard = async () => {
    try {
      const cardData = {
        id: Math.floor(Math.random() * 1000), // Generate random integer
        title: formData.title,
        description: formData.description,
        category: formData.category,
        link: `/${formData.category.toLowerCase()}`
      };

      const response = await fetch("http://localhost:8005/create-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        throw new Error("Failed to create card");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      alert("Please select a category");
      return;
    }
  
    if (!formData.file) {
      alert("Please select a file to upload");
      return;
    }
  
    try {
      // First upload the file
      const fileData = new FormData();
      fileData.append("file", formData.file);
      fileData.append("title", formData.title);
      fileData.append("description", formData.description);
  
      const fileUploadResponse = await fetch("http://localhost:8005/upload-single-doc", {
        method: "POST",
        body: fileData,
      });
  
      if (!fileUploadResponse.ok) {
        const error = await fileUploadResponse.json();
        throw new Error(`Failed to upload file: ${JSON.stringify(error)}`);
      }

      // Then create the card
      const cardResponse = await createCard();
      console.log("Card created successfully:", cardResponse);
      
      // Close the modal and reset form
      handleClose();
      // Optionally refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the card. Please try again.");
    }
  };

  const ErrorMessage = ({ message }) =>
    message ? (
      <div className="error-message">
        <span>{message}</span>
      </div>
    ) : null;

  if (!isOpen) return null;
  return (
    <div className="model-overlay">
      <div className="model-content">
        <div className="model-header">
          <h2 className="model-title">Describe about your topic</h2>
          <button onClick={handleClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        {step === 1 ? (
          <div className="form-container">
            <div className="form-group">
              <input
                type="text"
                name="title"
                placeholder="Title"
                className={`input-field ${touched.title && errors.title ? "error" : ""}`}
                value={formData.title}
                onChange={handleInputChange}
                onBlur={() => handleBlur("title")}
              />
              <ErrorMessage message={touched.title && errors.title} />
            </div>

            <div className="form-group">
              <textarea
                name="description"
                placeholder="Description"
                className={`input-field ${touched.description && errors.description ? "error" : ""}`}
                style={{ height: "120px", resize: "none" }}
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur("description")}
              />
              <ErrorMessage message={touched.description && errors.description} />
            </div>

            <div className="form-group">
              <div className="file-upload-container">
                <label
                  className={`file-upload-button ${touched.file && errors.file ? "error" : ""}`}
                >
                  <Upload size={20} />
                  Upload File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf, image/*"
                  />
                </label>
                <span className="file-name">
                  {formData.file ? formData.file.name : "Upload PDF or image file (max 5MB)"}
                </span>
              </div>
              <ErrorMessage message={touched.file && errors.file} />
            </div>

            <div className="form-actions">
              <button
                onClick={handleNext}
                className={`action-button ${Object.values(errors).some((error) => error) ? "disabled" : ""}`}
                disabled={Object.values(errors).some((error) => error)}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text font-semibold">Categories</h3>
            <div className="category-grid">
              {data.categories.map((category) => (
                <label key={category} className="category-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={formData.category === category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="form-radio"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            <div className="form-actions">
              <button
                onClick={handleSubmit}
                className="action-button create-button"
                style={{ marginTop: "1rem" }}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNew;