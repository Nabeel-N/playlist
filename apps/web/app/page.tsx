"use client";
import {
  useState,
  useEffect,
  useRef,
  MouseEvent as ReactMouseEvent,
} from "react";
import Sidebar from "@repo/ui/Sidebar";
import HomeIcon from "@repo/ui/icons/HomeIcon";
import SongOpen from "@repo/ui/songOpen";
import { useRouter } from "next/navigation";
import Search from "@repo/ui/Search";
import SearchBar from "@repo/ui/icons/Searchbar";
import PlayIcon from "@repo/ui/icons/playIcon";
import Topbutton from "@repo/ui/icons/Tobbutton";
import useFetch from "../../../packages/ui/src/customhooks/usefetchhook";

interface Song {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  artist?: { name: string };
}

interface Podcast {
  id: string;
  name: string;
  thumbnail: string;
  url?: string;
  description?: string;
  host?: { name: string };
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  songId: string | null;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | null>(null);
  const [greeting, setGreeting] = useState("Good morning");
  const router = useRouter();

  const [rawPodcastData] = useFetch("http://localhost:8080/podcast", "GET");
  const podcastdata: Podcast[] = Array.isArray(rawPodcastData)
    ? rawPodcastData
    : (rawPodcastData as any)?.podcasts || [];

  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [CurrentPlaysongImage, SetCurrentPlayingSongImage] = useState<[string]>(
    [""],
  );

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    songId: null,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const closeMenu = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const fetchSongs = async (url: string) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
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

  function Songclick(songid: string) {
    router.push(`/song/${songid}`);
  }

  useEffect(() => {
    fetchSongs("http://localhost:8080/song");
  }, []);

  const handleRightClick = (e: ReactMouseEvent, songId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      songId: songId,
    });
  };

  const handlePlayPause = (e: ReactMouseEvent, song: Song) => {
    e.stopPropagation();

    if (!audioRef.current) return;

    if (playingSongId === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      audioRef.current.src = song.url;
      audioRef.current.play();
      setPlayingSongId(song.id);
      setIsPlaying(true);
      SetCurrentPlayingSongImage([
        song.thumbnail || "https://placehold.co/400?text=Music",
      ]);
    }
  };

  const handlePodcastPlayPause = (e: ReactMouseEvent, podcast: Podcast) => {
    e.stopPropagation();

    if (!audioRef.current) return;

    if (playingSongId === podcast.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      audioRef.current.src = podcast.url || "";
      audioRef.current.play();
      setPlayingSongId(podcast.id);
      setIsPlaying(true);
      SetCurrentPlayingSongImage([
        podcast.thumbnail || "https://placehold.co/400?text=Podcast",
      ]);
    }
  };

  const currentPlayingItem =
    songs.find((s) => s.id === playingSongId) ||
    podcastdata.find((p) => p.id === playingSongId);

  return (
    <div className="flex h-screen w-full bg-black p-2 gap-2 text-white overflow-hidden font-sans selection:bg-green-500 selection:text-black">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      {/* Sidebar */}
      <div className="flex-shrink-0 h-full">
        <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-[#121212] rounded-lg custom-scrollbar">
        {/* Dynamic Top Gradient */}
        <div className="absolute inset-0 h-[400px] bg-gradient-to-b from-indigo-900/40 via-[#121212]/80 to-[#121212] pointer-events-none -z-10 transition-colors duration-1000" />

        <div className="relative z-10">
          {/* Top Bar Navigation */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#121212]/80 backdrop-blur-md border-b border-transparent transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div className="bg-black/50 p-2 rounded-full cursor-pointer hover:bg-black/80 transition text-neutral-400 hover:text-white">
                <HomeIcon className="size-6" />
              </div>
              <div className="w-full max-w-md">
                <Search icon={<SearchBar />} song={songs} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Topbutton
                text="Podcasts"
                onClick={() => router.push("/podcasts")}
              />
              <div className="bg-black/50 hover:bg-black/80 transition p-1 pr-3 rounded-full flex items-center gap-2 cursor-pointer border border-white/5">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  U
                </div>
                <span className="text-sm font-bold text-white">User</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-12 pt-6">
            <h1 className="text-4xl font-black tracking-tight mb-8 text-white">
              {greeting}
            </h1>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/5 p-4 rounded-xl animate-pulse"
                  >
                    <div className="w-full aspect-square bg-white/10 rounded-md mb-4" />
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : status === 401 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Log in to see your music
                </h2>
                <a
                  href="http://localhost:8080/auth/google"
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Log in with Google
                </a>
              </div>
            ) : songs.length > 0 ? (
              <div className="space-y-12">
                {/* Songs Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer inline-block">
                    Your Top Mixes
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {songs.map((song) => (
                      <div
                        onContextMenu={(e) => handleRightClick(e, song.id)}
                        key={song.id}
                        className="group bg-[#181818] hover:bg-[#282828] transition-all duration-300 p-4 rounded-md cursor-pointer relative"
                      >
                        <div className="relative aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] rounded-md overflow-hidden">
                          <img
                            onClick={() => Songclick(song.id)}
                            src={
                              song.thumbnail ||
                              "https://placehold.co/400?text=Music"
                            }
                            alt={song.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute right-2 bottom-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20">
                            <PlayIcon
                              onClick={(e) => handlePlayPause(e, song)}
                              isPlaying={playingSongId === song.id && isPlaying}
                            />
                          </div>
                        </div>
                        <div
                          className="min-h-[48px]"
                          onClick={() => Songclick(song.id)}
                        >
                          <h3 className="font-bold text-base text-white truncate mb-1">
                            {song.name}
                          </h3>
                          <p className="text-sm text-[#A7A7A7] line-clamp-2">
                            {song.artist?.name || "Unknown Artist"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Podcasts Section */}
                {podcastdata && podcastdata.length > 0 && (
                  <section>
                    <div className="flex items-end justify-between mb-6">
                      <h2 className="text-2xl font-bold hover:underline cursor-pointer">
                        Popular Podcasts
                      </h2>
                      <button
                        onClick={() => router.push("/podcasts")}
                        className="text-sm font-bold text-[#A7A7A7] hover:text-white transition-colors hover:underline"
                      >
                        Show all
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {podcastdata.map((podcast) => (
                        <div
                          key={podcast.id}
                          onClick={() => router.push(`/podcasts/${podcast.id}`)}
                          className="group bg-[#181818] hover:bg-[#282828] transition-all duration-300 p-4 rounded-md cursor-pointer relative"
                        >
                          <div className="relative aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.4)] rounded-xl overflow-hidden">
                            <img
                              src={
                                podcast.thumbnail ||
                                "https://placehold.co/400?text=Podcast"
                              }
                              alt={podcast.name}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                              Podcast
                            </div>

                            <div className="absolute right-2 bottom-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20">
                              <PlayIcon
                                onClick={(e) =>
                                  handlePodcastPlayPause(e, podcast)
                                }
                                isPlaying={
                                  playingSongId === podcast.id && isPlaying
                                }
                              />
                            </div>
                          </div>

                          <div className="min-h-[48px]">
                            <h3 className="font-bold text-base text-white truncate mb-1">
                              {podcast.name}
                            </h3>
                            <p className="text-sm text-[#A7A7A7] truncate">
                              {podcast.host?.name || "Unknown Host"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="text-5xl mb-4 opacity-50">🎵</div>
                <h3 className="text-xl font-bold text-white">
                  It's a bit quiet here
                </h3>
                <p className="text-neutral-400 mt-2">
                  Discover new music and podcasts.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modernized Now Playing Panel */}
      {playingSongId && (
        <aside className="flex-shrink-0 w-72 h-full bg-[#121212] rounded-lg flex flex-col items-center p-6 ml-2 overflow-y-auto custom-scrollbar relative">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white">Now Playing</h3>
            <div className="flex gap-1">
              <span
                className={`block w-1 h-3 bg-green-500 rounded-full ${isPlaying ? "animate-[bounce_1s_infinite]" : "opacity-50"}`}
                style={{ animationDelay: "0ms" }}
              />
              <span
                className={`block w-1 h-4 bg-green-500 rounded-full ${isPlaying ? "animate-[bounce_1s_infinite]" : "opacity-50"}`}
                style={{ animationDelay: "200ms" }}
              />
              <span
                className={`block w-1 h-2 bg-green-500 rounded-full ${isPlaying ? "animate-[bounce_1s_infinite]" : "opacity-50"}`}
                style={{ animationDelay: "400ms" }}
              />
            </div>
          </div>

          <div className="w-full aspect-square rounded-xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.5)] mb-6 relative group">
            <img
              src={CurrentPlaysongImage[0]}
              alt="Now playing"
              className={`w-full h-full object-cover transition-transform duration-[10s] ${
                isPlaying ? "scale-110" : "scale-100"
              }`}
            />
          </div>

          <div className="w-full text-left">
            <h2 className="text-white font-bold text-xl leading-tight mb-1 hover:underline cursor-pointer">
              {currentPlayingItem?.name || "Unknown"}
            </h2>
            <p className="text-[#A7A7A7] text-sm hover:underline cursor-pointer">
              {(currentPlayingItem as Song)?.artist?.name ||
                (currentPlayingItem as Podcast)?.host?.name ||
                "Unknown Artist"}
            </p>
          </div>

          <div className="w-full mt-8 bg-white/5 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-neutral-400 font-medium mb-2 uppercase tracking-wider">
              Next in queue
            </p>
            <p className="text-sm text-white font-medium">Auto-play is on</p>
          </div>
        </aside>
      )}

      {/* Render the Custom Context Menu */}
      {contextMenu.visible && (
        <SongOpen
          x={contextMenu.x}
          y={contextMenu.y}
          songId={contextMenu.songId}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}
    </div>
  );
}
