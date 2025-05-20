// utils/api.ts

import { getAuthToken } from "./auth";

const BASE_URL = "https://nakestudios-be.vercel.app";

export { getAuthToken };

// Fetch all motion videos
export async function fetchMotionVideos() {
  const token = getAuthToken();
  console.log("Fetch videos token:", token);
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(`${BASE_URL}/api/motion`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.status}`);
  }

  const data = await response.json();
  console.log("Fetched videos:", data.videos);
  return data;
}
