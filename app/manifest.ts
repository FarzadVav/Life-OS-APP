import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    name: "Arrow Up",
    start_url: "/profile",
    short_name: "ArrowUp",
    display: "standalone",
    theme_color: "#fafafa",
    background_color: "#fafafa",
    orientation: "portrait-primary",
    description:
      "Personal Operating System for Daily Momentum & Habits",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "New Todo",
        url: "/todos/new",
        short_name: "Todo",
        description: "Create a new todo or mission",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "New Journal",
        url: "/journals/new",
        short_name: "Journal",
        description: "Write a new journal entry",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
    ],
  };
}
