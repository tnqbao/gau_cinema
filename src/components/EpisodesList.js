import React from "react";

const EpisodesList = ({ episodes, slug, onEpisodeChange, ep }) => {
  return (
    <div className="mt-10">
      {Array.isArray(episodes) &&
        episodes.map((server, serverIndex) => (
          <div key={serverIndex}>
            <h2>
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
              >
                <p className="flex items-center">
                  <i className="nes-icon folder"></i>
                  <span>&nbsp;{server.server_name}</span>
                </p>
                <i className="nes-icon caret-down"></i>
              </button>
            </h2>
            <div className="overflow-hidden text-sm">
              <div className="p-5 border border-gray-200 flex flex-wrap text-center">
                {server.server_data.map((episode, episodeIndex) => (
                  <button
                    key={episodeIndex}
                    title={`Tập ${episode.name}`}
                    className={`min-w-[7rem] flex mx-2 my-2 items-center justify-center rounded-md p-3 ${
                      ep === episode.name ? "bg-gray-800 text-white" : "bg-[#dba902] text-black"
                    }`}
                    onClick={() => onEpisodeChange(slug, episode.name, serverIndex)}
                  >
                    Tập {episode.name}
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
