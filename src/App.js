import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ListFilm from "./components/ListFilm";

import "./App.css";

function App() {
  const [category, setCategory] = useState("Trang Chủ");
  const [keyWords, setKeyWords] = useState("");
  const [DOMAIN_API, setDomainAPI] = useState("https://ophim1.com");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [apiURL, setApiURL] = useState(
    "https://ophim1.com/v1/api/home?page=1"
  );

  const handleCategorySearch = (keyWords) => {
    setCategory(keyWords);
    setPage(1);
    let url = `${DOMAIN_API}/v1/api/tim-kiem?keyword=${keyWords}&limit=${limit}`;
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

  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    let url = "";
    switch (newCategory) {
      case "Phim Mới":
        url = "https://ophim1.com/v1/api/home?page=1";
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
      default:
        url = `${DOMAIN_API}/v1/api/home`;
        break;
    }
    setApiURL(url);
  };

  return (
    <div>
      <Router>
        <Header
          onCategorySearch={handleCategorySearch}
          changeCategory={setCategory}
        />
        <Navbar onCategorySelect={handleCategorySelect} />
        <div className="px-8 lg:px-16 bg-black">
          <Routes>
            <Route
              path="/"
              element={
                <ListFilm
                  category={category}
                  limit={limit}
                  apiURL={apiURL}
                  page={page}
                  DOMAIN_API={DOMAIN_API}
                  onPageChange={handlePageChange}
                />
              }
            />
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
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
