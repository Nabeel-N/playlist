"use client";
import { Button } from "./button";
import Sidebaricon from "./icons/sidebaricon";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const menuItems = [
    { icon: "🎵", label: "Playlists" },
    { icon: "🎙️", label: "Podcasts" },
    { icon: "🎤", label: "Artists" },
  ];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
      `,
        }}
      />

      <aside
        className={`relative bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-500 ease-out h-full flex flex-col ${
          isOpen ? "w-80" : "w-24"
        }`}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-blue-950/10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with Toggle */}
          <div className="p-6 border-b border-white/10">
            <button
              onClick={toggleSidebar}
              className="group w-full flex items-center justify-between p-4 glass-card rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600/20 rounded-lg blur-md group-hover:bg-purple-600/30 transition-all" />
                  <div className="relative">
                    <Sidebaricon />
                  </div>
                </div>
                {isOpen && (
                  <div className="animate-slideIn">
                    <p className="font-semibold text-white/90 text-left">
                      Navigation
                    </p>
                    <p className="text-xs text-white/40">Toggle menu</p>
                  </div>
                )}
              </div>

              {isOpen && (
                <svg
                  className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors animate-slideIn"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
            {isOpen ? (
              <>
                <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-semibold mb-4 px-2 animate-slideIn">
                  Your Library
                </p>
                {menuItems.map((item, index) => (
                  <button
                    key={item.label}
                    className="group w-full flex items-center justify-between p-4 glass-card rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-slideIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white/90 group-hover:text-white transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-white/40">
                          {item.count} items
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/5 px-3 py-1.5 rounded-full">
                      <span className="text-xs font-semibold text-white/60">
                        {item.count}
                      </span>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <>
                {menuItems.map((item, index) => (
                  <button
                    key={item.label}
                    className="group w-full flex flex-col items-center gap-2 p-4 glass-card rounded-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    title={item.label}
                  >
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-purple-500/60 group-hover:bg-purple-500 transition-colors" />
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="p-6 border-t border-white/10">
            {isOpen ? (
              <div className="space-y-3 animate-slideIn">
                <button className="w-full group p-4 glass-card rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-white/90 group-hover:text-white transition-colors">
                        New Playlist
                      </p>
                      <p className="text-xs text-white/40">Create collection</p>
                    </div>
                  </div>
                </button>

                <button className="w-full group p-4 glass-card rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <svg
                        className="w-5 h-5 text-white/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-white/90 group-hover:text-white transition-colors">
                        Settings
                      </p>
                      <p className="text-xs text-white/40">Preferences</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  className="w-full group p-4 glass-card rounded-xl hover:scale-105 active:scale-95 transition-all duration-300"
                  title="New Playlist"
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </button>

                <button
                  className="w-full group p-4 glass-card rounded-xl hover:scale-105 active:scale-95 transition-all duration-300"
                  title="Settings"
                >
                  <svg
                    className="w-5 h-5 mx-auto text-white/60 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
