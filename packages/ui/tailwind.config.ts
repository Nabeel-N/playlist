import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Config = {
  // Tell Tailwind to scan your Sidebar.tsx and other components
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // This imports your brand colors (brand-100, 500, 900)
  presets: [sharedConfig as any],
};

export default config;
