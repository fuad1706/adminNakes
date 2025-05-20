import React from "react";

const CategoryManager: React.FC<{
  categories: string[];
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  handleAddCategory: () => void;
  handleRemoveCategory: (category: string) => void;
}> = ({
  categories,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleRemoveCategory,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Categories
    </label>
    <div className="flex flex-wrap gap-2 mb-2">
      {categories.map((category, index) => (
        <div
          key={index}
          className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md flex items-center"
        >
          {category}
          <button
            type="button"
            onClick={() => handleRemoveCategory(category)}
            className="ml-2 text-amber-600 hover:text-amber-800"
          >
            ×
          </button>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="flex-grow border-gray-300 rounded-md shadow-sm"
        placeholder="Add a category"
      />
      <button
        type="button"
        onClick={handleAddCategory}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        Add
      </button>
    </div>
  </div>
);

export default CategoryManager;
