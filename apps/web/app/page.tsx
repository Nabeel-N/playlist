"use client";
import { useState, useEffect } from "react";
import Sidebar from "@repo/ui/Sidebar";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | null>(null);
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/song", {
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

    fetchSongs();
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "DM Sans", sans-serif;
          overflow: hidden;
        }

        .serif-display {
          font-family: "Cormorant Garamond", serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          transition: background 0.3s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .backdrop-blur-glass {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .text-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #a1a1a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-shine {
          position: relative;
          overflow: hidden;
        }

        .card-shine::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s;
        }

        .card-shine:hover::before {
          left: 100%;
        }
      `}</style>

      <div className="flex h-screen w-full bg-black text-white overflow-hidden relative">
        {/* Atmospheric Background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20 pointer-events-none"
          style={{
            backgroundSize: "400% 400%",
            animation: "gradientShift 15s ease infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 40% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          }}
        />

        <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-[1800px] mx-auto px-12 py-16">
            {/* Search Bar */}
            <div
              className="mb-16 animate-fadeInUp"
              style={{ animationDelay: "0.1s", opacity: 0 }}
            >
              <div className="relative max-w-2xl group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 blur transition-all duration-500" />
                <div className="relative flex items-center bg-white/5 backdrop-blur-glass rounded-full border border-white/10 px-8 py-5 group-hover:border-white/20 transition-all duration-300">
                  <svg
                    className="w-6 h-6 text-white/50 mr-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search your collection..."
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-lg font-light"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 font-medium">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Header */}
            <div
              className="flex justify-between items-end mb-16 animate-fadeInUp"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              <div>
                <p className="text-white/40 text-sm font-medium uppercase tracking-[0.3em] mb-4">
                  Personal Collection
                </p>
                <h1 className="serif-display text-8xl font-light tracking-tight text-gradient leading-none">
                  Your Library
                </h1>
              </div>

              {status === 200 && (
                <button
                  onClick={() => window.location.reload()}
                  className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-white group-hover:rotate-180 transition-all duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                    Refresh
                  </span>
                </button>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${0.3 + i * 0.05}s`, opacity: 0 }}
                  >
                    <div className="aspect-square rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 animate-shimmer" />
                    <div className="mt-6 space-y-3">
                      <div className="h-4 bg-white/5 rounded-full w-3/4 animate-shimmer" />
                      <div className="h-3 bg-white/5 rounded-full w-1/2 animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : status === 401 ? (
              <div
                className="flex flex-col items-center justify-center mt-20 animate-fadeInUp"
                style={{ animationDelay: "0.3s", opacity: 0 }}
              >
                <div className="max-w-lg text-center">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full" />
                    <div className="relative bg-white/5 backdrop-blur-glass p-8 rounded-full border border-white/10">
                      <svg
                        className="w-16 h-16 text-white/60"
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
                  </div>

                  <h2 className="serif-display text-5xl font-light text-white/90 mb-6 tracking-tight">
                    Session Expired
                  </h2>
                  <p className="text-white/50 text-lg font-light leading-relaxed mb-12 max-w-md mx-auto">
                    Your authentication has timed out. Please sign in again to
                    continue accessing your music collection.
                  </p>

                  <a
                    href="http://localhost:8080/auth/google"
                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white group-hover:from-purple-100 group-hover:via-blue-50 group-hover:to-purple-100 transition-all duration-500" />
                    <svg className="relative w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="relative">Sign in with Google</span>
                  </a>
                </div>
              </div>
            ) : songs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="group cursor-pointer animate-fadeInUp"
                    style={{
                      animationDelay: `${0.3 + index * 0.05}s`,
                      opacity: 0,
                    }}
                    onMouseEnter={() => setHoveredSong(song.id)}
                    onMouseLeave={() => setHoveredSong(null)}
                  >
                    <div className="relative">
                      {/* Glow Effect */}
                      <div
                        className={`absolute -inset-4 bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-purple-600/0 rounded-3xl blur-2xl transition-all duration-700 ${
                          hoveredSong === song.id
                            ? "from-purple-600/30 via-blue-600/30 to-purple-600/30"
                            : ""
                        }`}
                      />

                      {/* Card */}
                      <div className="relative">
                        {/* Album Art */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/40 card-shine">
                          <img
                            src={
                              song.thumbnail ||
                              "https://placehold.co/600x600/0a0a0a/404040?text=No+Artwork"
                            }
                            alt={song.name}
                            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                          />

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Play Button */}
                          <div className="absolute bottom-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <button className="bg-white text-black rounded-full p-4 hover:scale-110 active:scale-95 transition-transform shadow-2xl">
                              <svg
                                className="w-6 h-6 fill-current translate-x-0.5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="mt-6">
                          <h3 className="font-semibold text-white/90 text-lg truncate group-hover:text-white transition-colors mb-2">
                            {song.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
                            <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">
                              Digital Track
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-40 animate-fadeInUp"
                style={{ animationDelay: "0.3s", opacity: 0 }}
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-purple-600/10 blur-3xl rounded-full" />
                  <div className="relative">
                    <svg
                      className="w-24 h-24 text-white/20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="serif-display text-4xl font-light text-white/60 mb-4">
                  Nothing Here Yet
                </h3>
                <p className="text-white/40 font-light">
                  Your music library is waiting to be filled
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
