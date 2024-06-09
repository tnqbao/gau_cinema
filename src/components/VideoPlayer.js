import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Artplayer from "artplayer";
import Hls from "hls.js";
import EpisodesList from "./EpisodesList";
import FilmDetail from "./FilmDetail";

function VideoPlayer({ DOMAIN_API, onEpisodeChange, ep }) {
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
      const episodes = response.data.data.item.episodes;
      const selectedEpisode = episodes.find((ep) =>
        ep.server_data.find((srv) => srv.name === episode)
      );
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
  }, [DOMAIN_API, slug, episode, server]);

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
            tooltip: "Next Episode",
            style: {
              color: "white",
            },

            click: () => {
              const currentEpisode = parseInt(episode);
              const totalEpisodes =
                film.data.item.episodes[0].server_data.length;
              console.log(currentEpisode);
              console.log(totalEpisodes);
              if (currentEpisode < totalEpisodes) {
                const nextEpisode = currentEpisode + 1;
                onEpisodeChange(slug, nextEpisode, server);
              }
            },
            mounted: () => {
              const currentEpisode = ep;
              const totalEpisodes = film.data.item.episodes.length;
              if (currentEpisode < totalEpisodes) {
                const nextEpisode = currentEpisode + 1;
                onEpisodeChange(slug, nextEpisode, server);
              }
            },
          },
        ],
      });

      artRef.current = art;

      art.on("ready", () => {
        console.info("ArtPlayer is ready");
      });

      return () => {
        art.destroy(true);
      };
    }
  }, [
    videoUrl,
    slug,
    episode,
    server,
    navigate,
    playM3u8,
    film,
    onEpisodeChange,
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error && !videoUrl) {
    return <div>{error}</div>;
  }

  return (
    <div className="video-player">
      <h1 className="text-center justify-center font-bold text-amber-400 p-1 text-4xl mt-5">
        {film.data.item.name + " - Tập " + ep}
      </h1>
      <div className="relative w-full pt-[56.25%] flex justify-center p-5">
        <div
          ref={playerRef}
          className="absolute inset-0 w-full h-full p-9"
        ></div>
        //
      </div>
      {film && (
        <EpisodesList
          episodes={film.data.item.episodes}
          slug={slug}
          onEpisodeChange={onEpisodeChange}
          ep={ep}
        />
      )}
     
    </div>
  );
}

export default VideoPlayer;
