import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { HeroImage } from "../../types";
import HeroImageForm from "./HeroImageForm";
import type { FormValues } from "./HeroImageForm";
import HeroImageGrid from "./HeroImageGrid";
import ErrorAlert from "../ErrorAlert";
import { getAuthToken } from "../../utils/auth";

const BASE_URL = "https://nakestudios-be.vercel.app";

interface HeroTabProps {
  showNotification: (type: "success" | "error" | null, message: string) => void;
}

const HeroTab: React.FC<HeroTabProps> = ({ showNotification }) => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const publicResponse = await fetch(`${BASE_URL}/api/hero`);
      if (!publicResponse.ok) {
        throw new Error(
          `Public endpoint failed with status: ${publicResponse.status}`
        );
      }
      const publicData = await publicResponse.json();

      const token = getAuthToken();
      if (!token) {
        setError("No authentication token found. Please log in.");
        setImages(publicData.images || []);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/hero/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Admin endpoint failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      setImages(data.images || []);
      setError(null);
    } catch (error: any) {
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
    if (formData.imageFile) form.append("image", formData.imageFile);
    form.append("order", formData.order);
    form.append("isActive", formData.isActive.toString());

    try {
      if (editingImage && editingImage._id) {
        const response = await fetch(
          `${BASE_URL}/api/hero/${editingImage._id}`,
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
          throw new Error(`Update failed with status: ${response.status}`);
        }

        const data = await response.json();
        setImages(
          images.map((img) => (img._id === editingImage._id ? data.image : img))
        );
        resetForm();
        showNotification("success", "Image successfully updated!");
      } else {
        const response = await fetch(`${BASE_URL}/api/hero`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: form,
        });
        if (!response.ok) {
          throw new Error(`Create failed with status: ${response.status}`);
        }

        const data = await response.json();
        setImages([...images, data.image]);
        resetForm();
        showNotification("success", "New image successfully uploaded!");
      }
    } catch (error: any) {
      setError(error.message || "Failed to submit form");
      showNotification("error", "Failed to save image");
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
    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    // Validate that we have a valid ID before making the request
    if (!imageId) {
      setError("Cannot delete: Invalid image ID");
      showNotification("error", "Cannot delete: Invalid image ID");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/hero/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });
      if (response.ok) {
        setImages(images.filter((img) => img._id !== imageId));
        showNotification("success", "Image successfully deleted!");
      } else {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete image");
      showNotification("error", "Failed to delete image");
    }
  };

  const handleReorder = async (imageId: string, direction: "up" | "down") => {
    const token = getAuthToken();
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    // Validate we have a valid imageId
    if (!imageId) {
      setError("Cannot reorder: Invalid image ID");
      showNotification("error", "Cannot reorder: Invalid image ID");
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
      // First, check if the reorder endpoint exists or use individual updates as fallback
      const isReorderEndpointAvailable = false; // Set this based on API capability

      if (isReorderEndpointAvailable) {
        // Try the bulk reorder endpoint first
        const response = await fetch(`${BASE_URL}/api/hero/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: JSON.stringify({ orderData }),
        });

        if (response.ok) {
          setImages(updatedImages);
          showNotification("success", "Images successfully reordered!");
        } else {
          throw new Error(`Reorder failed with status: ${response.status}`);
        }
      } else {
        // Fallback: Update the two swapped images individually
        const [img1, img2] = [updatedImages[index], updatedImages[newIndex]];

        // Only update the two images that were swapped
        const form1 = new FormData();
        form1.append("order", img1.order.toString());
        form1.append("isActive", img1.isActive.toString());

        const form2 = new FormData();
        form2.append("order", img2.order.toString());
        form2.append("isActive", img2.isActive.toString());

        const update1 = fetch(`${BASE_URL}/api/hero/${img1._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: form1,
        });

        const update2 = fetch(`${BASE_URL}/api/hero/${img2._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: form2,
        });

        const results = await Promise.all([update1, update2]);

        if (results[0].ok && results[1].ok) {
          // Only update the UI if both updates succeeded
          setImages(updatedImages);
          showNotification("success", "Images successfully reordered!");
        } else {
          throw new Error("Failed to update image orders");
        }
      }
    } catch (error: any) {
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
      <HeroImageForm
        editingImage={editingImage}
        loading={loading}
        onSubmit={handleFormSubmit}
        onCancel={resetForm}
      />
      <HeroImageGrid
        images={images}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </>
  );
};

export default HeroTab;
