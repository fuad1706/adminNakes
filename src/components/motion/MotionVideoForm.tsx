import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { MotionVideo } from "../../types";

export interface FormValues {
  videoFile: File | null;
  title: string;
  order: string;
  isActive: boolean;
  thumbnailFile: File | null;
}

interface MotionVideoFormProps {
  editingVideo: MotionVideo | null;
  loading: boolean;
  onSubmit: (e: FormEvent, formData: FormValues) => void;
  onCancel: () => void;
}

const MotionVideoForm: React.FC<MotionVideoFormProps> = ({
  editingVideo,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title || "");
      setOrder(editingVideo.order.toString());
      setIsActive(editingVideo.isActive);
      setVideoPreview(editingVideo.url || null);
      setThumbnailPreview(editingVideo.thumbnail?.url || null);
      setVideoFile(null);
      setThumbnailFile(null);
      setError(null);
    } else {
      setTitle("");
      setOrder("0");
      setIsActive(true);
      setVideoFile(null);
      setVideoPreview(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setError(null);
    }
  }, [editingVideo]);

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [videoPreview, thumbnailPreview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file (e.g., .mp4, .webm, .mov).");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file must be less than 100MB.");
        return;
      }
      setError(null);
      setVideoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoPreview(objectUrl);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (e.g., .jpg, .png, .webp).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Thumbnail file must be less than 5MB.");
        return;
      }
      setError(null);
      setThumbnailFile(file);
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingVideo && (!videoFile || !thumbnailFile)) {
      setError("Video and thumbnail files are required for new videos.");
      return;
    }
    if (!title) {
      setError("Title is required.");
      return;
    }
    if (!order || parseInt(order) < 0) {
      setError("Please enter a valid display order (0 or greater).");
      return;
    }
    setError(null);
    const formData: FormValues = {
      videoFile,
      title,
      order,
      isActive,
      thumbnailFile,
    };
    onSubmit(e, formData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8" id="video-form">
      <h2 className="text-xl font-bold mb-4">
        {editingVideo ? "Edit Video" : "Add New Video"}
      </h2>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700"
          >
            Display Order
          </label>
          <input
            type="number"
            id="order"
            min="0"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700"
          >
            Video File{" "}
            {editingVideo ? "(Leave empty to keep current video)" : ""}
          </label>
          <input
            type="file"
            id="video"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            required={!editingVideo}
          />
        </div>

        {videoPreview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Preview
            </label>
            <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
              <video
                src={videoPreview}
                className="w-full h-full object-contain"
                controls
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Thumbnail Image{" "}
            {editingVideo ? "(Leave empty to keep current thumbnail)" : ""}
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbnailChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            required={!editingVideo}
          />
        </div>

        {thumbnailPreview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Preview
            </label>
            <div className="relative w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700"
            >
              Active (visible on website)
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          {editingVideo && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Processing...
              </>
            ) : editingVideo ? (
              "Update Video"
            ) : (
              "Add Video"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MotionVideoForm;
