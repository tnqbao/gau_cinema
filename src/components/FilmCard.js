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

  const cleanSlug = film.slug.trim();

  const cleanOgImages = og_image.map(image => image.trim().replace(/ /g, ''));

  return (
    <div className="film-card p-4 border border-gray-800 rounded-lg cursor-pointer hover:shadow-lg" onClick={handleFilmClick}>
      <img 
        className="w-full h-auto mb-2" 
        src={`${DOMAIN_API}/uploads/movies/${film.poster_url.trim()}`} 
        alt={film.name} 
      />
      <div className="text-white text-center font-semibold">{displayName}</div>
      <div className="og-images flex mt-2 space-x-2">
        {cleanOgImages.map((image, index) => (
          <img 
            key={index} 
            src={`${DOMAIN_API}${image}`} 
            alt={`og_image_${index}`} 
            className="og-image w-16 h-16 rounded-lg" 
          />
        ))}
      </div>
    </div>
  );
};

export default FilmCard;
