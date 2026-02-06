"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@repo/ui/Sidebar";

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default function PlaylistDetail({ params }: PlaylistPageProps) {
  const { id } = React.use(params);

  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchPlaylistDetails() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/playlist/${id}`, {
          credentials: "include", 
        });

        if (response.status === 401) {
          setError("Unauthorized: Please log in to view this playlist.");
        } else if (response.status === 404) {
          setError("Playlist not found in the database.");
        } else if (!response.ok) {
          setError(`Server Error: ${response.statusText}`);
        } else {
          const data = await response.json();
          setPlaylist(data);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylistDetails();
  }, [id]);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <main className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <p className="animate-pulse text-zinc-500">Loading playlist...</p>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-400 text-xl font-semibold">{error}</p>
            {error.includes("Unauthorized") && (
              <a
                href="http://localhost:8080/auth/google"
                className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition"
              >
                Log In with Google
              </a>
            )}
          </div>
        ) : playlist ? (
          <div>
            <header className="flex items-end gap-6 mb-8">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-900 shadow-2xl rounded-lg flex items-center justify-center text-6xl">
                🎵
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Playlist
                </p>
                <h1 className="text-6xl font-black mt-2 mb-4">
                  {playlist.name}
                </h1>
                <p className="text-zinc-400 font-medium">
                  {playlist.songs?.length || 0} songs • ID:{" "}
                  <span className="text-zinc-600">{id}</span>
                </p>
              </div>
            </header>

            <div className="mt-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-medium w-12">#</th>
                    <th className="pb-4 font-medium">Title</th>
                    <th className="pb-4 font-medium">Album</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {playlist.songs?.map((song: any, index: number) => (
                    <tr
                      key={song.id}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 text-zinc-500">{index + 1}</td>
                      <td className="py-4 font-medium">{song.name}</td>
                      <td className="py-4 text-zinc-400">Single</td>
                      <td className="py-4 text-right">
                        <button className="text-zinc-500 hover:text-red-500 transition-colors">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!playlist.songs || playlist.songs.length === 0) && (
                <p className="text-center py-20 text-zinc-600 italic">
                  This playlist is empty. Add some songs!
                </p>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
