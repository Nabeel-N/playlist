"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePlaylist({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim()) {
      setIsSubmitting(true);

      try {
        const response = await fetch("http://localhost:8080/playlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name }),
        });

        if (response.ok) {
          setName("");
          router.refresh();
          if (onClose) onClose();
        } else {
          console.error("Failed to create playlist");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-4 bg-[#282828] rounded-xl m-1 shadow-lg border border-white/10">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        placeholder="Playlist name"
        autoFocus
        className="w-full px-3 py-2 bg-[#3E3E3E] text-white placeholder-neutral-400 rounded outline-none focus:ring-2 focus:ring-white/20 text-sm"
      />
      {isSubmitting && (
        <p className="text-xs text-neutral-400 mt-2">Creating...</p>
      )}
    </div>
  );
}
