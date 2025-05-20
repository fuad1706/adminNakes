import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { News } from "../../types";
import {
  formatDateForInput,
  prepareFormDateForSubmission,
  processServerDate,
} from "../../utils/dateFormatter";
import FormFields from "./FormFields";
import CategoryManager from "./CategoryManager";
import FormActions from "./FormActions";

interface NewsFormProps {
  editingArticle: News | null;
  loading: boolean;
  onSubmit: (e: FormEvent, formData: FormValues) => void;
  onCancel: () => void;
}

export interface FormValues {
  title: string;
  excerpt: string;
  content: string;
  imageFile: File | null;
  author: string;
  published: boolean;
  publishedAt: string;
  slug: string;
  categories: string[];
  [key: string]: any;
}

const NewsForm: React.FC<NewsFormProps> = ({
  editingArticle,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormValues>({
    title: "",
    excerpt: "",
    content: "",
    imageFile: null,
    author: "",
    published: true,
    publishedAt: formatDateForInput(new Date()),
    slug: "",
    categories: [],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<string>("");

  useEffect(() => {
    console.log("NewsForm useEffect, editingArticle:", editingArticle);
    if (editingArticle) {
      setFormData({
        title: editingArticle.title || "",
        excerpt: editingArticle.excerpt || "",
        content: editingArticle.content || "",
        imageFile: null,
        author: editingArticle.author || "",
        published: editingArticle.published ?? true,
        publishedAt: editingArticle.publishedAt
          ? processServerDate(editingArticle.publishedAt)
          : formatDateForInput(new Date()),
        slug: editingArticle.slug || "",
        categories: Array.isArray(editingArticle.categories)
          ? editingArticle.categories
          : [],
      });
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        imageFile: null,
        author: "",
        published: true,
        publishedAt: formatDateForInput(new Date()),
        slug: "",
        categories: [],
      });
    }
    setFormError(null);
    setNewCategory("");
  }, [editingArticle]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement;

    if (type === "file" && inputElement.files) {
      setFormData({ ...formData, imageFile: inputElement.files[0] });
      setFormError(null);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: inputElement.checked });
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "title" && !editingArticle) {
        const slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        setFormData((prev) => ({ ...prev, slug }));
      }

      setFormError(null);
    }
  };

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !formData.categories.includes(newCategory.trim())
    ) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()],
      });
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(
        (category) => category !== categoryToRemove
      ),
    });
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return false;
    }
    if (!formData.excerpt.trim()) {
      setFormError("Excerpt is required");
      return false;
    }
    if (!formData.content.trim()) {
      setFormError("Content is required");
      return false;
    }
    if (!formData.author.trim()) {
      setFormError("Author is required");
      return false;
    }
    if (!editingArticle && !formData.imageFile) {
      setFormError("Image is required for new articles");
      return false;
    }
    if (!formData.publishedAt) {
      setFormError("Publication date is required");
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.publishedAt)) {
      setFormError("Invalid date format. Please use YYYY-MM-DD");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = { ...formData };
      submissionData.publishedAt = prepareFormDateForSubmission(
        formData.publishedAt
      );
      console.log("Submitting form data:", submissionData);
      onSubmit(e, submissionData);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6" id="news-form">
      <h2 className="text-xl font-semibold mb-4">
        {editingArticle ? "Edit News Article" : "Add New News Article"}
      </h2>
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormFields
          formData={formData}
          handleInputChange={handleInputChange}
          editingArticle={editingArticle}
        />
        <CategoryManager
          categories={formData.categories}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleAddCategory={handleAddCategory}
          handleRemoveCategory={handleRemoveCategory}
        />
        <FormActions
          loading={loading}
          editingArticle={editingArticle}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};

export default NewsForm;
