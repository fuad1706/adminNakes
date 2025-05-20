// MotionTab.tsx
import React, { useState, useEffect } from "react";
import { fetchMotionVideos } from "../../utils/api";
import VideoManager from "./VideoManager";
import ErrorAlert from "../ErrorAlert";
import type { MotionVideo } from "../../types/index";

interface MotionTabProps {
  showNotification: (type: "success" | "error" | null, message: string) => void;
}

const MotionTab: React.FC<MotionTabProps> = ({ showNotification }) => {
  const [videos, setVideos] = useState<MotionVideo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await fetchMotionVideos();
      setVideos(data.videos || []);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      setError(error.message || "Failed to fetch videos");
      showNotification("error", error.message || "Failed to fetch videos");
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <VideoManager
        videos={videos}
        setVideos={setVideos}
        setError={setError}
        fetchVideos={fetchVideos}
        showNotification={showNotification}
      />
    </>
  );
};

export default MotionTab;
