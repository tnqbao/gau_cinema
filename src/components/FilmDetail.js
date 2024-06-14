import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EpisodesList from "./EpisodesList";
import { GlobalContext } from "../context/GlobalContext";

function FilmDetail() {
  const { slug } = useParams();
  const { DOMAIN_API, handleEpisodeChange } = useContext(GlobalContext);
  const [film, setFilm] = useState(null);
  const [hideContent, setHideContent] = useState(true);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await axios.get(`${DOMAIN_API}/v1/api/phim/${slug}`);
        setFilm(response.data.data);
      } catch (error) {
        console.error("Error fetching film data:", error);
      }
    };
    fetchFilm();
  }, [slug, DOMAIN_API]);

  if (!film) {
    return (
      <div className="flex justify-center items-center p-52">
        <h1 className="text-3xl animate-pulse font-bold bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 text-slate-200">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 bg-repeat bg-containe">
        <div className="progress hidden" style={{ width: "0%" }}>
          <b></b>
          <i></i>
        </div>
        <div className="lg:pt-20 relative overflow-hidden bg-[#121111]">
          <div className="absolute bg-cover h-full hidden lg:block w-7/12 top-0 right-0">
            <div className="flex h-[115%] w-full absolute top-3/4 -left-[20%] -translate-y-2/3">
              <img
                className="h-full aspect-video m-auto flex-shrink-0 w-full object-cover blur-sm"
                src={`https://img.ophim.live/uploads/movies/${film.item.poster_url}`}
                alt={film.item.name}
              />
            </div>
            <div className="absolute aspect-video md:backdrop-blur-sm h-[120%] backdrop-p z-0 top-2/3 -left-[20%] -translate-y-2/3"></div>
            <div className="absolute bg-background w-1/2 h-[120%] -left-3/4 -top-[10%]"></div>
            <div className="left-layer w-[150%] h-[120%] -left-[30%] -top-[10%]"></div>
          </div>

          <div className="bg-cover h-full w-full mb-4 sm:absolute sm:max-w-[280px] sm:aspect-2/3 sm:right-28">
            <img
              className="w-full shadow-md"
              src={`https://img.ophim.live/uploads/movies/${film.item.thumb_url}`}
              alt={film.item.name}
              loading="lazy"
            />
          </div>
          <div className="relative w-full md:w-5/12 top-0 right-0">
            <h1 className="font-bold text-xl md:text-3xl mb-2 text-[#dba902]">
              {film.item.name}
            </h1>
            <h2 className="font-thin text-lg md:text-2xl text-foreground/40 mb-5 text-slate-50">
              {film.item.origin_name}
            </h2>
            <div className="space-y-2 flex flex-col flex-wrap">
              <p className="w-fit space-x-2 mt-2 flex flex-wrap gap-1">
                {film.breadCrumb && film.breadCrumb.length > 0
                  ? film.breadCrumb
                      .slice(0, film.breadCrumb.length - 1)
                      .map((bred) => (
                        <button
                          key={bred.position}
                          className="bg-gray-600/30 text-white w-fit py-1 px-3 text-xs rounded-2xl"
                        >
                          <span className="is-dark">{bred.name}</span>
                        </button>
                      ))
                  : ""}
              </p>
              <ul className="">
                <li className="space-x-2">
                  <span className="text-foreground/50 text-[#dba902] text-lg">
                    Quốc gia:&nbsp;
                  </span>
                  <span className="px-1 border-solid text-slate-100">
                    {film.item.country[0].name}
                  </span>
                </li>
                <li className="space-x-1 ">
                  <span className="text-foreground/50 text-[#dba902] text-lg">
                    Thể loại:&nbsp;
                  </span>
                  <span className="px-1 border-solid text-slate-100">
                    {film.breadCrumb[0].name}
                  </span>
                </li>
                <li className="space-x-2">
                  <span className="text-foreground/50 text-[#dba902] text-lg">
                    Số tập:&nbsp;
                  </span>
                  <span className="px-1 border-solid text-slate-100">
                    {film.item.episode_total} - {film.item.time}
                  </span>
                </li>
                <li className="pb-1 line-clamp-3">
                  <span className="text-foreground/50 border-solid text-[#dba902] text-lg">
                    Diễn viên chính: &nbsp;
                  </span>
                  <span className="border-solid text-slate-100">
                    {film.item.actor && film.item.actor.length > 0
                      ? film.item.actor.map((actor, index) => (
                          <span key={index}>
                            {actor}
                            {index < film.item.actor.length - 1 && ", "}
                          </span>
                        ))
                      : "Đang cập nhật"}
                  </span>
                </li>
              </ul>
              <div className="space-x-3 flex w-full flex-wrap mt-3 border-r-slate-50 rounded-sm ">
                <div className="with-title mt-8 dark:!border-white">
                  <p className=" text-lg title !-mt-10 !bg-background text-[#dba902]">
                    Miêu tả
                  </p>
                  <p className=" text-slate-100">
                    {hideContent
                      ? film.seoOnPage.descriptionHead
                      : film.item.content.startsWith("<p>")
                      ? film.item.content.split("<p>")[1].split("</p>")[0]
                      : film.item.content}
                  </p>
                  <button
                    className="m-0 p-0 focus:outline-none text-[#a79047] drop-shadow-2xl"
                    onClick={() => setHideContent(!hideContent)}
                  >
                    {hideContent ? "Hiển Thị Thêm" : "Ẩn Bớt"}
                  </button>
                </div>
                <br />
                <button
                  className="bg-[#dba902] px-20 py-3 rounded-lg w-full font-bold my-2 hover:bg-[#186e5c] relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  onClick={() => handleEpisodeChange(slug, "1", 0)}
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <EpisodesList episodes={film.episodes} slug={slug} />
      </div>
    </div>
  );
}

export default FilmDetail;
