"use client";
import { useEffect, useState } from "react";

// Define the shape of the Episode data based on your backend
interface EpisodeType {
  id: string;
  title: string;
  duration: number; // in seconds
  url: string;
  podcastId: string;
  createdAt?: string;
}

export default function Episode() {
  const [episodes, setEpisodes] = useState<EpisodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  async function getEpisodes() {
    try {
      const response = await fetch("http://localhost:8080/episode", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Please log in to view episodes.");
        }
        throw new Error("Failed to fetch episodes");
      }

      const data = await response.json();
      setEpisodes(data.episode || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getEpisodes();
  }, []);

  if (loading) {
    return (
      <div className="bg-neutral-900 min-h-screen p-8 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading episodes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900 min-h-screen p-8 text-red-400 flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Episodes</h1>

      {episodes.length === 0 ? (
        <div className="text-neutral-400">No episodes found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors group shadow-lg flex flex-col gap-3"
            >
              {/* Icon / Placeholder Image */}
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-bold text-xl mb-2">
                E
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold truncate" title={ep.title}>
                {ep.title}
              </h2>

              {/* Meta Info */}
              <div className="text-sm text-neutral-400 flex justify-between items-center">
                <span>Duration: {formatDuration(ep.duration)}</span>
              </div>

              {/* Audio Player */}
              <div className="mt-2">
                <audio controls className="w-full h-8 block rounded-md">
                  <source src={ep.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
