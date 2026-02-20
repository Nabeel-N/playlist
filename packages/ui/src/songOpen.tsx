"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  ListPlus,
  Radio,
  Download,
  Share,
  ChevronRight,
} from "lucide-react";

interface SongOpenProps {
  x: number;
  y: number;
  songId: string | null;
  onClose: () => void;
}

interface Playlist {
  id: string;
  name: string;
}

export default function SongOpen({ x, y, songId, onClose }: SongOpenProps) {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // Safely position the menu so it doesn't go off-screen
  const menuWidth = 240;
  const menuHeight = 250;
  const safeX =
    x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 10 : x;
  const safeY =
    y + menuHeight > window.innerHeight
      ? window.innerHeight - menuHeight - 10
      : y;

  async function fetchPlaylists() {
    try {
      const response = await fetch("http://localhost:8080/playlist", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.playlists || []);
      }
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!songId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/playlist/${playlistId}/songs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ songId }),
        },
      );

      if (response.ok) {
        console.log("Song added successfully!");
        onClose();
      } else {
        console.error("Failed to add song to playlist");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div
      style={{ top: safeY, left: safeX }}
      className="fixed z-50 w-60 bg-[#282828] text-neutral-300 text-sm font-medium rounded shadow-2xl border border-white/5 py-1 animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the menu
    >
      <ul className="flex flex-col relative">
        {/* Hover Wrapper for "Add to Playlist" */}
        <div
          className="relative group/playlist"
          onMouseEnter={() => setShowPlaylists(true)}
          onMouseLeave={() => setShowPlaylists(false)}
        >
          <MenuItem
            icon={<Plus size={16} />}
            label="Add to playlist"
            hasSubMenu={true}
          />

          {/* Nested Playlist Sub-menu */}
          {showPlaylists && (
            <div className="absolute top-0 left-[99%] w-56 bg-[#282828] text-neutral-300 rounded shadow-2xl border border-white/5 py-1 max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-left-2 duration-150 [scrollbar-width:thin]">
              {loading ? (
                <div className="px-4 py-3 text-xs text-neutral-500">
                  Loading playlists...
                </div>
              ) : playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 hover:text-white truncate transition-colors"
                  >
                    {playlist.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-neutral-500">
                  No playlists found.
                </div>
              )}
            </div>
          )}
        </div>

        <MenuItem icon={<ListPlus size={16} />} label="Add to queue" />

        <div className="h-px bg-white/10 my-1 mx-2" />

        <MenuItem icon={<Radio size={16} />} label="Go to song radio" />
        <MenuItem icon={<Download size={16} />} label="Download" />

        <div className="h-px bg-white/10 my-1 mx-2" />

        <MenuItem icon={<Share size={16} />} label="Share" />
      </ul>
    </div>
  );
}

// --- Helper Component ---
function MenuItem({
  icon,
  label,
  onClick,
  hasSubMenu = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  hasSubMenu?: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-neutral-400">{icon}</span>
          <span>{label}</span>
        </div>
        {/* Show a right arrow if it triggers a sub-menu */}
        {hasSubMenu && <ChevronRight size={16} className="text-neutral-400" />}
      </button>
    </li>
  );
}
