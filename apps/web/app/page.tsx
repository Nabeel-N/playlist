"use client";
import { useState, useEffect, MouseEvent as ReactMouseEvent } from "react";
import Sidebar from "@repo/ui/Sidebar";
import HomeIcon from "@repo/ui/icons/HomeIcon";
import SongOpen from "@repo/ui/songOpen";

interface Song {
  id: string;
  name: string;
  thumbnail: string;
  artist?: { name: string };
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  songId: string | null;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | null>(null);
  const [greeting, setGreeting] = useState("Good morning");

  // State for the custom right-click menu
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    songId: null,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Close context menu when clicking anywhere else
  useEffect(() => {
    const closeMenu = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const fetchSongs = async (url: string) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      setStatus(response.status);

      if (response.ok) {
        const data = await response.json();
        setSongs(data.songs || (Array.isArray(data) ? data : []));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs("http://localhost:8080/song");
  }, []);

  // Handler for Right-Click
  const handleRightClick = (e: ReactMouseEvent, songId: string) => {
    e.preventDefault(); // Prevent default browser menu

    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      songId: songId,
    });
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans selection:bg-green-500 selection:text-black">
      <div className="flex-shrink-0 h-full">
        <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>

      <main className="flex-1 relative overflow-y-auto bg-zinc-900 rounded-lg m-2 ml-0 custom-scrollbar">
        <div className="p-4 relative z-20">
          <HomeIcon className="size-8" />
        </div>

        <div className="absolute inset-0 h-80 bg-gradient-to-b from-indigo-900/80 to-zinc-900 pointer-events-none" />
        <div className="relative z-10 p-8 pt-0">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
            <div className="flex gap-4">
              <div className="bg-black/40 hover:bg-black/60 transition p-1 pr-3 rounded-full flex items-center gap-2 cursor-pointer">
                <div className="w-7 h-7 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold">
                  U
                </div>
                <span className="text-sm font-bold text-zinc-200">User</span>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-800/50 p-4 rounded-md animate-pulse"
                >
                  <div className="w-full aspect-square bg-zinc-700/50 rounded-md mb-4" />
                  <div className="h-4 bg-zinc-700/50 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-700/50 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : status === 401 ? (
            // ... [Login Error State remains the same] ...
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="mb-6 p-6 bg-zinc-800 rounded-full shadow-2xl">
                <svg
                  className="w-12 h-12 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Log in to see your music
              </h2>
              <a
                href="http://localhost:8080/auth/google"
                className="px-8 py-3 mt-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                Log in with Google
              </a>
            </div>
          ) : songs.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Top Mixes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {songs.map((song) => (
                  <div
                    // Trigger custom right click handler
                    onContextMenu={(e) => handleRightClick(e, song.id)}
                    key={song.id}
                    className="group bg-zinc-900/40 hover:bg-zinc-800 transition-all duration-300 p-4 rounded-3xl cursor-pointer relative"
                  >
                    <div className="relative aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-md overflow-hidden">
                      <img
                        src={
                          song.thumbnail ||
                          "https://placehold.co/400?text=Music"
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
            </div>
          ) : (
            // ... [Empty State remains the same] ...
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold">It's a bit quiet here</h3>
            </div>
          )}
        </div>
      </main>

      {/* Render the Custom Context Menu */}
      {contextMenu.visible && (
        <SongOpen
          x={contextMenu.x}
          y={contextMenu.y}
          songId={contextMenu.songId}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}
    </div>
  );
}
