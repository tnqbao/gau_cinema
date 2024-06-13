import React, { createContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [category, setCategory] = useState(null);
  const [keyWord, setKeyWords] = useState("");
  const [DOMAIN_API] = useState("https://ophim1.com");
  const [limit, setLimit] = useState(10);
  const [ep, setEpisode] = useState(1);
  const [page, setPage] = useState(1);
  const [apiURL, setApiURL] = useState(
    "https://ophim1.com/v1/api/danh-sach/phim-moi?page=1"
  );
  const [viewedEpisodes, setViewedEpisodes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || {};
    setViewedEpisodes(watchedEpisodes);
  }, []);

  const handleCategorySearch = (keyWords) => {
    if (!keyWords) keyWords = null;
    setKeyWords(keyWords);
    setCategory(keyWords);
    setEpisode(1);
    setPage(1);
    const url = `${DOMAIN_API}/v1/api/tim-kiem?keyword=${keyWords}&page=1`;
    setApiURL(url);
  };

  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setEpisode(1);
    let url = "";
    switch (newCategory) {
      case "Trang Chủ":
        break;
      case "Phim Lẻ":
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-le?page=1`;
        break;
      case "Phim Bộ":
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-bo?page=1`;
        break;
      case "Hoạt Hình":
        url = `${DOMAIN_API}/v1/api/danh-sach/hoat-hinh?page=1`;
        break;
      case "TV Show":
        url = `${DOMAIN_API}/v1/api/danh-sach/tv-shows?page=1`;
        break;
      case "Thuyết Minh":
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-thuyet-minh?page=1`;
        break;
      case "Lồng Tiếng":
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-long-tieng?page=1`;
        break;
      case "Phim Sắp Chiếu":
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-sap-chieu?page=1`;
        break;
      case "Phim Vietsub":
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-vietsub?page=1`;
        break;
      default:
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-moi?page=1`;
        break;
    }
    setApiURL(url);
    if (newCategory === "Trang Chủ") {
      navigate("/");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setApiURL((prevURL) => prevURL.replace(/page=\d+/, `page=${newPage}`));
  };

  const handleEpisodeChange = useCallback((slug, episode, server) => {
    const watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || {};
    if (!watchedEpisodes[slug]) {
      watchedEpisodes[slug] = [];
    }
    if (!watchedEpisodes[slug].includes(episode)) {
      watchedEpisodes[slug].push(episode);
    }
    localStorage.setItem('watchedEpisodes', JSON.stringify(watchedEpisodes));
    setViewedEpisodes(watchedEpisodes);
    setEpisode(episode);
    navigate(`/movie/${slug}/watch?ep=${episode}&server=${server}`);
  }, [navigate]);

  return (
    <GlobalContext.Provider
      value={{
        category,
        keyWord,
        DOMAIN_API,
        limit,
        ep,
        page,
        apiURL,
        setCategory,
        setKeyWords,
        setLimit,
        setEpisode,
        setPage,
        setApiURL,
        handleCategorySearch,
        handleCategorySelect,
        handlePageChange,
        handleEpisodeChange,
        viewedEpisodes, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
