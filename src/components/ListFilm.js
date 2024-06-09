import { useNavigate } from "react-router-dom";
import axios from "axios";
import FilmCard from "./FilmCard";
import FilmSlider from "./FilmSlider";
import React, { useState, useEffect, useCallback } from "react";

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiURL);
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.items)
      ) {
        setFilmList(response.data.data.items);
        setTotalPages(
          Math.ceil(
            response.data.data.params.pagination.totalItems /
              response.data.data.params.pagination.totalItemsPerPage
          ) || 1
        );
      } else {
        setFilmList([]);
        setError("Unexpected data format");
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [apiURL]);

  useEffect(() => {
    if (category) {
      fetchData();
    }
  }, [fetchData, page, limit, category]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const categories = [
      { name: "newReleases", url: `${DOMAIN_API}/v1/api/danh-sach/phim-moi` },
      { name: "movies", url: `${DOMAIN_API}/v1/api/danh-sach/phim-le` },
      { name: "series", url: `${DOMAIN_API}/v1/api/danh-sach/phim-bo` },
      { name: "animation", url: `${DOMAIN_API}/v1/api/danh-sach/hoat-hinh` },
      {
        name: "dubbed",
        url: `${DOMAIN_API}/v1/api/danh-sach/phim-thuyet-minh`,
      },
    ];

    try {
      const filmsData = {};
      for (const category of categories) {
        const response = await axios.get(category.url);
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.items)
        ) {
          filmsData[category.name] = response.data.data.items;
        } else {
          filmsData[category.name] = [];
        }
      }
      setFilmList(filmsData);
      setError(null);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [DOMAIN_API]);

  useEffect(() => {
    if (!category) {
      fetchCategories();
    }
  }, [fetchCategories, category]);

  const goToPage = useCallback(
    (pageNumber) => {
      onPageChange(pageNumber);
    },
    [onPageChange]
  );

  const handleFilmClick = useCallback(
    (film) => {
      navigate(`/film/${film.slug}`);
    },
    [navigate]
  );

  const getPageNumbers = useCallback(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (page === 1) {
      return [1, 2, 3, "...", totalPages];
    } else if (page >= totalPages) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    } else if (page <= totalPages / 2) {
      return [page - 1, page, page + 1, "...", totalPages];
    } else if (page > totalPages / 2) {
      return [1, "...", page - 1, page, page + 1];
    }
    return [];
  }, [totalPages, page]);

  const renderSlider = useCallback(
    (title, films) => (
      <div className="mb-8">
        <h2 className="font-bold mb-4 text-yellow-500 text-3xl">{title}</h2>
        <FilmSlider films={films} DOMAIN_API={DOMAIN_API} />
      </div>
    ),
    [DOMAIN_API]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-52 animate-puls font-bold bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 ">
        {" "}
        <h1 className="text-3xl"> ĐANG TẢI...</h1>
      </div>
    );
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
      <h1 className="font-bold text-center text-zinc-50 text-4xl">
        {category}
      </h1>
      <br />
      <div className="flex justify-center border-solid-[#dba902]">
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Trang Trước
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            disabled={pageNumber === "..."}
            onClick={() => {
              if (pageNumber !== "...") {
                goToPage(pageNumber);
              }
            }}
            className={
              "flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 " +
              (pageNumber === page
                ? "bg-[#dba902] text-black"
                : "bg-gray-800 text-white hidden md:block")
            }
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Trang Sau
        </button>
      </div>
      <div className="border-2 border-double border-amber-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(filmList) &&
            filmList.map((film) => (
              <FilmCard
                key={film._id}
                film={film}
                DOMAIN_API={DOMAIN_API}
                onClick={() => handleFilmClick(film)}
              />
            ))}
        </div>
      </div>
      <div className="flex justify-center border-solid-[#dba902]">
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Trang Trước
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            disabled={pageNumber === "..."}
            onClick={() => {
              if (pageNumber !== "...") {
                goToPage(pageNumber);
              }
            }}
            className={
              "flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 " +
              (pageNumber === page
                ? "bg-[#dba902] text-black"
                : "bg-gray-800 text-white hidden md:block")
            }
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Trang Sau
        </button>
      </div>
    </div>
  );
};

export default ListFilm;
