import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

const EpisodesList = ({ episodes, slug }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { handleEpisodeChange, ep, viewedEpisodes } = useContext(GlobalContext);

  const openList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-6 rounded-md">
      {Array.isArray(episodes) &&
        episodes.map((server, serverIndex) => (
          <div key={serverIndex} className="p-5">
            <h2>
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-[#dba902] rounded-md dark:border-gray-700 dark:text-gray-400 hover:bg-slate-700 dark:hover:bg-gray-800 gap-3"
                onClick={openList}
              >
                <p className="flex items-center ">
                  <span className="text-2xl font-bold mr-3 text-amber-600">
                    {server.server_name}
                  </span>
                </p>
                <svg
                  className={`w-6 h-6 ${isOpen ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </h2>
            <div
              className={`p-5 border border-[#dba902] rounded-md dark:border-gray-700 ${
                isOpen ? "" : "hidden"
              }`}
            >
              <div className="p-5 border border-[#dba902] rounded-md flex flex-wrap text-center justify-center">
                {Array.isArray(server.server_data) &&
                  server.server_data.map((episode, episodeIndex) => (
                    <button
                      key={episodeIndex}
                      onClick={() =>
                        handleEpisodeChange(slug, episode.name, serverIndex)
                      }
                      className={` min-w-[7rem] flex mx-2 my-2 items-center justify-center rounded-md p-3 font-bold w-3 hover:bg-[#2c3f3b] relative after:absolute after:bottom-0 after:left-0 after:bg-slate-700 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300  ${
                        parseInt(ep) === episodeIndex + 1
                          ? "border-4 border-red-500"
                          : ""
                      } ${
                        (viewedEpisodes[slug] &&
                          viewedEpisodes[slug].includes(episode.name))
                          ? "bg-green-900 text-white hover:bg-[#2c3f3b]"
                          : "bg-[#dba902] text-black"
                      }`}
                    >
                      {episode.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EpisodesList;
