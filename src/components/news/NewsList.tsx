import React, { useState } from "react";
import type { News } from "../../types";
import { formatDate } from "../../utils/dateFormatter";

interface NewsListProps {
  news: News[];
  loading: boolean;
  onEdit: (article: News) => void;
  onDelete: (id: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({
  news,
  loading,
  onEdit,
  onDelete,
}) => {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null
  );

  const toggleArticleExpansion = (id: string) => {
    if (expandedArticleId === id) {
      setExpandedArticleId(null);
    } else {
      setExpandedArticleId(id);
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex justify-center">
        <svg
          className="animate-spin h-8 w-8 text-amber-500"
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
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-500">No news articles found. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((article) => (
              <React.Fragment key={article._id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.image ? (
                      <div className="h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={
                            typeof article.image === "string"
                              ? article.image
                              : article.image.url || "/placeholder-image.jpg"
                          }
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {article.excerpt}
                    </div>
                    <button
                      onClick={() => toggleArticleExpansion(article._id)}
                      className="text-xs text-amber-600 hover:text-amber-800 mt-1"
                    >
                      {expandedArticleId === article._id
                        ? "Show Less"
                        : "Show More"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.date ||
                      (article.publishedAt
                        ? formatDate(article.publishedAt)
                        : "Date not available")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(
                          "Editing article:",
                          JSON.stringify(article, null, 2)
                        );
                        onEdit(article);
                      }}
                      className="text-amber-600 hover:text-amber-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(article._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expandedArticleId === article._id && (
                  <tr key={`expanded-${article._id}`}>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Full Excerpt:
                        </h4>
                        <p className="text-sm text-gray-700">
                          {article.excerpt}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Content:
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {article.content}
                        </p>
                      </div>
                      {article.categories && article.categories.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            Categories:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {article.categories.map((category, idx) => (
                              <span
                                key={`${article._id}-cat-${idx}`}
                                className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsList;
