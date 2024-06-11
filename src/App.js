import React, { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ListFilm from "./components/ListFilm";
import FilmDetail from "./components/FilmDetail";
import VideoPlayer from "./components/VideoPlayer";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [category, setCategory] = useState("Trang Chủ");
  const [keyWord, setKeyWords] = useState("");
  const [DOMAIN_API] = useState("https://ophim1.com");
  const [limit, setLimit] = useState(10);
  const [ep, setEpisode] = useState(1);
  const [page, setPage] = useState(1);
  const [apiURL, setApiURL] = useState(
    "https://ophim1.com/v1/api/danh-sach/phim-moi?page=1"
  );

  const navigate = useNavigate();

  const handleCategorySearch = (keyWords) => {
    if (!keyWords) keyWords = keyWord;
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
        url = `${DOMAIN_API}/v1/api/danh-sach/phim-moi?page=1`;
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

  const handleEpisodeChange = (slug, episode, server) => {
    setEpisode(episode)
    navigate(`/movie/${slug}/watch?ep=${episode}&server=${server}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#121111]">
      <Header onCategorySearch={handleCategorySearch} changeCategory={setCategory} />
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
          <Route path="/film/:slug" element={<FilmDetail DOMAIN_API={DOMAIN_API} />} />
          <Route
            path="/movie/:slug/watch"
            element={<VideoPlayer DOMAIN_API={DOMAIN_API} onEpisodeChange={handleEpisodeChange} ep={ep} />}
          />
        </Routes>
      </ConditionalWrapper>
      <Footer></Footer>
    </div>
  );
}

const ConditionalWrapper = ({ children }) => {
  const location = useLocation();
  const isVideoPlayerRoute = location.pathname.startsWith("/movie/");

  return <div className={isVideoPlayerRoute ? "" : "px-8 lg:px-16"}>{children}</div>;
};

export default App;
