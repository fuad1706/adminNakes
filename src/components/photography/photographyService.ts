import type { HeroImage } from "../../types";
import type { FormValues } from "./PhotographyImageForm";
import { getAuthToken } from "../../utils/auth";
import axios from "axios";

const BASE_URL = "https://nakestudios-be.vercel.app";

const cloudinaryAxios = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1",
});

interface ImageSubmitParams {
  formData: FormValues;
  editingImage: HeroImage | null;
  images: HeroImage[];
  setImages: React.Dispatch<React.SetStateAction<HeroImage[]>>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
  resetForm: () => void;
  fetchImages: () => Promise<void>;
}

interface ImageDeleteParams {
  imageId: string;
  images: HeroImage[];
  setImages: React.Dispatch<React.SetStateAction<HeroImage[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
  fetchImages: () => Promise<void>;
}

interface ImageReorderParams {
  imageId: string;
  direction: "up" | "down";
  images: HeroImage[];
  setImages: React.Dispatch<React.SetStateAction<HeroImage[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
  fetchImages: () => Promise<void>;
}

// Upload an image to Cloudinary
async function uploadToCloudinary(file: File, folder: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  console.log(`Fetching upload signature for ${folder}...`);
  const signatureResponse = await axios.get(
    `${BASE_URL}/api/photography/admin/upload-signature`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { folder },
    }
  );

  const {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder: responseFolder,
  } = signatureResponse.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", responseFolder);

  console.log(`Uploading image to Cloudinary...`);
  const uploadResponse = await cloudinaryAxios.post(
    `/${cloudName}/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return {
    public_id: uploadResponse.data.public_id,
    url: uploadResponse.data.secure_url,
  };
}

// Handle image submission (create or edit)
export async function handleImageSubmit({
  formData,
  editingImage,
  images,
  setImages,
  showNotification,
  resetForm,
  fetchImages,
}: ImageSubmitParams) {
  const token = getAuthToken();
  console.log("Auth token:", token ? "[REDACTED]" : "None");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  console.log("Form data:", {
    order: formData.order,
    isActive: formData.isActive,
    imageFile: formData.imageFile ? "[File]" : null,
  });

  if (!editingImage && !formData.imageFile) {
    throw new Error("Image file is required for new images.");
  }

  const payload: any = {
    order: formData.order,
    isActive: formData.isActive,
  };

  if (formData.imageFile) {
    try {
      const imageData = await uploadToCloudinary(
        formData.imageFile,
        "nakestudios/photography"
      );
      payload.image = imageData;
    } catch (imageError) {
      console.error("Image upload failed:", imageError);
      throw new Error("Failed to upload image to Cloudinary");
    }
  } else if (editingImage) {
    payload.image = {
      public_id: editingImage.public_id || "",
      url: editingImage.url || "",
    };
  }

  if (!editingImage && (!payload.image?.public_id || !payload.image?.url)) {
    console.error("Missing image metadata in payload");
    throw new Error("Image metadata required");
  }

  console.log("Final payload to backend:", JSON.stringify(payload, null, 2));

  if (editingImage && editingImage._id) {
    console.log(`Updating image with ID: ${editingImage._id}`);
    const response = await axios.put(
      `${BASE_URL}/api/photography/admin/${editingImage._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Update response:", response.data);

    if (!response.data.image) {
      console.error("Updated image not found in response");
      throw new Error("Invalid response from server");
    }

    setImages(
      images.map((img) =>
        img._id === editingImage._id ? response.data.image : img
      )
    );
    showNotification("success", "Image successfully updated!");
  } else {
    console.log("Creating new image...");
    const response = await axios.post(
      `${BASE_URL}/api/photography/admin`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Create response:", response.data);

    setImages([...images, response.data.image]);
    showNotification("success", "New image successfully uploaded!");
  }

  resetForm();
  await fetchImages();
}

// Handle image deletion
export async function handleImageDelete({
  imageId,
  images,
  setImages,
  setError,
  showNotification,
  fetchImages,
}: ImageDeleteParams) {
  const token = getAuthToken();
  console.log("Delete token:", token ? "[REDACTED]" : "None");
  if (!token) {
    setError("No authentication token found. Please log in.");
    showNotification("error", "Please log in to continue.");
    return;
  }

  if (!imageId) {
    setError("Cannot delete: Invalid image ID");
    showNotification("error", "Cannot delete: Invalid image ID");
    return;
  }

  console.log(`Deleting image with ID: ${imageId}`);
  const response = await axios.delete(
    `${BASE_URL}/api/photography/admin/${imageId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  console.log("Delete response:", response.data);

  setImages(images.filter((img) => img._id !== imageId));
  showNotification("success", "Image successfully deleted!");
  await fetchImages();
}

// Handle image reordering
export async function handleImageReorder({
  imageId,
  direction,
  images,
  setImages,
  setError,
  showNotification,
}: ImageReorderParams) {
  const token = getAuthToken();
  console.log("Reorder token:", token ? "[REDACTED]" : "None");
  if (!token) {
    setError("No authentication token found. Please log in.");
    showNotification("error", "Please log in to continue.");
    return;
  }

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

  const orderData = newImages.map((img, idx) => ({
    id: img._id,
    order: idx,
  }));

  console.log("Reordering images with data:", orderData);
  const response = await axios.put(
    `${BASE_URL}/api/photography/reorder`,
    { orderData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("Reorder response:", response.data);
  setImages(response.data.images);
  showNotification("success", "Images successfully reordered!");
}
