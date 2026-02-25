"use client";
import React from "react";
import useFetch from "../../../../packages/ui/src/customhooks/usefetchhook";
import { Heart, Play } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of your Song data
interface Song {
  id: string;
  name: string;
  thumbnail: string;
  artist?: { name: string };
}

// Define the shape of the backend response
interface LikedSongsResponse {
  songs: Song[];
}

export default function LikedSong() {
  const [data, loading, error] = useFetch<LikedSongsResponse>(
    "http://localhost:8080/song/liked",
    "GET",
  );

  const router = useRouter();

  function clicksong(songid: string) {
    router.push("/song/" + songid);
  }

  // Safely extract the songs array
  const songs = data?.songs || [];

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Dynamic Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-800/80 to-[#121212] -z-10" />

        <div className="p-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center md:items-end gap-6 pt-10 mb-8">
            <div className="shrink-0 w-52 h-52 bg-gradient-to-br from-indigo-500 to-purple-400 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded flex items-center justify-center">
              <Heart
                size={80}
                fill="white"
                className="text-white drop-shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-2 w-full text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Playlist
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2">
                Liked Songs
              </h1>
              <p className="text-white/80 font-medium text-sm">
                User • {songs.length} {songs.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </header>

          {/* Big Play Button */}
          {songs.length > 0 && !loading && (
            <div className="py-6 flex items-center">
              <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 hover:bg-green-400 transition shadow-lg translate-y-0 active:translate-y-1">
                <Play fill="currentColor" size={26} className="ml-1" />
              </button>
            </div>
          )}

          {/* Content States */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-4 rounded-xl animate-pulse aspect-square"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-400 text-xl font-bold mb-4">{error}</p>
              {error.includes("401") && (
                <a
                  href="http://localhost:8080/auth/google"
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Log In to Continue
                </a>
              )}
            </div>
          ) : songs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {songs.map((song) => (
                <div
                  onClick={() => clicksong(song.id)}
                  key={song.id}
                  className="group bg-zinc-900/40 hover:bg-zinc-800 transition-all duration-300 p-4 rounded-xl cursor-pointer relative"
                >
                  <div className="relative aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-md overflow-hidden">
                    <img
                      src={
                        song.thumbnail || "https://placehold.co/400?text=Music"
                      }
                      alt={song.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-h-[60px]">
                    <h3 className="font-bold text-base text-white truncate mb-1">
                      {song.name}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {song.artist?.name || "Unknown Artist"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
              <Heart size={64} className="mb-6 opacity-20" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Songs you like will appear here
              </h3>
              <p>Save songs by tapping the heart icon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
