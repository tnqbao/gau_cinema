import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Artplayer from "artplayer";
import Hls from "hls.js";
import EpisodesList from "./EpisodesList";

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

  const playM3u8 = (video, url, art) => {
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
  };

  useEffect(() => {
    const fetchFilm = async () => {
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
        } else {
          const trailerUrl = response.data.data.trailer_url;
          if (trailerUrl) {
            setVideoUrl(trailerUrl);
            setError(null);
          } else {
            setError("Video not found");
          }
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
    };

    fetchFilm();
  }, [slug, DOMAIN_API, server, episode]);

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
            name: "your-button",
            index: 100,
            position: "left",
            html: "Về Tập Trước",
            tooltip: "Your Button",
            style: {
              color: "white",
            },
            click: function (...args) {
              // if(ep>1) onEpisodeChange
            },
            mounted: function (...args) {
              console.info("mounted", args);
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
  }, [videoUrl, slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error && !videoUrl) {
    return <div>{error}</div>;
  }

  return (
    <div className="video-player">
      <h1 className="">{ep}</h1>
      <div className="" ref={playerRef} style={{ width: "100%", height: "600px" }}></div>
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
