import type { Config } from "tailwindcss";

// We export the partial config that every app will extend
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        // Example: defining a custom brand color for all apps
        brand: {
          100: "#e0e7ff",
          500: "#6366f1",
          900: "#312e81",
        },
      },
    },
  },
  plugins: [],
};

export default config;
