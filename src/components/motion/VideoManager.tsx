// VideoManager.tsx
import React, { useState } from "react";
import type { FormEvent } from "react";
import type { MotionVideo } from "../../types/index";
import MotionVideoForm from "./MotionVideoForm";
import type { FormValues } from "./MotionVideoForm";
import MotionVideoGrid from "./MotionVideoGrid";
import {
  handleVideoSubmit,
  handleVideoDelete,
  handleVideoReorder,
} from "./videoService";

interface VideoManagerProps {
  videos: MotionVideo[];
  setVideos: React.Dispatch<React.SetStateAction<MotionVideo[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchVideos: () => Promise<void>;
  showNotification: (type: "success" | "error" | null, message: string) => void;
}

const VideoManager: React.FC<VideoManagerProps> = ({
  videos,
  setVideos,
  setError,
  fetchVideos,
  showNotification,
}) => {
  const [editingVideo, setEditingVideo] = useState<MotionVideo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: FormEvent, formData: FormValues) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleVideoSubmit({
        formData,
        editingVideo,
        videos,
        setVideos,
        showNotification,
        resetForm,
        fetchVideos,
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to save video";
      setError(errorMessage);
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: MotionVideo) => {
    console.log("Editing video:", video);
    setEditingVideo(video);
    const formElement = document.getElementById("video-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    setLoading(true);
    try {
      await handleVideoDelete({
        videoId,
        videos,
        setVideos,
        setError,
        showNotification,
        fetchVideos,
      });
    } catch (error: any) {
      console.error("Error deleting video:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete video";
      setError(errorMessage);
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (videoId: string, direction: "up" | "down") => {
    setLoading(true);
    try {
      await handleVideoReorder({
        videoId,
        direction,
        videos,
        setVideos,
        setError,
        showNotification,
        fetchVideos,
      });
    } catch (error: any) {
      console.error("Error reordering videos:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reorder videos";
      setError(errorMessage);
      showNotification("error", errorMessage);
      fetchVideos();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingVideo(null);
  };

  return (
    <>
      <MotionVideoForm
        editingVideo={editingVideo}
        loading={loading}
        onSubmit={handleFormSubmit}
        onCancel={resetForm}
      />
      <MotionVideoGrid
        videos={videos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </>
  );
};

export default VideoManager;
