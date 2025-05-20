// src/components/hero/Icre8ImageGrid.tsx
import React from "react";
import Icre8ImageCard from "./Icre8ImageCard";
import type { HeroImage } from "../../types";

interface Icre8ImageGridProps {
  images: HeroImage[];
  onEdit: (image: HeroImage) => void;
  onDelete: (imageId: string) => void;
  onReorder: (imageId: string, direction: "up" | "down") => void;
}

const Icre8ImageGrid: React.FC<Icre8ImageGridProps> = ({
  images,
  onEdit,
  onDelete,
  onReorder,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Icre8 Images</h2>
      {images.length === 0 ? (
        <p className="text-gray-500">No hero images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Icre8ImageCard
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

export default Icre8ImageGrid;
