import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  // 1. Tell Tailwind to use the "content" from this specific app
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // If you have a shared UI package, add it here:
    // "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  // 2. Load the shared configuration as a preset
  presets: [sharedConfig],
};

export default config;
