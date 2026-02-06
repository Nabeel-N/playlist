"use client";
import { useEffect, useState } from "react";
import Sidebaricon from "./icons/sidebaricon";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [playlistopen, SetPlaylistopen] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState<any[]>([]); // To store fetched playlists
  const router = useRouter();

  const menuItems = [
    { icon: "🎙️", label: "Podcasts", href: "/podcasts" },
    { icon: "🎤", label: "Artists", href: "/artists" },
  ];

  // 1. Fetch playlists from backend
  async function fetchPlaylists() {
    try {
      const response = await fetch("http://localhost:8080/playlist", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Adjust based on your backend response structure
        setPlaylists(data.playlists || data);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // 2. Handle creating a new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const response = await fetch("http://localhost:8080/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlaylistName }),
        credentials: "include",
      });

      if (response.ok) {
        setNewPlaylistName("");
        SetPlaylistopen(false);
        fetchPlaylists(); // Refresh the list after creating
      }
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `,
        }}
      />

      <aside
        className={`relative bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-500 ease-out h-full flex flex-col ${
          isOpen ? "w-80" : "w-24"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-blue-950/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <button
              onClick={toggleSidebar}
              className="group w-full flex items-center justify-between p-4 glass-card rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <Sidebaricon />
                {isOpen && (
                  <div className="animate-slideIn">
                    <p className="font-semibold text-white/90 text-left text-sm">
                      Navigation
                    </p>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
            {/* General Menu Items */}
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`group w-full flex items-center p-3 glass-card rounded-xl transition-all ${!isOpen ? "justify-center" : "gap-4"}`}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium text-white/70 animate-slideIn">
                    {item.label}
                  </span>
                )}
              </button>
            ))}

            <div className="my-4 border-t border-white/5" />

            {/* Dynamic Playlists */}
            {isOpen && (
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-3 px-2">
                Your Playlists
              </p>
            )}

            <div className="space-y-1">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => router.push(`/playlist/${pl.id}`)}
                  className={`group w-full flex items-center p-3 glass-card rounded-xl transition-all ${!isOpen ? "justify-center" : "gap-4"}`}
                >
                  <span className="text-xl">🎵</span>
                  {isOpen && (
                    <span className="font-medium text-white/90 truncate animate-slideIn">
                      {pl.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-6 border-t border-white/10 space-y-3">
            {playlistopen && isOpen && (
              <div className="p-4 glass-card rounded-xl animate-slideIn border-purple-500/30 mb-2">
                <input
                  autoFocus
                  className="bg-transparent text-white text-sm w-full outline-none mb-3 border-b border-white/10 pb-1"
                  placeholder="New playlist name..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePlaylist}
                    className="text-[10px] bg-purple-600 px-3 py-1 rounded-full font-bold"
                  >
                    CREATE
                  </button>
                  <button
                    onClick={() => SetPlaylistopen(false)}
                    className="text-[10px] bg-white/5 px-3 py-1 rounded-full font-bold"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <button
              className={`w-full group p-4 glass-card rounded-xl transition-all ${!isOpen ? "flex justify-center" : ""}`}
              onClick={() => SetPlaylistopen(!playlistopen)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:rotate-90 transition-transform">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {isOpen && (
                  <div className="text-left animate-slideIn">
                    <p className="font-medium text-white/90">New Playlist</p>
                  </div>
                )}
              </div>
            </button>

            <button
              className={`w-full group p-4 glass-card rounded-xl transition-all ${!isOpen ? "flex justify-center" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {isOpen && (
                  <p className="font-medium text-red-400 animate-slideIn">
                    Sign Out
                  </p>
                )}
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
