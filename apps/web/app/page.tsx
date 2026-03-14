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

// 1. ADDED ARTIST INTERFACE
interface Artist {
  id: string;
  name: string;
  bio?: string;
  profilePic?: string | null;
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

  // Fetch Podcasts
  const [rawPodcastData] = useFetch("http://localhost:8080/podcast", "GET");
  const podcastdata: Podcast[] = Array.isArray(rawPodcastData)
    ? rawPodcastData
    : (rawPodcastData as any)?.podcasts || [];

  const [rawArtistData] = useFetch("http://localhost:8080/artist", "GET");
  const artistdata: Artist[] = Array.isArray(rawArtistData)
    ? rawArtistData
    : (rawArtistData as any)?.artists || [];

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

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-[#121212] rounded-xl custom-scrollbar border border-white/5 shadow-2xl">
        {/* Soft dynamic gradient background */}
        <div className="absolute inset-0 h-[450px] bg-gradient-to-b from-indigo-900/20 via-[#121212]/80 to-[#121212] pointer-events-none -z-10 transition-colors duration-1000" />

        <div className="relative z-10 flex flex-col min-h-full">
          {/* Top Bar Navigation */}
          <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#121212]/80 backdrop-blur-xl border-b border-white/5 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="bg-black/60 p-2.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                onClick={() => router.push("/")}
              >
                <HomeIcon className="size-6" />
              </div>
              <div className="w-full max-w-md">
                <Search icon={<SearchBar />} song={songs} />
              </div>
            </div>

            <button
              className="p-4 rounded-3xl bg-lime-700"
              onClick={() => {
                router.push("/create");
              }}
            >
              Create
            </button>

            <div className="flex items-center gap-4">
              <Topbutton
                text="Podcasts"
                onClick={() => router.push("/podcasts")}
              />
              <Topbutton
                text="Episode"
                onClick={() => router.push("/episode")}
              />
              <div className="bg-black/60 hover:bg-white/10 transition-colors p-1 pr-3.5 rounded-full flex items-center gap-3 cursor-pointer border border-white/5">
                <div className="w-8 h-8 bg-zinc-700/80 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  U
                </div>
                <span className="text-sm font-semibold text-white tracking-wide">
                  User
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Padding */}
          <div className="px-8 pb-16 pt-8 flex-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 text-white drop-shadow-sm">
              {greeting}
            </h1>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#181818] p-4 rounded-xl animate-pulse flex flex-col gap-4"
                  >
                    <div className="w-full aspect-square bg-white/5 rounded-lg shadow-sm" />
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded-md w-3/4" />
                      <div className="h-3 bg-white/5 rounded-md w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : status === 401 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center h-full">
                <div className="mb-6 p-6 bg-white/5 rounded-full shadow-2xl backdrop-blur-sm border border-white/10">
                  <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">
                  Log in to unlock your music
                </h2>
                <p className="text-neutral-400 mb-8 max-w-sm">
                  Connect your account to save playlists, like songs, and get
                  personalized recommendations.
                </p>
                <a
                  href="http://localhost:8080/auth/google"
                  className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Continue with Google
                </a>
              </div>
            ) : songs.length > 0 ? (
              <div className="space-y-16">
                {/* 1. ARTISTS SECTION (NEW) */}
                {artistdata && artistdata.length > 0 && (
                  <section>
                    <div className="flex items-end justify-between mb-6">
                      <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight">
                        Favorite Artists
                      </h2>
                      <button
                        onClick={() => router.push("/artists")}
                        className="text-sm font-bold text-[#A7A7A7] hover:text-white transition-colors hover:underline tracking-wide"
                      >
                        Show all
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {artistdata.map((artist) => (
                        <div
                          key={artist.id}
                          onClick={() => router.push(`/artist/${artist.id}`)}
                          className="group bg-[#181818] hover:bg-[#282828] transition-all duration-300 p-4 rounded-xl cursor-pointer flex flex-col items-center text-center relative hover:-translate-y-1 hover:shadow-2xl border border-transparent hover:border-white/5"
                        >
                          {/* Circular image for Artists */}
                          <div className="relative w-full aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-full overflow-hidden group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.6)] transition-shadow">
                            <img
                              src={
                                artist.profilePic ||
                                "https://placehold.co/400?text=Artist"
                              }
                              alt={artist.name}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          <div className="min-h-[48px] w-full">
                            <h3 className="font-bold text-base text-white truncate mb-1 tracking-tight">
                              {artist.name}
                            </h3>
                            <p className="text-[11px] text-[#A7A7A7] truncate font-bold uppercase tracking-widest mt-1">
                              Artist
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. SONGS SECTION */}
                <section>
                  <div className="flex items-end justify-between mb-6">
                    <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight">
                      Your Top Mixes
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {songs.map((song) => (
                      <div
                        onContextMenu={(e) => handleRightClick(e, song.id)}
                        key={song.id}
                        className="group bg-[#181818] hover:bg-[#282828] transition-all duration-300 p-4 rounded-xl cursor-pointer relative hover:-translate-y-1 hover:shadow-2xl border border-transparent hover:border-white/5"
                      >
                        <div className="relative aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.6)] transition-shadow">
                          <img
                            onClick={() => Songclick(song.id)}
                            src={
                              song.thumbnail ||
                              "https://placehold.co/400?text=Music"
                            }
                            alt={song.name}
                            className="object-cover w-full h-full"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute right-2 bottom-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 drop-shadow-2xl">
                            <div className="bg-black/20 rounded-full backdrop-blur-sm p-1">
                              <PlayIcon
                                onClick={(e) => handlePlayPause(e, song)}
                                isPlaying={
                                  playingSongId === song.id && isPlaying
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="min-h-[48px]"
                          onClick={() => Songclick(song.id)}
                        >
                          <h3 className="font-bold text-base text-white truncate mb-1.5 tracking-tight">
                            {song.name}
                          </h3>
                          <p className="text-sm text-[#A7A7A7] line-clamp-2 font-medium">
                            {song.artist?.name || "Unknown Artist"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. PODCASTS SECTION */}
                {podcastdata && podcastdata.length > 0 && (
                  <section>
                    <div className="flex items-end justify-between mb-6">
                      <h2 className="text-2xl font-bold hover:underline cursor-pointer tracking-tight">
                        Popular Podcasts
                      </h2>
                      <button
                        onClick={() => router.push("/podcasts")}
                        className="text-sm font-bold text-[#A7A7A7] hover:text-white transition-colors hover:underline tracking-wide"
                      >
                        Show all
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {podcastdata.map((podcast) => (
                        <div
                          key={podcast.id}
                          onClick={() => router.push(`/podcasts/${podcast.id}`)}
                          className="group bg-[#181818] hover:bg-[#282828] transition-all duration-300 p-4 rounded-xl cursor-pointer relative hover:-translate-y-1 hover:shadow-2xl border border-transparent hover:border-white/5"
                        >
                          <div className="relative aspect-square mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.6)] transition-shadow">
                            <img
                              src={
                                podcast.thumbnail ||
                                "https://placehold.co/400?text=Podcast"
                              }
                              alt={podcast.name}
                              className="object-cover w-full h-full"
                            />
                            {/* Podcast Badge */}
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-lg">
                              Podcast
                            </div>

                            <div className="absolute right-2 bottom-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 drop-shadow-2xl">
                              <div className="bg-black/20 rounded-full backdrop-blur-sm p-1">
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
                          </div>

                          <div className="min-h-[48px]">
                            <h3 className="font-bold text-base text-white truncate mb-1.5 tracking-tight">
                              {podcast.name}
                            </h3>
                            <p className="text-sm text-[#A7A7A7] truncate font-medium">
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
              <div className="flex flex-col items-center justify-center py-32 h-full">
                <div className="text-6xl mb-6 opacity-30 drop-shadow-lg">
                  🎵
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  It's a bit quiet here
                </h3>
                <p className="text-neutral-400 mt-2 font-medium">
                  Discover new music and podcasts to fill your library.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modernized Now Playing Panel Sidebar */}
      {playingSongId && (
        <aside className="flex-shrink-0 w-80 h-full bg-[#121212] rounded-xl flex flex-col p-6 ml-2 overflow-y-auto custom-scrollbar border border-white/5 shadow-2xl relative">
          {/* Subtle gradient glow behind the album art */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-xl" />

          <div className="w-full flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Now Playing
            </h3>
            <div className="flex gap-1.5 h-3 items-end">
              <span
                className={`block w-1 bg-green-500 rounded-t-sm ${isPlaying ? "animate-[bounce_1s_infinite] h-full" : "h-1 opacity-50"}`}
                style={{ animationDelay: "0ms" }}
              />
              <span
                className={`block w-1 bg-green-500 rounded-t-sm ${isPlaying ? "animate-[bounce_1s_infinite] h-full" : "h-1 opacity-50"}`}
                style={{ animationDelay: "200ms" }}
              />
              <span
                className={`block w-1 bg-green-500 rounded-t-sm ${isPlaying ? "animate-[bounce_1s_infinite] h-full" : "h-1 opacity-50"}`}
                style={{ animationDelay: "400ms" }}
              />
            </div>
          </div>

          <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-6 relative z-10 ring-1 ring-white/10">
            <img
              src={CurrentPlaysongImage[0]}
              alt="Now playing"
              className={`w-full h-full object-cover transition-transform duration-[15s] ease-linear ${
                isPlaying ? "scale-110" : "scale-100"
              }`}
            />
          </div>

          <div className="w-full text-left relative z-10 mb-8">
            <h2 className="text-white font-black text-2xl leading-tight mb-1.5 hover:underline cursor-pointer truncate tracking-tight drop-shadow-sm">
              {currentPlayingItem?.name || "Unknown"}
            </h2>
            <p className="text-[#A7A7A7] text-sm hover:underline cursor-pointer truncate font-medium">
              {(currentPlayingItem as Song)?.artist?.name ||
                (currentPlayingItem as Podcast)?.host?.name ||
                "Unknown Artist"}
            </p>
          </div>

          <div className="w-full mt-auto bg-[#181818] rounded-2xl p-5 border border-white/5 shadow-inner relative z-10">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                Next in queue
              </p>
              <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full font-medium">
                Auto
              </span>
            </div>
            <p className="text-sm text-white font-semibold">
              Similar tracks will play next
            </p>
          </div>
        </aside>
      )}

      {/* Context Menu */}
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
