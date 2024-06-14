import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { GlobalContext } from "../context/GlobalContext";
import FilmCard from "./FilmCard";
import FilmSlider from "./FilmSlider";
import useWindowSize from "../hooks/useWindowSize";

const ListFilm = () => {
  const { category, apiURL, DOMAIN_API, limit, page, handlePageChange } = useContext(GlobalContext);
  const [filmList, setFilmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const windowSize = useWindowSize();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiURL);
      if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
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
      { name: "dubbed", url: `${DOMAIN_API}/v1/api/danh-sach/phim-thuyet-minh` },
    ];

    try {
      const filmsData = {};
      for (const category of categories) {
        const response = await axios.get(category.url);
        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
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
      handlePageChange(pageNumber);
    },
    [handlePageChange]
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

  const FilmItem = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * getColumnCount() + columnIndex;
    const film = filmList[index];
    if (!film) return null;
    return (
      <div style={style} className="p-4">
        <FilmCard
          key={film._id}
          film={film}
          DOMAIN_API={DOMAIN_API}
          onClick={() => handleFilmClick(film)}
        />
      </div>
    );
  };

  const getColumnCount = () => {
    if (windowSize.width < 640) return 1;
    if (windowSize.width < 768) return 2;
    if (windowSize.width < 1024) return 3;
    return 4;
  };

  const columnCount = getColumnCount();
  const rowCount = Math.ceil(filmList.length / columnCount);

  const getHeight = () => {
    const rowHeight = 420;
    return (rowCount * rowHeight) + 30;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-32 lg:p-52">
        <h1 className="text-3xl animate-pulse font-bold bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 text-slate-200">
          ĐANG TẢI...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-32 lg:p-52">
        <h1 className="text-3xl animate-pulse font-bold bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 text-slate-200">
          {error}
        </h1>
      </div>
    );
  }

  if (!category || category === "Trang Chủ") {
    return (
      <div className="bg-[#121111]">
        <br />
        <br />
        {(filmList.recentViewed) ? renderSlider("Xem Gần Đây", filmList.recentViewed) : ""}
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
      <h1 className="font-bold text-center text-zinc-50 text-4xl">{category}</h1>
      <br />
      <div className="flex justify-center border-solid-[#dba902]">
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
          onClick={() => handlePageChange(page - 1)}
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
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Trang Sau
        </button>
      </div>
      <div className="border-2 border-double border-amber-500 overflow-hidden">
        <div className="overflow-hidden" style={{ height: `${getHeight()}px`, width: "100%" }}>
          <Grid
            columnCount={columnCount}
            columnWidth={() => 300}
            height={getHeight()}
            rowCount={rowCount}
            rowHeight={() => 420}
            width={windowSize.width - 32}
          >
            {FilmItem}
          </Grid>
        </div>
      </div>
      <div className="flex justify-center border-solid-[#dba902]">
        <button
          className="flex-1 border-solid cursor-pointer p-3.5 m-6 rounded-md font-bold bg-gray-800 text-white relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
          onClick={() => handlePageChange(page - 1)}
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
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Trang Sau
        </button>
      </div>
    </div>
  );
};

export default ListFilm;
