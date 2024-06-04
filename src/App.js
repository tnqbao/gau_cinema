import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ListFilm from "./components/ListFilm";
import FilmDetail from "./components/FilmDetail";
import VideoPlayer from "./components/VideoPlayer";

import "./App.css";

function App() {
  const [category, setCategory] = useState("Trang Chủ");
  const [keyWords, setKeyWords] = useState("");
  const [DOMAIN_API] = useState("https://ophim1.com");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [apiURL, setApiURL] = useState(
    "https://ophim1.com/v1/api/danh-sach/phim-moi?page=1"
  );

  const handleCategorySearch = (keyWords) => {
    setKeyWords(keyWords);
    setCategory(keyWords);
    setPage(1);
    const url = `${DOMAIN_API}/v1/api/tim-kiem?keyword=${keyWords}&page=1`;
    setApiURL(url);
  };

  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    let url = "";
    switch (newCategory) {
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
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setApiURL((prevURL) => prevURL.replace(/page=\d+/, `page=${newPage}`));
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setApiURL((prevURL) => prevURL.replace(/limit=\d+/, `limit=${newLimit}`));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#121111]">
      <Router>
        <Header
          onCategorySearch={handleCategorySearch}
          changeCategory={setCategory}
        />
        <Navbar onCategorySelect={handleCategorySelect} />
        <ConditionalWrapper>
          <Routes>
            <Route path="/" element={<ListFilm DOMAIN_API={DOMAIN_API} />} />
            <Route
              path="/:category"
              element={
                <ListFilm
                  category={category}
                  limit={limit}
                  apiURL={apiURL}
                  page={page}
                  DOMAIN_API={DOMAIN_API}
                  onPageChange={handlePageChange}
                  onCategorySelect={handleCategorySelect}
                />
              }
            />
            <Route
              path="/film/:slug"
              element={<FilmDetail DOMAIN_API={DOMAIN_API} />}
            />
            <Route
              path="/watch/:slug"
              element={<VideoPlayer DOMAIN_API={DOMAIN_API} />}
            />
          </Routes>
        </ConditionalWrapper>
      </Router>
    </div>
  );
}

const ConditionalWrapper = ({ children }) => {
  const location = useLocation();
  const isVideoPlayerRoute = location.pathname.startsWith("/watch/");

  return (
    <div className={isVideoPlayerRoute ? "" : "px-8 lg:px-16"}>{children}</div>
  );
};

export default App;
