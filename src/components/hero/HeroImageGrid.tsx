// src/components/hero/HeroImageGrid.tsx
import React from "react";
import HeroImageCard from "./HeroImageCard";
import type { HeroImage } from "../../types";

interface HeroImageGridProps {
  images: HeroImage[];
  onEdit: (image: HeroImage) => void;
  onDelete: (imageId: string) => void;
  onReorder: (imageId: string, direction: "up" | "down") => void;
}

const HeroImageGrid: React.FC<HeroImageGridProps> = ({
  images,
  onEdit,
  onDelete,
  onReorder,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Hero Images</h2>
      {images.length === 0 ? (
        <p className="text-gray-500">No hero images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <HeroImageCard
              key={image._id}
              image={image}
              onEdit={onEdit}
              onDelete={onDelete}
              onReorder={onReorder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroImageGrid;
