import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function FilmDetail({ DOMAIN_API }) {
  const { slug } = useParams();
  const [film, setFilm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await axios.get(`${DOMAIN_API}/v1/api/phim/${slug}`);
        setFilm(response.data.data);
        console.log(response.data.data); // Log the fetched data
      } catch (error) {
        console.error("Error fetching film data:", error);
      }
    };
    fetchFilm();
  }, [slug, DOMAIN_API]);

  const handleWatchClick = () => {
    navigate(`/phim/xem/${slug}`);
  };

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 bg-repeat bg-contain">
        <div className="progress hidden" style={{ width: "0%" }}>
          <b></b>
          <i></i>
        </div>
        <div className="md:pt-20 relative overflow-hidden">
          <div className="absolute bg-cover h-full hidden md:block w-7/12 top-0 right-0">
            <div className="flex h-[115%] w-ful absolute top-3/4 -left-[20%] -translate-y-2/3">
              <img
                className="h-full aspect-video m-auto flex-shrink-0 w-full object-cover"
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
              src={`https://img.ophim.live/uploads/movies/${film.item.poster_url}`}
              alt={film.item.name}
              loading="lazy"
            />
          </div>
          <div className="relative w-full md:w-5/12 bg-transparent">
            <h1 className="font-bold text-xl md:text-3xl mb-2">
              {film.item.name}{" "}
            </h1>
            <h2 className="font-semibold text-lg md:text-2xl text-foreground/40 mb-5">
              {film.item.origin_name}
            </h2>
            <div className="align-middle text-foreground/60 flex font-bold mb-1">
              <div className="flex">
                <i className="nes-icon eye size-1x my-auto mr-6 mb-2"></i>
                <span>{film.item.view}</span>
              </div>
              <span>&nbsp; - &nbsp;</span>
              <div className="flex">
                <i className="nes-icon calendar size-1x my-auto mr-6 mb-2"></i>
                <span>{film.item.year}</span>
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <p className="w-fit space-x-2 mt-2">
                <a
                  className="bg-gray-600/30 text-white w-fit py-1 px-3 text-xs"
                  href="/movie/mi-nhan-muu/chinh-kich"
                >
                  <span className="is-dark">Chính kịch</span>
                </a>
              </p>
              <ul className="text-justify">
                <li className="space-x-2">
                  <span className="text-foreground/50">Quốc gia:&nbsp; </span>
                  <a className="px-1" href="/movie/mi-nhan-muu/trung-quoc">
                    Trung Quốc
                  </a>
                </li>
                <li className="space-x-2">
                  <span className="text-foreground/50">Thể loại:&nbsp; </span>
                  <span className="px-1">series</span>
                </li>
                <li className="space-x-2">
                  <span className="text-foreground/50">Số tập:&nbsp; </span>
                  <span className="px-1">24 - 13 phút/tập</span>
                </li>
                <li className="pb-1 line-clamp-3">
                  <span className="text-foreground/50">
                    Diễn viên chính:&nbsp;{" "}
                  </span>
                  <span>
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
              <div className="space-x-3 flex w-full flex-wrap mt-3">
                <div className="nes-container with-title mt-5 dark::!border-white !w-full">
                  <p className="title !-mt-10 !bg-background">Miêu tả</p>
                  <p className="line-clamp-3">{film.item.content}</p>
                  <button className="m-0 p-0 focus:outline-none text-red-600/60 hover:text-red-600/80">
                    Hiển thị thêm
                  </button>
                </div>
                <a
                  className="nes-btn is-error flex mt-5 dark:!border-white"
                  title="Xem tập mới nhất"
                  href="/movie/mi-nhan-muu/watch?ep=23&amp;server=0"
                >
                  <i className="nes-icon play size-1x"></i>
                  <span>&nbsp;Xem phim</span>
                </a>
                <button
                  type="button"
                  title="share"
                  className="nes-btn flex mt-5"
                >
                  <i className="nes-icon facebook-square"></i>
                  <span>&nbsp;Chia sẻ</span>
                </button>
                <div
                  className="w-full md:w-max mt-3"
                  v-if="!validChildData &amp;&amp; seasonData?.titles.nodes.length"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilmDetail;
