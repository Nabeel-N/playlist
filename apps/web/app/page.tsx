"use client";
import { useState, useEffect } from "react";
import Sidebar from "@repo/ui/Sidebar";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        // Using localhost ensures the browser matches the session cookie correctly
        const response = await fetch("http://localhost:8080/song", {
          method: "GET",
          credentials: "include", // Essential for keeping you logged in
        });

        setStatus(response.status);

        if (response.ok) {
          const data = await response.json();
          // Fallback to empty array if no songs exist
          setSongs(data.songs || (Array.isArray(data) ? data : []));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setStatus(500);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden font-sans">
      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter">Your Library</h1>
          <div className="flex items-center gap-4">
            {status === 200 && (
              <button
                onClick={() => window.location.reload()}
                className="text-xs font-bold text-zinc-500 hover:text-lime-500 transition-colors uppercase tracking-widest"
              >
                Refresh Data
              </button>
            )}
          </div>
        </div>

        {loading ? (
          /* Loading State Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 aspect-square rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : status === 401 ? (
          /* 401 Unauthorized State */
          <div className="flex flex-col items-center justify-center mt-20 p-12 bg-zinc-900/30 border border-zinc-800 rounded-3xl text-center max-w-xl mx-auto shadow-2xl">
            <div className="bg-zinc-800/50 p-5 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Session Expired</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              To keep your data safe, we need you to sign in again via Google.
            </p>
            <a
              href="http://localhost:8080/auth/google"
              className="px-10 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              SIGN IN WITH GOOGLE
            </a>
          </div>
        ) : songs.length > 0 ? (
          /* Song Grid Display */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/40 group hover:bg-zinc-800/60 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-md"
              >
                <div className="relative aspect-square mb-5 overflow-hidden rounded-xl bg-zinc-800 shadow-2xl">
                  <img
                    src={
                      song.thumbnail ||
                      "https://placehold.co/600x600/18181b/52525b?text=No+Artwork"
                    }
                    alt={song.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-lime-500 rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">
                      <svg
                        className="w-6 h-6 text-black fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold truncate text-zinc-100 text-lg">
                  {song.name}
                </h3>
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-[0.2em] font-black group-hover:text-lime-500 transition-colors">
                  Digital Track
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/10 rounded-3xl border-2 border-dashed border-zinc-800/50">
            <p className="text-zinc-500 font-medium italic">
              Your music library is currently empty.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
