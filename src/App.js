import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ListFilm from "./components/ListFilm";
import FilmDetail from "./components/FilmDetail";
import VideoPlayer from "./components/VideoPlayer";
import Footer from "./components/Footer";
import { GlobalProvider } from "./context/GlobalContext";
import "./App.css";

function App() {
  return (
    <GlobalProvider>
      <div className="flex min-h-screen flex-col bg-[#121111]">
        <Header />
        <Navbar />
        <ConditionalWrapper>
          <Routes>
            <Route path="/" element={<ListFilm />} />
            <Route path="/:category" element={<ListFilm />} />
            <Route path="/film/:slug" element={<FilmDetail />} />
            <Route path="/movie/:slug/watch" element={<VideoPlayer />} />
          </Routes>
        </ConditionalWrapper>
        <Footer />
      </div>
    </GlobalProvider>
  );
}

const ConditionalWrapper = ({ children }) => {
  const location = useLocation();
  const isVideoPlayerRoute = location.pathname.startsWith("/movie/");

  return <div className={isVideoPlayerRoute ? "" : "px-8 lg:px-16"}>{children}</div>;
};

export default App;
