import React from "react";
import type { News } from "../../types";
import type { FormValues } from "./NewsForm";

const FormFields: React.FC<{
  formData: FormValues;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  editingArticle: News | null;
}> = ({ formData, handleInputChange, editingArticle }) => (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Title <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-1">
          ({formData.title.length}/100)
        </span>
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        placeholder="Enter news title"
        maxLength={100}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Excerpt <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-1">
          ({formData.excerpt.length}/186)
        </span>
      </label>
      <textarea
        name="excerpt"
        value={formData.excerpt}
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        placeholder="Enter a brief excerpt"
        rows={2}
        maxLength={186}
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Content <span className="text-red-500">*</span>
      </label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        placeholder="Enter news content"
        rows={6}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Image {!editingArticle && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        required={!editingArticle}
      />
      {editingArticle && (
        <p className="text-sm text-gray-500 mt-1">
          Leave empty to keep the current image
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Author <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        placeholder="Enter author name"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Publication Date <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        name="publishedAt"
        value={formData.publishedAt}
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Slug</label>
      <input
        type="text"
        name="slug"
        value={formData.slug}
        onChange={handleInputChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        placeholder="Enter URL slug"
      />
    </div>

    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="published"
          checked={formData.published}
          onChange={handleInputChange}
          className="mr-2"
        />
        <span className="text-sm font-medium text-gray-700">Published</span>
      </label>
    </div>
  </>
);

export default FormFields;
