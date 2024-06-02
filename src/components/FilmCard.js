import React from "react";
import { useNavigate } from "react-router-dom";

const FilmCard = ({ film, DOMAIN_API, og_image = [] }) => {
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
    <div className="basis-1/4 p-4 border-2 border-double border-amber-500 rounded-md border-gray-800 rounded-lg cursor-pointer hover:shadow-lg m-5	" onClick={handleFilmClick}>
      <img 
        className="w-full h-auto mb-2 rounded-md" 
        src={`https://img.ophim.live/uploads/movies/${film.poster_url}`} 
        alt={film.name} 
      />
      <div className="text-white text-center font-semibold">{displayName}</div>
    </div>
  );
};

export default FilmCard;
