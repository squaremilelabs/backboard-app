import type { Config } from "tailwindcss"
import tailwindContainerQueries from "@tailwindcss/container-queries"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [tailwindContainerQueries],
} satisfies Config
