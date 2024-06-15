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

      } 
      else if(window.innerWidth<768)
      {
        setFilmsPerPage(2);
      }
      else if (window.innerWidth < 1024) {
        setFilmsPerPage(3);
      } else {
        setFilmsPerPage(Math.ceil(window.innerWidth/320));
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

  const displayedFilms =
    films && films.length
      ? films.slice(startIndex, startIndex + filmsPerPage)
      : [];

  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl font-bold mb-4">{categoryTitle}</h2>
      <div className="flex items-center gap-2 relative">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0 && loopCount === 0}
          className="px-5 py-20 md:py-44 rounded-xl bg-[#dba902]/50 text-black absolute left-0 z-10 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity duration-300 border-y-slate-500 text-xl after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 text-white cursor-pointer"
          >
            <path
              fill-rule="evenodd"
              d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
              clip-rule="evenodd"
            />
          </svg>
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
          className="px-5 py-20 md:py-44 rounded-xl bg-[#dba902]/50 text-black absolute right-0 z-10 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity duration-300 border-y-slate-500 text-xl after:absolute after:bottom-0 after:right-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 text-white font-bold cursor-pointer"
          >
            <path
              fill-rule="evenodd"
              d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilmSlider;
