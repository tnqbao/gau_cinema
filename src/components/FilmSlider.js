import React, { useState, useEffect, useRef } from "react";
import FilmCard from "./FilmCard";

const FilmSlider = ({ categoryTitle, films = [], onFilmClick }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [filmsPerPage, setFilmsPerPage] = useState(4);
  const [loopCount, setLoopCount] = useState(0);
  const maxLoops = 3;
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setFilmsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setFilmsPerPage(3);
      } else {
        setFilmsPerPage(4);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const nextSlide = () => {
      setStartIndex((prevIndex) => {
        const newIndex = prevIndex + filmsPerPage;
        if (newIndex >= films.length) {
          setLoopCount((prevLoopCount) => {
            if (prevLoopCount + 1 >= maxLoops) {
              return 0;
            }
            return prevLoopCount + 1;
          });
          return 0;
        }
        return newIndex;
      });
    };

    intervalRef.current = setInterval(nextSlide, 10000);

    return () => clearInterval(intervalRef.current);
  }, [filmsPerPage, films.length]);

  const handleNext = () => {
    setStartIndex((prevIndex) => {
      const newIndex = prevIndex + filmsPerPage;
      if (newIndex >= films.length) {
        setLoopCount((prevLoopCount) => {
          if (prevLoopCount + 1 >= maxLoops) {
            return 0;
          }
          return prevLoopCount + 1;
        });
        return 0;
      }
      return newIndex;
    });
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex === 0) {
        setLoopCount((prevLoopCount) => {
          if (prevLoopCount > 0) {
            return prevLoopCount - 1;
          }
          return maxLoops - 1;
        });
        return films.length - filmsPerPage;
      }
      return prevIndex - filmsPerPage;
    });
  };

  const displayedFilms = films && films.length ? films.slice(startIndex, startIndex + filmsPerPage) : [];

  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl font-bold mb-4">{categoryTitle}</h2>
      <div className="flex items-center gap-2 relative">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0 && loopCount === 0}
          className="p-2 bg-white text-black absolute left-0 z-10 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          Previous
        </button>
        <div className="flex overflow-hidden w-full">
          <div
            className="grid grid-flow-col gap-4"
            style={{
              gridTemplateColumns: `repeat(${filmsPerPage}, minmax(0, 1fr))`,
              transition: "transform 0.5s ease",
              transform: `translateX(-${(0 / films.length) * 100}%)`,
            }}
          >
            {displayedFilms.map((film) => (
              <FilmCard key={film._id} film={film} onClick={onFilmClick} />
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          className="p-2 bg-white text-black absolute right-0 z-10 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FilmSlider;
