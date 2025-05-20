// src/components/icre8/Icre8ImageForm.tsx
import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { HeroImage } from "../../types";

interface Icre8ImageFormProps {
  editingImage: HeroImage | null;
  loading: boolean;
  onSubmit: (e: FormEvent, formData: FormValues) => void;
  onCancel: () => void;
}

export interface FormValues {
  imageFile: File | null;
  order: string;
  isActive: boolean;
}

const Icre8ImageForm: React.FC<Icre8ImageFormProps> = ({
  editingImage,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormValues>({
    imageFile: null,
    order: editingImage ? editingImage.order.toString() : "0",
    isActive: editingImage ? editingImage.isActive : true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editingImage) {
      setFormData({
        imageFile: null,
        order: editingImage.order.toString(),
        isActive: editingImage.isActive,
      });
      setPreviewUrl(editingImage.url);
    } else {
      setFormData({
        imageFile: null,
        order: "0",
        isActive: true,
      });
      setPreviewUrl(null);
    }
    setFormError(null);
  }, [editingImage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files && files.length > 0) {
      // Create URL for preview
      if (previewUrl && previewUrl !== editingImage?.url) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(newPreviewUrl);
      setFormData({ ...formData, imageFile: files[0] });
      setFormError(null);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
      setFormError(null);
    }
  };

  const validateForm = (): boolean => {
    // When creating a new image, file is required
    if (!editingImage && !formData.imageFile) {
      setFormError("Image file is required for new images");
      return false;
    }

    // Order is always required
    if (!formData.order.trim()) {
      setFormError("Order field is required");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e, formData);
    }
  };

  // Clean up any object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== editingImage?.url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, editingImage]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6" id="image-form">
      <h2 className="text-xl font-semibold mb-4">
        {editingImage ? "Edit Image" : "Add New Image"}
      </h2>
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image {!editingImage && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {editingImage && (
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to keep the current image
            </p>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-32 object-contain border border-gray-300 rounded"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter order number"
            required
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-400 text-gray-900 rounded-md cursor-pointer hover:bg-amber-500 transition-colors flex items-center justify-center min-w-[120px]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : editingImage ? (
              "Update Image"
            ) : (
              "Add Image"
            )}
          </button>
          {editingImage && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Icre8ImageForm;
