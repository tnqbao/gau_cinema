import React from "react";
import { useNavigate } from "react-router-dom";

const FilmCard = ({ film }) => {
  const navigate = useNavigate();

  const handleFilmClick = () => {
    navigate(`/film/${film.slug}`);
  };

  const nameLength = film.name.length;
  const displayName = nameLength > 30 
    ? `${film.name.substring(0, 27)}...` 
    : nameLength <= 14 
      ? `${film.name}       ` 
      : film.name;

  return (
    <div 
      className="relative p-2 border border-gray-800 rounded-lg cursor-pointer hover:shadow-lg m-2" 
      onClick={handleFilmClick}
    >
      <div className="relative">
        <img 
          className="w-full h-auto rounded-md" 
          src={`https://img.ophim.live/uploads/movies/${film.thumb_url}`} 
          alt={film.name} 
        />
        {film.quality && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            {film.quality}
          </span>
        )}
        {film.status && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            {film.status}
          </span>
        )}
      </div>
      <div className="text-white text-center font-semibold mt-2">
        {displayName}
      </div>
      {film.english_title && (
        <div className="text-gray-400 text-center text-sm">
          {film.english_title}
        </div>
      )}
    </div>
  );
};

export default FilmCard;
