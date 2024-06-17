import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ListFilm from "./components/ListFilm";
import FilmDetail from "./components/FilmDetail";
import VideoPlayer from "./components/VideoPlayer";
import Footer from "./components/Footer";
import { GlobalProvider } from "./context/GlobalContext";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <GlobalProvider>
      <HelmetProvider>
        <div className="flex min-h-screen flex-col bg-[#121111]">
          <Header />
          <Navbar />
          <ConditionalWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:category" element={<ListFilm />} />
              <Route path="/film/:slug" element={<FilmDetail />} />
              <Route path="/movie/:slug/watch" element={<VideoPlayer />} />
            </Routes>
          </ConditionalWrapper>
          <SpeedInsights/>
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
