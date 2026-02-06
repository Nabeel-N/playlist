"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@repo/ui/Sidebar"; // Adjust path if needed

// 1. Define the interface based on standard podcast data
interface Podcast {
  id: string;
  name: string; // or title
  host?: string;
  description?: string;
  coverImage?: string; // or imageUrl
  episodes?: any[];
}

export default function PodcastPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        setLoading(true);
        // 2. Fetch from your backend endpoint
        const response = await fetch("http://localhost:8080/podcast", {
          credentials: "include", // Important for Auth
        });

        if (!response.ok) {
          if (response.status === 401)
            throw new Error("Unauthorized: Please log in.");
          throw new Error("Failed to load podcasts");
        }

        const data = await response.json();
        setPodcasts(data.podcasts || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
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
          <h1 className="text-4xl font-bold text-white">Podcasts</h1>
          <p className="text-zinc-400 mt-2">Listen to the latest episodes</p>
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
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg inline-block">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="bg-zinc-900/40 p-4 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer group"
              >
                {/* Podcast Cover Art */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
                  {podcast.coverImage ? (
                    <img
                      src={podcast.coverImage}
                      alt={podcast.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-800 to-zinc-900 flex items-center justify-center text-4xl">
                      🎙️
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-bold text-lg truncate">{podcast.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {podcast.host || "Unknown Host"}
                </p>
                <p className="text-zinc-500 text-xs mt-2 line-clamp-2">
                  {podcast.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && podcasts.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No podcasts available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
