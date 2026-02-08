"use client";
import PlusIcon from "./icons/PlusIcon";
import Sidebaricon from "./icons/sidebaricon";
import Yourepisode from "./yourepisode";
import LikeIcon from "./icons/likeIcon";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {

function fetchfollowing(){
  
}
  useEffect(()=> {
    fetchfollowing()
  },[])
  return (
    <aside
      className={`
        flex flex-col h-screen bg-neutral-900 text-white 
        transition-all duration-300 ease-in-out 
        ${isOpen ? "w-72" : "w-[72px]"} 
      `}
    >
      {/* --- Toggle Button --- */}
      <div className="flex items-center justify-center w-[72px] h-16">
        <div className="group relative flex items-center justify-center">
          <button
            onClick={toggleSidebar}
            className="p-3 bg-neutral-700 hover:bg-neutral-500 rounded-full transition-colors"
          >
            <Sidebaricon />
          </button>

          {/* Tooltip for Toggle */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-[#282828] text-white text-sm px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
            {isOpen ? "Collapse Library" : "Expand Library"}
          </div>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="flex flex-col gap-4 w-full">
        {/* --- Plus Icon --- */}
        <div className="group relative w-[72px] flex items-center justify-center flex-shrink-0 cursor-pointer">
          <div className="p-2 hover:bg-neutral-800 rounded-md transition-colors">
            <PlusIcon />
          </div>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-[#282828] text-white text-sm px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
            Create playlist or folder
          </div>
        </div>

        {/* --- Liked Songs Icon (NEW) --- */}
        <div className="group relative w-[72px] flex items-center justify-center flex-shrink-0 cursor-pointer">
          <div className="hover:scale-105 transition-transform">
            <LikeIcon />
          </div>

          {/* Tooltip Bubble */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-[#282828] text-white text-sm px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
            Liked Songs
          </div>
        </div>

        {/* --- Your Episode Icon --- */}
        <div className="group relative w-[72px] flex items-center justify-center flex-shrink-0 cursor-pointer">
          <div className="hover:scale-105 transition-transform">
            <Yourepisode />
          </div>
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-[#282828] text-white text-sm px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
            Your Episodes
          </div>
        </div>
      </div>
    </aside>
  );
}
