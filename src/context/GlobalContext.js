import React, { createContext, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    const watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
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

  const handleMenuSelect = (newCategory) => {
    setCategory(newCategory);
    setPage(1);

    const categoryURLs = {
      "Trang Chủ": `${DOMAIN_API}/v1/api/danh-sach/phim-le?page=1`,
      "Phim Mới": `${DOMAIN_API}/v1/api/danh-sach/phim-moi?page=1`,
      "Phim Lẻ": `${DOMAIN_API}/v1/api/danh-sach/phim-le?page=1`,
      "Phim Bộ": `${DOMAIN_API}/v1/api/danh-sach/phim-bo?page=1`,
      "Sắp Chiếu": `${DOMAIN_API}/v1/api/danh-sach/phim-sap-chieu?page=1`,
      "Thuyết Minh": `${DOMAIN_API}/v1/api/danh-sach/phim-thuyet-minh?page=1`,
      Vietsub: `${DOMAIN_API}/v1/api/danh-sach/phim-vietsub?page=1`,
      "TV Show": `${DOMAIN_API}/v1/api/danh-sach/tv-shows?page=1`,
    };

    const extractCategory = (url) => {
      const matchDs = url.match(/danh-sach\/(.*?)\?/);
      const matchTl = url.match(/the-loai\/(.*?)\?/);
      const matchQG = url.match(/quoc-gia\/(.*?)\?/);
      if (matchDs) {
        return matchDs[1];
      }
      if (matchTl) {
        return matchTl[1];
      }
      if (matchQG) {
        return matchQG[1];
      }
      return "";
    };

    let url;
    if (newCategory === "Thể Loại" || newCategory === "Quốc Gia") {
      url = `${DOMAIN_API}/v1/api/${newCategory.toLowerCase()}/?page=1`;
    } else {
      url =
        categoryURLs[newCategory] ||
        `${DOMAIN_API}/v1/api/the-loai/${newCategory}?page=1`;
    }

    setApiURL(url);

    if (newCategory === "Trang Chủ") {
      navigate("/");
    } else {
      const extractedCategory = extractCategory(url);
      navigate(`/danh-sach/${extractedCategory}`);
    }
  };

  const getDataAPI = useCallback(async (apiURL, setParaFunc) => {
    try {
      const response = await axios.get(apiURL);
      setParaFunc(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setApiURL((prevURL) => prevURL.replace(/page=\d+/, `page=${newPage}`));
  };

  const handleEpisodeChange = useCallback(
    (slug, episode, server) => {
      const watchedEpisodes =
        JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
      if (!watchedEpisodes[slug]) {
        watchedEpisodes[slug] = [];
        watchedEpisodes[slug].push("1", "Full");
      }
      if (!watchedEpisodes[slug].includes(episode)) {
        watchedEpisodes[slug].push(episode);
      }
      localStorage.setItem("watchedEpisodes", JSON.stringify(watchedEpisodes));
      setViewedEpisodes(watchedEpisodes);
      setEpisode(episode);
      navigate(`/movie/${slug}/watch?ep=${episode}&server=${server}`);
    },
    [navigate]
  );

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
        viewedEpisodes,
        getDataAPI,
        setCategory,
        setKeyWords,
        setLimit,
        setEpisode,
        setPage,
        setApiURL,
        handleCategorySearch,
        handleMenuSelect,
        handlePageChange,
        handleEpisodeChange,
        setViewedEpisodes,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
