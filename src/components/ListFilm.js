import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilmCard from "./FilmCard";

const ListFilm = ({ category, limit, apiURL, page, onPageChange, DOMAIN_API }) => {
  const [filmList, setFilmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(apiURL, category);
        setFilmList(category === "Phim Mới" ? response.data.items : response.data.data.items);
        setTotalPages(response.data.data.total_pages);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiURL, page, limit, category]);

  const goToPage = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const handleFilmClick = (film) => {
    navigate(`/film/${film.slug}`);
  };

  const getPageNumbers = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 5) {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    }

    if (page > totalPages - 4) {
      return Array.from({ length: 9 }, (_, i) => totalPages - 9 + i);
    }

    return Array.from({ length: 9 }, (_, i) => page - 4 + i);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <hr />
      <h2 className="font-bold text-center text-zinc-50">{category}</h2>
      <hr />
      <div className="flex flex-wrap gap-5 justify-between items-center">
        {filmList.map((film) => (
          <FilmCard 
            key={film._id} 
            film={film} 
            DOMAIN_API={DOMAIN_API} 
            og_image={film.og_image} 
            onClick={handleFilmClick} 
          />
        ))}
      </div>
      <br />
      <hr />
      <br />
      <div className="flex justify-center border-solid-[#dba902]">
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            className={pageNumber === page ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <br />
      <hr />
    </div>
  );
};

export default ListFilm;
