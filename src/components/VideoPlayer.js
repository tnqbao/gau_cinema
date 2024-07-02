import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { Helmet } from "react-helmet-async";
import { GlobalContext } from "../context/GlobalContext";
import EpisodesList from "./EpisodesList";

function VideoPlayer() {
  const { DOMAIN_API, handleEpisodeChange, ep } = useContext(GlobalContext);

  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const episode = queryParams.get("ep") || "1";
  const server = queryParams.get("server") || "0";

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [film, setFilm] = useState(null);
  const playerRef = useRef(null);
  const artRef = useRef(null);

  const playM3u8 = useCallback((video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      art.notice.show = "Unsupported playback format: m3u8";
    }
  }, []);

  const fetchFilm = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DOMAIN_API}/v1/api/phim/${slug}`);
      setFilm(response.data);
      const videoLink =
        response.data.data.item.episodes[0].server_data.length > 1
          ? response.data.data.item.episodes[0].server_data.find(
              (ep) => ep.name === episode
            ).link_m3u8
          : response.data.data.item.episodes[0].server_data[0].name.length > 0
          ? response.data.data.item.episodes[0].server_data[0].link_m3u8
          : response.data.data.trailer_url;

      if (videoLink) {
        setVideoUrl(videoLink);
        setError(null);
      } else if (response.data.data.trailer_url) {
        setVideoUrl(response.data.data.trailer_url);
        setError(null);
      } else {
        setError("Video not found");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("404 Not Found. Retrying...");
        setTimeout(fetchFilm, 1000);
      } else {
        setError("Error fetching film data: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [DOMAIN_API, slug, episode]);

  useEffect(() => {
    fetchFilm();
  }, [fetchFilm]);

  useEffect(() => {
    if (videoUrl && playerRef.current) {
      const art = new Artplayer({
        container: playerRef.current,
        url: videoUrl,
        type: videoUrl.endsWith(".m3u8") ? "m3u8" : "youtube",
        poster: `https://img.ophim.live/uploads/movies/${slug}-poster.jpg`,
        customType: {
          m3u8: playM3u8,
          youtube: (video, url, art) => {
            const videoId = new URL(url).searchParams.get("v");
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            video.appendChild(iframe);

            art.on("destroy", () => {
              iframe.src = "";
            });
          },
        },
        autoplay: false,
        autoSize: true,
        hotkey: true,
        autoMini: false,
        screenshot: true,
        setting: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: true,
        localSubtitle: true,
        networkMonitor: true,
        controls: [
          {
            name: "next-episode",
            index: 15,
            position: "left",
            html: `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-13"></use><path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ytp-id-13"></path></svg>`,
            tooltip: "Tập Tiếp Theo",
            style: {
              color: "white",
            },
            click: () => {
              const currentEpisode = parseInt(episode);
              const totalEpisodes =
                film.data.item.episodes[0].server_data.length;
              if (currentEpisode < totalEpisodes) {
                const nextEpisode = currentEpisode + 1;
                handleEpisodeChange(slug, nextEpisode + "", server);
              }
            },
            mounted: () => {
              const currentEpisode = parseInt(episode);
              const totalEpisodes = film.data.item.episodes.length;
              if (currentEpisode < totalEpisodes) {
                const nextEpisode = currentEpisode + 1;
                handleEpisodeChange(slug, nextEpisode, server);
              }
            },
          },
        ],
      });

      artRef.current = art;

      art.on("ready", () => {
        art.layers.add({
          name: "poster",
          html: `<button class="hidden md:block" style="border-radius: 0.25rem; background: rgba(26, 23, 23, 0.7); border: none; font-size: 1.5rem; padding: 0.75rem 1.25rem; width: 16rem;">Bỏ qua giới thiệu</button>`,
          tooltip: "Bỏ qua giới thiệu",
          style: {
            position: "absolute",
            right: "12rem",
            bottom: "6rem",
            backgroundColor: "transparent",
            width: "9rem",
            paddingInline: "2rem",
          },
          click: function (...args) {
            art.currentTime = 90;
            art.layers.remove("poster");
          },
          mounted: function (...args) {
            console.info("mounted", args);
          },
        });
        setTimeout(() => {
          art.layers.remove("poster");
        }, 60000);
      });

      return () => {
        art.destroy(true);
      };
    }
  }, [videoUrl, slug, episode, server, navigate, playM3u8, film, handleEpisodeChange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 text-slate-200">
          Loading...
        </h1>
      </div>
    );
  }

  if (error && !videoUrl) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 text-slate-200">
          Phim Chưa Cập Nhật
        </h1>
      </div>
    );
  }

  return (
    <div className="video-player">
      <Helmet>
        <title>{film.data.item.name + " - Tập " + ep}</title>
      </Helmet>
      <h1 className="text-center justify-center font-bold text-amber-400 p-1 text-4xl mt-52">
        {film.data.item.name +
          " - Tập " +
          (Array.isArray(film.data.item.episodes?.server_data) &&
          film.data.item.episodes.server_data.length <= 1
            ? "Full"
            : ep)}
      </h1>
      <div className="relative w-full pt-[56.25%] flex justify-center p-5 mt-16">
        <div
          ref={playerRef}
          className="absolute inset-0 w-full h-full lg:p-9"
        ></div>
      </div>
      {film && (
        <EpisodesList
          episodes={film.data.item.episodes}
          slug={slug}
          handleEpisodeChange={handleEpisodeChange}
          ep={ep}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
