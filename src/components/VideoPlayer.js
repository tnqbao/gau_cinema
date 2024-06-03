import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Artplayer from "artplayer";
import Hls from "hls.js";

function VideoPlayer({ DOMAIN_API }) {
  const { slug, chapter } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  const playM3u8 = (video, url, art) => {
    if (Hls.isSupported()) {
      if (art.hls) art.hls.destroy();
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      art.hls = hls;
      art.on('destroy', () => hls.destroy());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else {
      art.notice.show = 'Unsupported playback format: m3u8';
    }
  };

  useEffect(() => {
    const fetchFilm = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${DOMAIN_API}/v1/api/phim/${slug}?chapter=${chapter}`);
        const episodeIndex = 0; // Change this if you want to fetch a specific episode
        const videoLink = response.data.data.item.episodes[0].server_data[episodeIndex].link_m3u8; 
        if (videoLink) {
          setVideoUrl(videoLink);
          setError(null);
        } else {
          setError("Video not found");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('404 Not Found. Retrying...');
          setTimeout(fetchFilm, 1000);
        } else {
          setError("Error fetching film data: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [chapter, slug, DOMAIN_API]);

  useEffect(() => {
    if (videoUrl && playerRef.current) {
      const art = new Artplayer({
        container: playerRef.current,
        url: videoUrl,
        type: 'm3u8',
        poster: `https://img.ophim.live/uploads/movies/${slug}-poster.jpg`,
        customType: {
          m3u8: playM3u8,
        },
        autoplay: false,
        autoSize: true,
        hotkey : true,
        autoMini: true,
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
      });
      
      art.on('ready', () => {
        console.info('ArtPlayer is ready');
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
      <h2>Video Player</h2>
      <div ref={playerRef} style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
}

export default VideoPlayer;
