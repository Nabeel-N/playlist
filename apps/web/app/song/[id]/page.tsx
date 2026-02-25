"use client";
import React, { useEffect, useState } from "react";
import { Play, Pause, Heart, MoreHorizontal } from "lucide-react";

interface Song {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  artistId: string;
  artist?: { name: string };
  isLiked?: boolean; // Optional: if backend returns this on initial load
}

interface SongPageProps {
  params: Promise<{ id: string }>;
}

export default function SongDetail({ params }: SongPageProps) {
  const { id } = React.use(params);

  // Setup State
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch the song data
  useEffect(() => {
    async function fetchSongDetails() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/song/${id}`, {
          credentials: "include", // Important to send session cookie
        });

        if (response.status === 401) {
          setError("Unauthorized: Please log in.");
        } else if (response.status === 404) {
          setError("Song not found.");
        } else if (!response.ok) {
          setError(`Server Error: ${response.statusText}`);
        } else {
          const data = await response.json();
          setSong(data);

          // If your backend includes whether the user already liked it
          if (typeof data.isLiked === "boolean") {
            setIsLiked(data.isLiked);
          }

          setError(null);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchSongDetails();
  }, [id]);

  // Handle Liking / Unliking the song
  const handleLikeToggle = async () => {
    // Optimistic UI update (makes it feel instant)
    setIsLiked(!isLiked);

    try {
      const response = await fetch(`http://localhost:8080/song/${id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Sync state strictly with database response
        setIsLiked(data.liked);
      } else {
        // Revert if request fails
        setIsLiked(!isLiked);
        console.error("Failed to toggle like status");
      }
    } catch (err) {
      // Revert if network error
      setIsLiked(!isLiked);
      console.error("Network error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212] text-white">
        <p className="animate-pulse text-zinc-400">Loading song...</p>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212] text-white">
        <p className="text-red-400 font-bold">
          {error || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] text-white overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-20 blur-3xl scale-110 -z-10"
        style={{
          backgroundImage: `url(${song.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] -z-10" />

      <main className="flex-1 overflow-y-auto p-8 pt-20 flex flex-col items-center sm:items-start max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center sm:items-end gap-8 mb-10 w-full">
          {/* Cover Art */}
          <div className="shrink-0 w-64 h-64 shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-md overflow-hidden">
            <img
              src={song.thumbnail}
              alt={song.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Song Info */}
          <div className="flex flex-col gap-2 text-center sm:text-left w-full">
            <span className="text-xs font-bold uppercase tracking-widest text-white/90">
              Song
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-2 line-clamp-2">
              {song.name}
            </h1>
            <p className="text-white/70 font-medium text-lg flex items-center justify-center sm:justify-start gap-2">
              <span className="text-white font-bold hover:underline cursor-pointer">
                {song.artist?.name || "Unknown Artist"}
              </span>
              <span>•</span>
              <span className="text-sm opacity-75">
                {song.id.slice(0, 8)}...
              </span>
            </p>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex items-center gap-6 w-full mb-8">
          <button className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 hover:bg-green-400 transition shadow-xl translate-y-0 active:translate-y-1">
            <Play fill="currentColor" size={30} className="ml-1" />
          </button>

          {/* LIKED SONG TOGGLE BUTTON */}
          <button
            onClick={handleLikeToggle}
            className={`transition transform hover:scale-110 active:scale-95 ${
              isLiked ? "text-green-500" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Heart size={36} fill={isLiked ? "currentColor" : "none"} />
          </button>

          <button className="text-neutral-400 hover:text-white transition">
            <MoreHorizontal size={36} />
          </button>
        </div>

        {/* Audio Player */}
        {song.url && (
          <div className="w-full max-w-2xl bg-indigo-500 p-3 rounded-xl ">
            <h3 className="text-sm font-semibold text-neutral-400 mb-2">
              Audio Preview
            </h3>
            <audio
              controls
              src={song.url}
              className="w-full custom-audio bg-yellow-600 rounded-2xl"
              controlsList="nodownload"
            />
          </div>
        )}
      </main>
    </div>
  );
}
