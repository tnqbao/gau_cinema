import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function FilmDetail({ DOMAIN_API }) {
  const { slug } = useParams();
  const [film, setFilm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await axios.get(`${DOMAIN_API}/v1/api/phim/${slug}`);
        setFilm(response.data.data);
        console.log(film)
      } catch (error) {
        console.error("Error fetching film data:", error);
      }
    };
    fetchFilm();
  }, [slug, DOMAIN_API]);

  const handleWatchClick = () => {
    navigate(`/watch/${slug}`);
  };

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12">
      <h2>{film.name}</h2>
      <img
        src={`https://img.ophim.live/uploads/movies/${film.item.poster_url}`}
        alt={film.item.name}
        className="p-1 rounded-md border-gray-800"
      />
      <p>{film.description}</p>
      <button onClick={handleWatchClick}>Watch</button>
    </div>
  );
}

export default FilmDetail;
