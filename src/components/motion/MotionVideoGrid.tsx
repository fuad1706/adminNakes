import React from "react";
import type { MotionVideo } from "../../types";

interface MotionVideoGridProps {
  videos: MotionVideo[];
  onEdit: (video: MotionVideo) => void;
  onDelete: (videoId: string) => void;
  onReorder: (videoId: string, direction: "up" | "down") => void;
}

const MotionVideoGrid: React.FC<MotionVideoGridProps> = ({
  videos,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const handleDelete = (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      onDelete(videoId);
    }
  };

  // Sort videos by order
  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Manage Videos</h2>
      {sortedVideos.length === 0 ? (
        <div className="text-gray-500 py-4 text-center">
          No videos found. Add your first video above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video) => (
            <div
              key={video._id}
              className={`border rounded-lg overflow-hidden ${
                !video.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="relative aspect-video bg-gray-100">
                {video.url ? (
                  <video
                    src={video.url}
                    className="w-full h-full object-contain"
                    controls
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No video available</span>
                  </div>
                )}
                {!video.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {video.title}
                    </h3>
                    {video.thumbnail?.url ? (
                      <img
                        src={video.thumbnail.url}
                        alt={`${video.title} thumbnail`}
                        className="w-6 h-6 mt-1 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 mt-1 block">
                        No thumbnail
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    Order: {video.order}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => onReorder(video._id!, "up")}
                    disabled={video.order === 0}
                    className={`p-1 rounded ${
                      video.order === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title="Move up"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onReorder(video._id!, "down")}
                    disabled={video.order === sortedVideos.length - 1}
                    className={`p-1 rounded ${
                      video.order === sortedVideos.length - 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title="Move down"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(video)}
                    className="p-1 rounded text-blue-600 hover:bg-blue-50"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(video._id!)}
                    className="p-1 rounded text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MotionVideoGrid;
