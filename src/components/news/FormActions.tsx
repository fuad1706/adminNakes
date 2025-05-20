import React from "react";
import type { News } from "../../types";

const FormActions: React.FC<{
  loading: boolean;
  editingArticle: News | null;
  onCancel: () => void;
}> = ({ loading, editingArticle, onCancel }) => (
  <div className="flex space-x-4">
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 bg-amber-400 text-gray-900 rounded-md hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center min-w-[120px]"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
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
          Saving...
        </>
      ) : editingArticle ? (
        "Update Article"
      ) : (
        "Add Article"
      )}
    </button>
    {editingArticle && (
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
      >
        Cancel
      </button>
    )}
  </div>
);

export default FormActions;
