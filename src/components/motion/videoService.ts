// videoService.ts
import type { MotionVideo } from "../../types/index";
import type { FormValues } from "./MotionVideoForm";
import { getAuthToken } from "../../utils/auth";
import axios from "axios";

const BASE_URL = "https://nakestudios-be.vercel.app";

const cloudinaryAxios = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1",
});

interface VideoSubmitParams {
  formData: FormValues;
  editingVideo: MotionVideo | null;
  videos: MotionVideo[];
  setVideos: React.Dispatch<React.SetStateAction<MotionVideo[]>>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
  resetForm: () => void;
  fetchVideos: () => Promise<void>;
}

interface VideoDeleteParams {
  videoId: string;
  videos: MotionVideo[];
  setVideos: React.Dispatch<React.SetStateAction<MotionVideo[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
  fetchVideos: () => Promise<void>;
}

interface VideoReorderParams {
  videoId: string;
  direction: "up" | "down";
  videos: MotionVideo[];
  setVideos: React.Dispatch<React.SetStateAction<MotionVideo[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
  fetchVideos: () => Promise<void>;
}

// Upload a file to Cloudinary
async function uploadToCloudinary(file: File, folder: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  console.log(`Fetching upload signature for ${folder}...`);
  const signatureResponse = await axios.get(
    `${BASE_URL}/api/motion/admin/upload-signature`,
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

  const fileType = file.type.startsWith("video/") ? "video" : "image";

  console.log(`Uploading ${fileType} to Cloudinary...`);
  const uploadResponse = await cloudinaryAxios.post(
    `/${cloudName}/${fileType}/upload`,
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

// Handle video submission (create or edit)
export async function handleVideoSubmit({
  formData,
  editingVideo,
  videos,
  setVideos,
  showNotification,
  resetForm,
  fetchVideos,
}: VideoSubmitParams) {
  const token = getAuthToken();
  console.log("Auth token:", token ? "[REDACTED]" : "None");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  console.log("Form data:", {
    title: formData.title,
    order: formData.order,
    isActive: formData.isActive,
    videoFile: formData.videoFile ? "[File]" : null,
    thumbnailFile: formData.thumbnailFile ? "[File]" : null,
  });

  // Validate inputs for new videos
  if (!editingVideo && (!formData.videoFile || !formData.thumbnailFile)) {
    throw new Error("Video and thumbnail files are required for new videos.");
  }

  // Initialize payload with basic data
  const payload: any = {
    title: formData.title,
    order: formData.order,
    isActive: formData.isActive,
  };

  // For editing, pre-populate with existing values
  if (editingVideo) {
    // Only include video if we're uploading a new one or have an existing one
    if (formData.videoFile || (editingVideo.public_id && editingVideo.url)) {
      payload.video = {
        public_id: editingVideo.public_id || "",
        url: editingVideo.url || "",
      };
    }

    // Only include thumbnail if we're uploading a new one or have an existing one
    if (
      formData.thumbnailFile ||
      (editingVideo.thumbnail && editingVideo.thumbnail.public_id)
    ) {
      payload.thumbnail = {
        public_id: editingVideo.thumbnail?.public_id || "",
        url: editingVideo.thumbnail?.url || "",
      };
    }
  } else {
    // Initialize these properly for new videos
    payload.video = { public_id: "", url: "" };
    payload.thumbnail = { public_id: "", url: "" };
  }

  // Handle video upload if needed
  if (formData.videoFile) {
    try {
      const videoData = await uploadToCloudinary(
        formData.videoFile,
        "nakestudios/motion/videos"
      );
      payload.video = videoData;
    } catch (videoError) {
      console.error("Video upload failed:", videoError);
      throw new Error("Failed to upload video to Cloudinary");
    }
  }

  // Handle thumbnail upload if needed
  if (formData.thumbnailFile) {
    try {
      const thumbnailData = await uploadToCloudinary(
        formData.thumbnailFile,
        "nakestudios/motion/videos"
      );
      payload.thumbnail = thumbnailData;
    } catch (thumbnailError) {
      console.error("Thumbnail upload failed:", thumbnailError);
      throw new Error("Failed to upload thumbnail to Cloudinary");
    }
  }

  // Final validation
  if (!editingVideo) {
    // For new videos, ensure we have complete video and thumbnail data
    if (!payload.video.public_id || !payload.video.url) {
      console.error("Missing video metadata in payload");
      throw new Error("Video metadata required");
    }

    if (
      !payload.thumbnail ||
      !payload.thumbnail.public_id ||
      !payload.thumbnail.url
    ) {
      console.error("Missing thumbnail metadata in payload");
      throw new Error("Thumbnail metadata required");
    }
  }

  // Log complete payload before sending
  console.log("Final payload to backend:", JSON.stringify(payload, null, 2));

  // API request
  if (editingVideo && editingVideo._id) {
    console.log(`Updating video with ID: ${editingVideo._id}`);
    const response = await axios.put(
      `${BASE_URL}/api/motion/admin/${editingVideo._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Debug response
    console.log("Update response:", response.data);

    // Verify the updated video is returned
    if (!response.data.video) {
      console.error("Updated video not found in response");
      throw new Error("Invalid response from server");
    }

    // Update the videos array with the updated video
    setVideos(
      videos.map((vid) =>
        vid._id === editingVideo._id ? response.data.video : vid
      )
    );
    showNotification("success", "Video successfully updated!");
  } else {
    console.log("Creating new video...");
    const response = await axios.post(`${BASE_URL}/api/motion/admin`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Debug response
    console.log("Create response:", response.data);

    // Update videos array with new video
    setVideos([...videos, response.data.video]);
    showNotification("success", "New video successfully uploaded!");
  }

  resetForm();
  // Refetch videos to ensure state is consistent with backend
  await fetchVideos();
}

// Handle video deletion
export async function handleVideoDelete({
  videoId,
  videos,
  setVideos,
  setError,
  showNotification,
  fetchVideos,
}: VideoDeleteParams) {
  const token = getAuthToken();
  console.log("Delete token:", token ? "[REDACTED]" : "None");
  if (!token) {
    setError("No authentication token found. Please log in.");
    showNotification("error", "Please log in to continue.");
    return;
  }

  if (!videoId) {
    setError("Cannot delete: Invalid video ID");
    showNotification("error", "Cannot delete: Invalid video ID");
    return;
  }

  console.log(`Deleting video with ID: ${videoId}`);
  const response = await axios.delete(
    `${BASE_URL}/api/motion/admin/${videoId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Debug response
  console.log("Delete response:", response.data);

  // Remove deleted video from state
  setVideos(videos.filter((vid) => vid._id !== videoId));
  showNotification("success", "Video successfully deleted!");

  // Refetch videos to ensure state is consistent with backend
  await fetchVideos();
}

// Handle video reordering
export async function handleVideoReorder({
  videoId,
  direction,
  videos,
  setVideos,
  setError,
  showNotification,
}: VideoReorderParams) {
  const token = getAuthToken();
  console.log("Reorder token:", token ? "[REDACTED]" : "None");
  if (!token) {
    setError("No authentication token found. Please log in.");
    showNotification("error", "Please log in to continue.");
    return;
  }

  if (!videoId) {
    setError("Cannot reorder: Invalid video ID");
    showNotification("error", "Cannot reorder: Invalid video ID");
    return;
  }

  const index = videos.findIndex((vid) => vid._id === videoId);
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === videos.length - 1)
  ) {
    return;
  }

  const newVideos = [...videos];
  const newIndex = direction === "up" ? index - 1 : index + 1;
  [newVideos[index], newVideos[newIndex]] = [
    newVideos[newIndex],
    newVideos[index],
  ];

  const orderData = newVideos.map((vid, idx) => ({
    id: vid._id,
    order: idx,
  }));

  console.log("Reordering videos with data:", orderData);
  const response = await axios.put(
    `${BASE_URL}/api/motion/admin/reorder`,
    { orderData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("Reorder response:", response.data);
  setVideos(response.data.videos);
  showNotification("success", "Videos successfully reordered!");
}
