import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { HeroImage } from "../../types";
import Icre8ImageForm from "./Icre8ImageForm";
import type { FormValues } from "./Icre8ImageForm";
import Icre8ImageGrid from "./Icre8ImageGrid";
import ErrorAlert from "../ErrorAlert";
import { getAuthToken } from "../../utils/auth";

const BASE_URL = "https://nakestudios-be.vercel.app";

interface Icre8TabProps {
  showNotification: (type: "success" | "error" | null, message: string) => void;
}

const Icre8Tab: React.FC<Icre8TabProps> = ({ showNotification }) => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError("No authentication token found. Please log in.");

        // Still fetch public images if no token
        const publicResponse = await fetch(`${BASE_URL}/api/icre8`);
        if (publicResponse.ok) {
          const publicData = await publicResponse.json();
          setImages(publicData.images || []);
        }
        return;
      }

      // Try to fetch with admin endpoint first
      try {
        const response = await fetch(`${BASE_URL}/api/icre8/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setImages(data.images || []);
          setError(null);
          return;
        }
      } catch (adminError) {
        console.error("Admin endpoint failed:", adminError);
        // Fall back to public endpoint if admin fails
      }

      // Fallback to public endpoint
      const publicResponse = await fetch(`${BASE_URL}/api/icre8`);
      if (!publicResponse.ok) {
        throw new Error(`Failed to fetch images: ${publicResponse.status}`);
      }
      const publicData = await publicResponse.json();
      setImages(publicData.images || []);
    } catch (error: any) {
      console.error("Error fetching images:", error);
      setError(error.message || "Failed to fetch images");
    }
  };

  const handleFormSubmit = async (e: FormEvent, formData: FormValues) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    const form = new FormData();

    // Only append image if it exists
    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }

    form.append("order", formData.order);
    form.append("isActive", formData.isActive.toString());

    try {
      if (editingImage && editingImage._id) {
        console.log(`Updating image with ID: ${editingImage._id}`);

        const response = await fetch(
          `${BASE_URL}/api/icre8/${editingImage._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "x-auth-token": token,
            },
            body: form,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.message ||
            `Update failed with status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setImages(
          images.map((img) => (img._id === editingImage._id ? data.image : img))
        );
        resetForm();
        showNotification("success", "Image successfully updated!");
      } else {
        // New image upload - ensure we have a file
        if (!formData.imageFile) {
          throw new Error("Please select an image file to upload");
        }

        const response = await fetch(`${BASE_URL}/api/icre8`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: form,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.message ||
            `Create failed with status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setImages([...images, data.image]);
        resetForm();
        showNotification("success", "New image successfully uploaded!");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setError(error.message || "Failed to submit form");
      showNotification("error", error.message || "Failed to save image");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image);

    // Scroll to form when editing
    const formElement = document.getElementById("image-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!imageId) {
      setError("Cannot delete: Invalid image ID");
      showNotification("error", "Cannot delete: Invalid image ID");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/icre8/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `Delete failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      setImages(images.filter((img) => img._id !== imageId));
      showNotification("success", "Image successfully deleted!");

      // If we were editing this image, clear the form
      if (editingImage && editingImage._id === imageId) {
        resetForm();
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      setError(error.message || "Failed to delete image");
      showNotification("error", error.message || "Failed to delete image");
    }
  };

  const handleReorder = async (imageId: string, direction: "up" | "down") => {
    if (!imageId) {
      setError("Cannot reorder: Invalid image ID");
      showNotification("error", "Cannot reorder: Invalid image ID");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    const index = images.findIndex((img) => img._id === imageId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];

    // Update the orders in the new array
    const updatedImages = newImages.map((img, idx) => ({
      ...img,
      order: idx,
    }));

    // Create the order data with validated IDs
    const orderData = updatedImages.map((img, idx) => ({
      id: img._id,
      order: idx,
    }));

    try {
      // Update the UI optimistically
      setImages(updatedImages);

      // Try the bulk reorder endpoint first
      const response = await fetch(`${BASE_URL}/api/icre8/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
        body: JSON.stringify({ orderData }),
      });

      if (response.ok) {
        showNotification("success", "Images successfully reordered!");
      } else {
        // Fallback to updating individual images
        const [img1, img2] = [updatedImages[index], updatedImages[newIndex]];

        const form1 = new FormData();
        form1.append("order", img1.order.toString());
        form1.append("isActive", img1.isActive.toString());

        const form2 = new FormData();
        form2.append("order", img2.order.toString());
        form2.append("isActive", img2.isActive.toString());

        const update1 = fetch(`${BASE_URL}/api/icre8/${img1._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: form1,
        });

        const update2 = fetch(`${BASE_URL}/api/icre8/${img2._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: form2,
        });

        await Promise.all([update1, update2]);
        showNotification("success", "Images successfully reordered!");
      }
    } catch (error: any) {
      console.error("Error reordering images:", error);
      setError(error.message || "Failed to reorder images");
      showNotification("error", "Failed to reorder images");

      // Fetch images again to restore the correct order
      fetchImages();
    }
  };

  const resetForm = () => {
    setEditingImage(null);
  };

  return (
    <>
      <ErrorAlert error={error} />
      <Icre8ImageForm
        editingImage={editingImage}
        loading={loading}
        onSubmit={handleFormSubmit}
        onCancel={resetForm}
      />
      <Icre8ImageGrid
        images={images}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </>
  );
};

export default Icre8Tab;
