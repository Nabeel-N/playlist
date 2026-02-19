"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import PlusIcon from "./icons/PlusIcon";
import Sidebaricon from "./icons/sidebaricon";
import LikeIcon from "./icons/likeIcon";
import useFetch from "./customhooks/usefetchhook";
import CreatePlaylist from "./createPlaylist";

interface PlaylistData {
  playlists: any[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

type AvatarColor = { bg: string; text: string };

const AVATAR_COLORS: AvatarColor[] = [
  { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  { bg: "bg-violet-500/20", text: "text-violet-400" },
  { bg: "bg-amber-500/20", text: "text-amber-400" },
  { bg: "bg-sky-500/20", text: "text-sky-400" },
  { bg: "bg-rose-500/20", text: "text-rose-400" },
];

function avatarColor(idx: number): AvatarColor {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length] as AvatarColor;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [data, loading] = useFetch<PlaylistData>(
    `http://localhost:8080/playlist?refresh=${refreshKey}`,
    "GET",
  );

  const playlists = data?.playlists ?? [];

  const handleCreateSuccess = () => {
    setShowCreate(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <aside
      className={[
        "relative flex flex-col h-screen bg-[#121212]",
        "border-r border-white/5 flex-shrink-0",
        "transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[72px]",
      ].join(" ")}
    >
      <div className="flex-shrink-0 flex flex-col gap-0.5 px-2 pt-3 pb-2">
        <div className="flex items-center h-10 mb-1">
          <button
            onClick={toggleSidebar}
            className="w-[52px] flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <Sidebaricon /> 
          </button>

          <span
            className={[
              "font-bold text-[15px] text-white whitespace-nowrap flex-1 ml-1 transition-all duration-200",
              isOpen
                ? "opacity-100"
                : "opacity-0 w-0 overflow-hidden pointer-events-none",
            ].join(" ")}
          >
            Your Library
          </span>

          {isOpen && (
            <button
              className="flex-shrink-0 flex items-center justify-center rounded-full hover:brightness-125 transition-all"
              onClick={() => setShowCreate(!showCreate)}
            >
              <PlusIcon onClick={() => {}} />
            </button>
          )}
        </div>

        {isOpen && showCreate && (
          <div className="mb-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <CreatePlaylist onClose={handleCreateSuccess} />
          </div>
        )}

        <NavItem
          isOpen={isOpen}
          label="Liked Songs"
          thumbnail={
            <span className="w-10 h-10 flex-shrink-0 overflow-hidden flex items-center justify-center">
              <span className="scale-[0.68] origin-center">
                <LikeIcon />
              </span>
            </span>
          }
        />

        {!isOpen && (
          <button className="w-full h-10 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
            <PlusIcon onClick={() => {}} />
          </button>
        )}
      </div>

      <div className="flex-shrink-0 mx-3 border-t border-white/[0.06]" />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 pt-1 pb-4 space-y-0.5 [scrollbar-width:thin]">
        {loading &&
          refreshKey === 0 &&
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <div className="w-10 h-10 rounded flex-shrink-0 bg-white/[0.06] animate-pulse" />
              {isOpen && (
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-3/4 rounded-full bg-white/[0.06] animate-pulse" />
                  <div className="h-2 w-1/2 rounded-full bg-white/[0.04] animate-pulse" />
                </div>
              )}
            </div>
          ))}

        {playlists.map((playlist, idx) => (
          <PlaylistRow
            key={playlist.id}
            name={playlist.name}
            color={avatarColor(idx)}
            isOpen={isOpen}
            onClick={() => router.push(`/playlist/${playlist.id}`)}
          />
        ))}
      </div>
    </aside>
  );
}

function NavItem({ thumbnail, label, isOpen, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-neutral-400 hover:text-white text-left"
    >
      {thumbnail}
      <span
        className={[
          "text-sm font-medium text-neutral-200 whitespace-nowrap transition-all duration-200",
          isOpen
            ? "opacity-100"
            : "opacity-0 w-0 overflow-hidden pointer-events-none",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

// --- CHANGE: Added onClick to props and button ---
function PlaylistRow({ name, color, isOpen, onClick }: any) {
  return (
    <button
      onClick={onClick} // Executing the router.push function passed from parent
      className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left group overflow-hidden"
    >
      <span
        className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center font-semibold text-sm ${color.bg} ${color.text}`}
      >
        {name?.[0]?.toUpperCase() ?? "?"}
      </span>
      <div
        className={[
          "flex flex-col gap-0.5 min-w-0 transition-all duration-200",
          isOpen
            ? "opacity-100"
            : "opacity-0 w-0 overflow-hidden pointer-events-none",
        ].join(" ")}
      >
        <span className="text-sm font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
          {name}
        </span>
        <span className="text-xs text-neutral-500">Playlist</span>
      </div>
    </button>
  );
}
