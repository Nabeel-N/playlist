"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of a Podcast so TypeScript knows what's in our dropdown
interface Podcast {
  id: string;
  name: string;
}

export default function Create() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"podcast" | "episode">("podcast");

  // --- PODCAST FORM STATE ---
  const [podName, setPodName] = useState("");
  const [podPic, setPodPic] = useState("");
  const [podGenre, setPodGenre] = useState("");
  const [podAbout, setPodAbout] = useState("");
  const [isSubmittingPod, setIsSubmittingPod] = useState(false);

  // --- EPISODE FORM STATE ---
  const [epTitle, setEpTitle] = useState("");
  const [epDuration, setEpDuration] = useState("");
  const [epUrl, setEpUrl] = useState("");
  const [selectedPodcastId, setSelectedPodcastId] = useState("");
  const [isSubmittingEp, setIsSubmittingEp] = useState(false);

  // --- FETCH EXISTING PODCASTS FOR THE DROPDOWN ---
  const [existingPodcasts, setExistingPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    // We fetch the podcasts so the user can select one when creating an episode
    const fetchPodcasts = async () => {
      try {
        const res = await fetch("http://localhost:8080/podcast", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setExistingPodcasts(data.podcasts || []);
        }
      } catch (error) {
        console.error("Failed to load podcasts for dropdown:", error);
      }
    };
    fetchPodcasts();
  }, [activeTab]); // Re-fetch if they switch tabs just to be safe

  // --- SUBMIT HANDLERS ---
  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podName || !podPic || !podGenre || !podAbout)
      return alert("Fill all fields");

    setIsSubmittingPod(true);
    try {
      const res = await fetch("http://localhost:8080/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: podName,
          profilePic: podPic,
          genre: podGenre,
          about: podAbout,
        }),
      });

      if (res.ok) {
        alert("Podcast created successfully!");
        setPodName("");
        setPodPic("");
        setPodGenre("");
        setPodAbout("");
        router.refresh();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingPod(false);
    }
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epTitle || !epDuration || !epUrl || !selectedPodcastId)
      return alert("Fill all fields");

    setIsSubmittingEp(true);
    try {
      const res = await fetch("http://localhost:8080/episode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: epTitle,
          duration: parseInt(epDuration, 10),
          url: epUrl,
          podcastId: selectedPodcastId,
        }),
      });

      if (res.ok) {
        alert("Episode added successfully!");
        setEpTitle("");
        setEpDuration("");
        setEpUrl("");
        setSelectedPodcastId("");
        router.refresh();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingEp(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-6">
      <div className="w-full max-w-lg">
        {/* Header & Tabs */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-6 tracking-tight">
            Creator Studio
          </h1>
          <div className="flex bg-[#181818] p-1 rounded-full border border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab("podcast")}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${
                activeTab === "podcast"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              New Podcast
            </button>
            <button
              onClick={() => setActiveTab("episode")}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${
                activeTab === "episode"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Add Episode
            </button>
          </div>
        </div>

        {/* --- PODCAST FORM --- */}
        {activeTab === "podcast" && (
          <form
            onSubmit={handlePodcastSubmit}
            className="bg-[#181818] p-8 rounded-2xl shadow-2xl border border-white/5 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Podcast Name
              </label>
              <input
                type="text"
                value={podName}
                onChange={(e) => setPodName(e.target.value)}
                disabled={isSubmittingPod}
                placeholder="e.g., The Tech Hour"
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500/50 transition-all border border-transparent focus:border-green-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Cover Image URL
              </label>
              <input
                type="text"
                value={podPic}
                onChange={(e) => setPodPic(e.target.value)}
                disabled={isSubmittingPod}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500/50 transition-all border border-transparent focus:border-green-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Genre
              </label>
              <input
                type="text"
                value={podGenre}
                onChange={(e) => setPodGenre(e.target.value)}
                disabled={isSubmittingPod}
                placeholder="e.g., Comedy, Tech"
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500/50 transition-all border border-transparent focus:border-green-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                About
              </label>
              <textarea
                value={podAbout}
                onChange={(e) => setPodAbout(e.target.value)}
                disabled={isSubmittingPod}
                rows={3}
                placeholder="Describe your podcast..."
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500/50 transition-all border border-transparent focus:border-green-500/30 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingPod}
              className="mt-4 w-full py-4 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmittingPod ? "Creating Podcast..." : "Create Podcast"}
            </button>
          </form>
        )}

        {/* --- EPISODE FORM --- */}
        {activeTab === "episode" && (
          <form
            onSubmit={handleEpisodeSubmit}
            className="bg-[#181818] p-8 rounded-2xl shadow-2xl border border-white/5 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Select Podcast
              </label>
              <select
                value={selectedPodcastId}
                onChange={(e) => setSelectedPodcastId(e.target.value)}
                disabled={isSubmittingEp || existingPodcasts.length === 0}
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500/30 appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  -- Choose a podcast --
                </option>
                {existingPodcasts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {existingPodcasts.length === 0 && (
                <p className="text-xs text-red-400 mt-2">
                  You need to create a podcast first!
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Episode Title
              </label> <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Duration (Seconds)
              </label>
              <input
                type="text"
                value={epTitle}
                onChange={(e) => setEpTitle(e.target.value)}
                disabled={isSubmittingEp}
                placeholder="e.g., Ep 1: The Beginning"
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Audio URL
              </label>
              <input
                type="text"
                value={epUrl}
                onChange={(e) => setEpUrl(e.target.value)}
                disabled={isSubmittingEp}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Duration (Seconds)
              </label> <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                Duration (Seconds)
              </label>
              <input
                type="number"
                value={epDuration}
                onChange={(e) => setEpDuration(e.target.value)}
                disabled={isSubmittingEp}
                placeholder="e.g., 3600"
                className="w-full px-4 py-3 bg-[#242424] text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:border-blue-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingEp || !selectedPodcastId}
              className="mt-4 w-full py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmittingEp ? "Publishing Episode..." : "Publish Episode"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
