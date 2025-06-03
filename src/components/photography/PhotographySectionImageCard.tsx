import React from "react";
import type { HeroImage } from "../../types";

interface PhotographySectionImageCardProps {
  image: HeroImage;
  onEdit: (image: HeroImage) => void;
  onDelete: (imageId: string) => void;
  onReorder: (imageId: string, direction: "up" | "down") => void;
}

const PhotographySectionImageCard: React.FC<
  PhotographySectionImageCardProps
> = ({ image, onEdit, onDelete, onReorder }) => {
  return (
    <div className="border rounded-lg p-4">
      <img
        src={image.url}
        alt="Hero Image"
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <p className="text-sm text-gray-600">Order: {image.order}</p>
      <p className="text-sm text-gray-600">
        Status: {image.isActive ? "Active" : "Inactive"}
      </p>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onEdit(image)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(image._id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => onReorder(image._id, "up")}
          className="px-3 py-1 bg-gray-500 text-white cursor-pointer rounded-md hover:bg-gray-600 transition-colors"
        >
          ↑
        </button>
        <button
          onClick={() => onReorder(image._id, "down")}
          className="px-3 py-1 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default PhotographySectionImageCard;
