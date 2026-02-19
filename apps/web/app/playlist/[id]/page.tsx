"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@repo/ui/Sidebar";
import HomeIconDuotone from "@repo/ui/icons/HomeIcon";
import {
  Play,
  Clock3,
  Trash2,
  Heart,
  MoreHorizontal,
  Search,
  Music,
  HomeIcon, // Imported Music icon
} from "lucide-react";

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default function PlaylistDetail({ params }: PlaylistPageProps) {
  const { id } = React.use(params);

  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  async function fetchPlaylistDetails() {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/playlist/${id}`, {
        credentials: "include",
      });

      if (response.status === 401) {
        setError("Unauthorized: Please log in to view this playlist.");
      } else if (response.status === 404) {
        setError("Playlist not found.");
      } else if (!response.ok) {
        setError(`Server Error: ${response.statusText}`);
      } else {
        const data = await response.json();
        setPlaylist(data);
        setError(null);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  const getRandomDuration = () => {
    const min = Math.floor(Math.random() * 3) + 2;
    const sec = Math.floor(Math.random() * 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <main className="flex-1 relative overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorState error={error} />
        ) : playlist ? (
          <>
            {/* Dynamic Background Gradient (Darker tone) */}
            <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-neutral-800/50 to-[#121212] -z-10" />
            <HomeIconDuotone />
            <div className="p-8 pb-2">
              {/* Header Section */}
              <header className="flex flex-col md:flex-row items-center md:items-end gap-6 pt-6">
                {/* --- NEW COVER ART DESIGN --- */}
                <div className="shrink-0 w-52 h-52 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-md flex items-center justify-center group relative overflow-hidden">
                  <Music
                    size={80}
                    className="text-neutral-600 group-hover:scale-105 transition-transform duration-300"
                    strokeWidth={1.5}
                  />
                </div>
                {/* --------------------------- */}

                <div className="flex flex-col gap-2 w-full text-center md:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Playlist
                  </span>
                  <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-2 line-clamp-2">
                    {playlist.name}
                  </h1>
                  <p className="text-white/60 text-sm font-medium flex items-center justify-center md:justify-start gap-1">
                    <span className="text-white">User</span>
                    <span>•</span>
                    <span>{playlist.songs?.length || 0} songs</span>
                    <span className="hidden sm:inline">•</span>
                  </p>
                </div>
              </header>
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 flex items-center gap-6">
              <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 hover:bg-green-400 transition shadow-lg translate-y-0 active:translate-y-1">
                <Play fill="currentColor" size={26} className="ml-1" />
              </button>
              <button className="text-white hover:bg-red-600 transition rounded-3xl" >
                <Heart size={35} className="rouned-xl" />
              </button>
              <button className="text-neutral-400 hover:text-white transition">
                <MoreHorizontal size={32} />
              </button>
            </div>

            {/* Songs Table */}
            <div className="px-8 pb-10">
              <div className="bg-black/20 rounded-md">
                {" "}
                {/* Optional container backdrop */}
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="sticky top-0 bg-[#121212] z-10 border-b border-white/10 text-neutral-400 text-sm">
                    <tr>
                      <th className="py-3 px-4 font-normal w-12 text-center">
                        #
                      </th>
                      <th className="py-3 px-4 font-normal w-1/2">Title</th>
                      <th className="py-3 px-4 font-normal hidden md:table-cell">
                        Album
                      </th>
                      <th className="py-3 px-4 font-normal hidden sm:table-cell text-right pr-8">
                        <Clock3 size={16} className="inline" />
                      </th>
                      <th className="py-3 px-4 font-normal w-16 text-center"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-transparent">
                    {playlist.songs?.map((song: any, index: number) => (
                      <tr
                        key={song.id}
                        className="group hover:bg-white/10 transition-colors rounded-md text-sm text-neutral-400 hover:text-white"
                      >
                        <td className="py-3 px-4 text-center align-middle font-medium group-hover:text-white">
                          <span className="group-hover:hidden">
                            {index + 1}
                          </span>
                          <span className="hidden group-hover:inline-block">
                            <Play size={12} fill="currentColor" />
                          </span>
                        </td>
                        <td className="py-3 px-4 align-middle overflow-hidden">
                          <div className="flex flex-col justify-center truncate">
                            <span className="text-white font-medium text-base truncate">
                              {song.name}
                            </span>
                            <span className="text-xs group-hover:text-white/70">
                              Unknown Artist
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 align-middle hidden md:table-cell truncate">
                          Single
                        </td>
                        <td className="py-3 px-4 text-right align-middle hidden sm:table-cell font-variant-numeric tabular-nums pr-8">
                          {getRandomDuration()}
                        </td>
                        <td className="py-3 px-4 text-center align-middle">
                          <button
                            className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-110"
                            title="Remove from playlist"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(!playlist.songs || playlist.songs.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-4">
                  <Search size={48} className="opacity-50" />
                  <p className="font-semibold text-lg">It's a bit empty here</p>
                  <p className="text-sm">Find songs to add to your playlist</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="bg-red-500/10 p-4 rounded-full">
        <span className="text-4xl">⚠️</span>
      </div>
      <p className="text-white text-xl font-bold max-w-md text-center">
        {error}
      </p>
      {error.includes("Unauthorized") && (
        <a
          href="http://localhost:8080/auth/google"
          className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition transform"
        >
          Log In to Continue
        </a>
      )}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="p-8 w-full animate-pulse">
      {/* Header Skeleton - Updated to match new design */}
      <div className="flex flex-col md:flex-row items-end gap-6 pt-6 mb-12">
        <div className="w-52 h-52 bg-neutral-800/50 rounded-md shadow-lg shrink-0" />
        <div className="flex flex-col gap-4 w-full">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-16 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-64 bg-white/10 rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-full bg-white/5 rounded mb-6" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full bg-white/5 rounded flex items-center px-4 gap-4"
          >
            <div className="h-4 w-4 bg-white/10 rounded" />
            <div className="h-4 w-1/3 bg-white/10 rounded" />
            <div className="h-4 w-1/4 bg-white/10 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
