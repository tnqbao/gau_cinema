import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./unit_components/Navbar";
import Header from "./header/Header";
import ListFilm from "./unit_components/ListFilm";
import FilmDetail from "./unit_components/FilmDetail";
import VideoPlayer from "./unit_components/VideoPlayer";
import Footer from "./footer/Footer";
import { GlobalProvider } from "./context/GlobalContext";
import Login from "./auth_components/Login";
import "./App.css";

function App() {
  return (
    <GlobalProvider>
      <HelmetProvider>
        
        <div className="flex min-h-screen flex-col bg-[#121111]">
          <Header />
          <Navbar />
          <ConditionalWrapper>
            <Routes>
              <Route path="/" element={<ListFilm />} />
              <Route path="danh-sach/:category" element={<ListFilm />} />
              <Route path="/phim/:slug" element={<FilmDetail />} />
              <Route path="/phim/:slug/xem-phim" element={<VideoPlayer />} />
              <Route path="/dang-nhap" element = {<Login />} />
            </Routes>
          </ConditionalWrapper>
          <SpeedInsights />
          <Footer />
        </div>
      </HelmetProvider>
    </GlobalProvider>
  );
}

const ConditionalWrapper = ({ children }) => {
  const location = useLocation();
  const isVideoPlayerRoute = location.pathname.startsWith("/movie/");

  return (
    <div className={isVideoPlayerRoute ? "" : "px-8 lg:px-16"}>{children}</div>
  );
};

export default App;
