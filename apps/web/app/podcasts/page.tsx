"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@repo/ui/Sidebar";

interface Podcast {
  id: string;
  name: string;
  profilePic?: string;
  genre?: string;
  about?: string;
}

export default function Podcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:8080/podcast", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401)
            throw new Error("Unauthorized: Please log in.");
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        setPodcasts(data.podcasts || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load podcasts");
      } finally {
        setLoading(false);
      }
    }

    fetchPodcasts();
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">Podcasts</h1>
          <p className="text-zinc-400 mt-2">Explore shows by genre and topic</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-zinc-900/50 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer group flex flex-col h-full"
              >
                {/* Profile Pic / Cover */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
                  {podcast.profilePic ? (
                    <img
                      src={podcast.profilePic}
                      alt={podcast.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-900 to-zinc-900 flex items-center justify-center text-4xl">
                      🎙️
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-lg truncate mb-1">
                    {podcast.name}
                  </h3>

                  {podcast.genre && (
                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
                      {podcast.genre}
                    </span>
                  )}

                  <p className="text-zinc-400 text-sm line-clamp-2 mt-auto">
                    {podcast.about}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && podcasts.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No podcasts found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
