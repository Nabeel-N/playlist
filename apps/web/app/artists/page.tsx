"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@repo/ui/Sidebar"; // Assuming you have this from previous steps

// 1. Define the shape of an Artist based on your Prisma schema/Repository
interface Artist {
  id: string;
  name: string;
  bio: string;
  profilePic?: string | null;
  songs?: any[]; // The repository includes songs
}

export default function ArtistPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchArtists() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/artist", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in.");
          }
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setArtists(data.artists || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load artists");
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar for navigation consistency */}
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Artists</h1>
          <p className="text-zinc-400 mt-2">
            Discover the creators behind the music
          </p>
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-zinc-900/50 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        ) : (
          /* Success State - Artist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer group"
              >
                {/* Profile Picture */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-full shadow-lg">
                  {artist.profilePic ? (
                    <img
                      src={artist.profilePic}
                      alt={artist.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-4xl text-zinc-600">
                      🎤
                    </div>
                  )}
                </div>

                {/* Artist Info */}
                <h3 className="font-bold text-lg truncate">{artist.name}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mt-1 h-10 leading-relaxed">
                  {artist.bio}
                </p>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-zinc-400 uppercase font-medium">
                  <span>Artist</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-white">
                    {artist.songs?.length || 0} Songs
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && artists.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No artists found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
