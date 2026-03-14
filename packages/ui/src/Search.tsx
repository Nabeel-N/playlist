"use client";
import React, { useEffect, useState } from "react";

interface Song {
  id: string;
  name: string;
  thumbnail: string;
  artist?: { name: string };
}

interface SearchProp {
  icon: React.ReactNode;
  placeholder?: string;
  song: Song[];
}

export default function Search({
  icon,
  placeholder = "What do you want to play?",
  song,
}: SearchProp) {
  const [searchtext, setSearchText] = useState("");
  const filteredSongs = song.filter((s) =>
    s.name.toLowerCase().includes(searchtext.toLowerCase()),
  );

  const [click, SetClick] = useState(false);

  function SearcboxClick() {
    SetClick(!click);
  }

  return (
    <div className="relative w-full max-w-[450px] ">
      <div className="group flex items-center gap-3 bg-[#242424] hover:bg-green-900 px-4 py-3 rounded-full w-full border border-transparent hover:border-white/10 focus-within:border-white/20 focus-within:bg-[#2a2a2a] transition-all z-50 relative">
        {/* Icon Container */}
        <div className="text-neutral-400 group-focus-within:text-white transition-colors flex shrink-0">
          {icon}
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          className="bg-transparent text-white placeholder-neutral-400 text-sm font-medium focus:outline-none w-full truncate "
          onChange={(e) => setSearchText(e.target.value)}
          onClick={SearcboxClick}
          value={searchtext}
        />
      </div>

      {searchtext && (
        <div className="absolute top-[110%] left-0 w-full bg-[#282828] border border-white/10 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-40 [scrollbar-width:thin]">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((s) => (
              <a
                key={s.id}
                href={`/song/${s.id}`}
                className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <img
                  src={s.thumbnail}
                  alt={s.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-sm font-medium truncate">
                    {s.name}
                  </span>
                  <span className="text-neutral-400 text-xs truncate">
                    {s.artist?.name || "Unknown Artist"}
                  </span>
                </div>
              </a>
            ))
          ) : (
            // 4. Show this if nothing matches the search
            <div className="p-4 text-center text-sm text-neutral-400">
              No results found for "{searchtext}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
