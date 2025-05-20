// src/components/hero/HeroImageForm.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import type { HeroImage } from "../../types";

interface HeroImageFormProps {
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

const HeroImageForm: React.FC<HeroImageFormProps> = ({
  editingImage,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormValues>({
    imageFile: null,
    order: editingImage ? editingImage.order.toString() : "",
    isActive: editingImage ? editingImage.isActive : true,
  });

  React.useEffect(() => {
    if (editingImage) {
      setFormData({
        imageFile: null,
        order: editingImage.order.toString(),
        isActive: editingImage.isActive,
      });
    } else {
      setFormData({
        imageFile: null,
        order: "",
        isActive: true,
      });
    }
  }, [editingImage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files) {
      setFormData({ ...formData, imageFile: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6" id="image-form">
      <h2 className="text-xl font-semibold mb-4">
        {editingImage ? "Edit Hero Image" : "Add New Hero Image"}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter order number"
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
            onClick={(e) => onSubmit(e, formData)}
            disabled={loading}
            className="px-4 py-2 bg-amber-400 text-gray-900 rounded-md hover:bg-amber-500 transition-colors flex items-center justify-center min-w-[120px]"
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
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroImageForm;
