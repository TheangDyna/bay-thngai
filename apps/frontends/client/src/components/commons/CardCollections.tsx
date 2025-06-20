import React from "react";
import { Link } from "react-router-dom";

interface ICardCollectionsProps {
  title: string;
  description: string;
  imageUrl: string;
  path: string;
}

const CardCollections: React.FC<ICardCollectionsProps> = ({
  title,
  description,
  imageUrl,
  path
}) => {
  return (
    <div className="group cursor-pointer relative w-full h-80 rounded-[18px] overflow-hidden shadow-lg">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black flex flex-col justify-center items-center transition-opacity duration-300 group-hover:opacity-100 group-hover:bg-opacity-75 opacity-0">
        <h1 className="text-white text-2xl font-bold mb-2">{title}</h1>
        <p className="text-white text-sm mb-4 text-center px-4">
          {description}
        </p>
        <Link
          to={path}
          className="px-4 py-2 bg-white text-black rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200"
        >
          Explore
        </Link>
      </div>
    </div>
  );
};

export default CardCollections;
