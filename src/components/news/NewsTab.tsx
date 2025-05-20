import React, { useState, useEffect } from "react";
import NewsForm from "./NewsForm";
import type { FormValues } from "./NewsForm";
import NewsList from "./NewsList";
import { getAuthToken } from "../../utils/auth";
import type { News } from "../../types/index";
import {
  fetchNews,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from "../../api/news";

interface NewsTabProps {
  showNotification: (type: "success" | "error" | null, message: string) => void;
}

const NewsTab: React.FC<NewsTabProps> = ({ showNotification }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<News | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const token = getAuthToken();
    if (!token) {
      showNotification(
        "error",
        "No authentication token found. Please log in."
      );
      return;
    }
    try {
      setLoading(true);
      const newsData = await fetchNews(token);
      console.log("Fetched news data:", JSON.stringify(newsData, null, 2));
      setNews(newsData);
    } catch (error) {
      console.error("Failed to load news:", error);
      showNotification("error", "Failed to load news articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData: FormValues) => {
    e.preventDefault();
    console.log("Form data submitted:", JSON.stringify(formData, null, 2));
    const token = getAuthToken();
    if (!token) {
      showNotification(
        "error",
        "No authentication token found. Please log in."
      );
      return;
    }
    setLoading(true);
    try {
      if (editingArticle) {
        if (!editingArticle._id || typeof editingArticle._id !== "string") {
          console.error("Invalid article ID:", editingArticle._id);
          showNotification("error", "Invalid article ID. Please try again.");
          return;
        }
        console.log("Updating article with ID:", editingArticle._id);
        await updateNewsArticle(editingArticle._id, formData, token);
        showNotification("success", "News article updated successfully");
      } else {
        await createNewsArticle(formData, token);
        showNotification("success", "News article created successfully");
      }
      setEditingArticle(null);
      loadNews();
    } catch (error: any) {
      console.error("Failed to save news article:", error);
      showNotification("error", error.message || "Failed to save news article");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: News) => {
    console.log(
      "Handle edit called with article:",
      JSON.stringify(article, null, 2)
    );
    if (!article._id) {
      console.error("Article missing _id:", article);
      showNotification("error", "Cannot edit article: Missing ID");
      return;
    }
    setEditingArticle(article);
    setTimeout(() => {
      const formElement = document.getElementById("news-form");
      if (formElement) {
        console.log("Scrolling to form");
        formElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("Form element not found");
      }
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      const token = getAuthToken();
      if (!token) {
        showNotification(
          "error",
          "No authentication token found. Please log in."
        );
        return;
      }
      try {
        setLoading(true);
        console.log("Deleting article with ID:", id);
        await deleteNewsArticle(id, token);
        showNotification("success", "News article deleted successfully");
        loadNews();
      } catch (error: any) {
        console.error("Failed to delete news article:", error);
        showNotification(
          "error",
          error.message || "Failed to delete news article"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    console.log("Cancel edit");
    setEditingArticle(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Manage News</h1>
      <NewsForm
        editingArticle={editingArticle}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <NewsList
        news={news}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NewsTab;
