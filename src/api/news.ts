import type { News } from "../types/index";
import { format } from "date-fns";
import type { FormValues } from "../components/news/NewsForm";

const API_URL =
  import.meta.env?.VITE_API_URL || "https://nakestudios-be.vercel.app/api";

export const fetchNews = async (token: string): Promise<News[]> => {
  try {
    const response = await fetch(`${API_URL}/news`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Raw fetchNews response:", JSON.stringify(data, null, 2));
    if (!Array.isArray(data)) {
      console.error("fetchNews response is not an array:", data);
      throw new Error("Invalid response format: Expected an array");
    }
    const validNews = data
      .map((item: any) => {
        if (!item.id && !item._id) {
          console.error("Invalid article in response, missing id/_id:", item);
          return null;
        }
        return {
          ...item,
          _id: item.id || item._id, // Normalize to _id
          id: undefined, // Remove id to avoid conflicts
        };
      })
      .filter((item: any) => item !== null) as News[];
    console.log("Processed news data:", JSON.stringify(validNews, null, 2));
    return validNews;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};

// Keep deleteNewsArticle, createNewsArticle, updateNewsArticle unchanged
export const deleteNewsArticle = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    console.log("Sending DELETE request for ID:", id);
    const response = await fetch(`${API_URL}/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      },
    });
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.log("Server error response:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.error("Failed to parse error response as JSON");
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Failed to delete news article:", error);
    throw error;
  }
};

export const createNewsArticle = async (
  data: FormValues,
  token: string
): Promise<News> => {
  try {
    if (!data) {
      throw new Error("Form data is missing");
    }
    const requiredFields: (keyof FormValues)[] = [
      "title",
      "excerpt",
      "content",
      "author",
      "published",
      "publishedAt",
    ];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== false) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    if (!data.imageFile || !(data.imageFile instanceof File)) {
      throw new Error("Image file is required for new articles");
    }
    if (!Array.isArray(data.categories)) {
      throw new Error("Categories must be an array");
    }

    let formattedPublishedAt;
    try {
      const date = new Date(data.publishedAt);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid publishedAt date");
      }
      formattedPublishedAt = format(date, "d MMM, yyyy");
    } catch {
      throw new Error("Invalid publishedAt date format");
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("excerpt", data.excerpt);
    formData.append("content", data.content);
    formData.append("author", data.author);
    formData.append("published", data.published.toString());
    formData.append("publishedAt", formattedPublishedAt);
    formData.append("categories", data.categories.join(","));
    formData.append("image", data.imageFile);

    for (const [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    const response = await fetch(`${API_URL}/news`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.log("Server error response:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.error("Failed to parse error response as JSON");
      }
      throw new Error(errorMessage);
    }

    const newArticle = await response.json();
    // Normalize response
    return {
      ...newArticle,
      _id: newArticle.id || newArticle._id,
      id: undefined,
    };
  } catch (error) {
    console.error("Failed to create news article:", error);
    throw error;
  }
};

export const updateNewsArticle = async (
  id: string,
  data: FormValues,
  token: string
): Promise<News> => {
  try {
    if (!data) {
      throw new Error("Form data is missing");
    }
    if (!Array.isArray(data.categories)) {
      throw new Error("Categories must be an array");
    }

    let formattedPublishedAt;
    if (data.publishedAt) {
      try {
        const date = new Date(data.publishedAt);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid publishedAt date");
        }
        formattedPublishedAt = format(date, "d MMM, yyyy");
      } catch {
        throw new Error("Invalid publishedAt date format");
      }
    }

    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.excerpt) formData.append("excerpt", data.excerpt);
    if (data.content) formData.append("content", data.content);
    if (data.author) formData.append("author", data.author);
    if (data.published !== undefined)
      formData.append("published", data.published.toString());
    if (formattedPublishedAt)
      formData.append("publishedAt", formattedPublishedAt);
    if (data.categories.length)
      formData.append("categories", data.categories.join(","));
    if (data.imageFile && data.imageFile instanceof File) {
      formData.append("image", data.imageFile);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`FormData: ${key} =`, value);
    }

    const response = await fetch(`${API_URL}/news/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        console.log("Server error response:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.error("Failed to parse error response as JSON");
      }
      throw new Error(errorMessage);
    }

    const updatedArticle = await response.json();
    // Normalize response
    return {
      ...updatedArticle,
      _id: updatedArticle.id || updatedArticle._id,
      id: undefined,
    };
  } catch (error) {
    console.error("Failed to update news article:", error);
    throw error;
  }
};
