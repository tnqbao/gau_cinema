import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilmCard from "./FilmCard";
import FilmSlider from "./FilmSlider";
import React, { useState, useEffect } from "react";

const ListFilm = ({
  category,
  limit,
  apiURL,
  page,
  onPageChange,
  DOMAIN_API,
}) => {
  const [filmList, setFilmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      const fetchData = async () => {
        console.log("Fetching data from URL:", apiURL);
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(apiURL);
          if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
            setFilmList(response.data.data.items);
            setTotalPages(response.data.data.total_pages);
          } else {
            setFilmList([]);
            setError("Unexpected data format");
          }
        } catch (error) {
          setError("Error fetching data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
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

  const fetchCategories = async () => {
    setLoading(true);
    const categories = [
      { name: "newReleases", url: `${DOMAIN_API}/v1/api/danh-sach/phim-moi` },
      { name: "movies", url: `${DOMAIN_API}/v1/api/danh-sach/phim-le` },
      { name: "series", url: `${DOMAIN_API}/v1/api/danh-sach/phim-bo` },
      { name: "animation", url: `${DOMAIN_API}/v1/api/danh-sach/hoat-hinh` },
      { name: "dubbed", url: `${DOMAIN_API}/v1/api/danh-sach/phim-thuyet-minh` },
    ];

    try {
      const responses = await Promise.all(
        categories.map((category) => axios.get(category.url))
      );

      const filmsData = responses.reduce((acc, response, index) => {
        const categoryName = categories[index].name;
        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
          acc[categoryName] = response.data.data.items;
        } else {
          acc[categoryName] = [];
        }
        return acc;
      }, {});

      setFilmList(filmsData);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!category) {
      fetchCategories();
    }
  }, [DOMAIN_API, category]);

  const renderSlider = (title, films) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <FilmSlider films={films.slice(0, 15)} DOMAIN_API={DOMAIN_API} />
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!category) {
    return (
      <div className="bg-[#121111]">
        <br />
        <br />
        {renderSlider("Phim Mới Cập Nhật", filmList.newReleases)}
        {renderSlider("Phim Lẻ", filmList.movies)}
        {renderSlider("Phim Bộ", filmList.series)}
        {renderSlider("Hoạt Hình", filmList.animation)}
        {renderSlider("Phim Thuyết Minh", filmList.dubbed)}
      </div>
    );
  }

  return (
    <div className="bg-[#121111]">
      <br />
      <br />
      <h1 className="font-bold text-center text-zinc-50 text-4xl font-serif">
        {category}
      </h1>
      <br />
      <div className="border-2 border-double border-amber-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(filmList) && filmList.map((film) => (
            <FilmCard
              key={film._id}
              film={film}
              DOMAIN_API={DOMAIN_API}
              onClick={() => handleFilmClick(film)}
            />
          ))}
        </div>
        <br />
        <br />
        <hr />
        <div className="flex justify-center border-solid-[#dba902]">
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>{page}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
            Next
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={
                "flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold " +
                (pageNumber === page
                  ? "bg-[#dba902] text-black"
                  : "bg-gray-800 text-white")
              }
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <br />
      </div>
    </div>
  );
};

export default ListFilm;
