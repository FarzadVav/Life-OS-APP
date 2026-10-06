import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arrow Up",
    short_name: "ArrowUp",
    description: "Personal Operating System for Daily Momentum, Habits & Missions",
    start_url: "/",
    display: "standalone",
    background_color: "#101010",
    theme_color: "#101010",
    orientation: "portrait-primary",
    scope: "/",
    id: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "New Todo",
        short_name: "Todo",
        description: "Create a new todo item",
        url: "/todos/new",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "New Journal",
        short_name: "Journal",
        description: "Write a new journal entry",
        url: "/journals/new",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "Missions",
        short_name: "Missions",
        description: "Track and manage your missions",
        url: "/missions",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "Skills",
        short_name: "Skills",
        description: "Upgrade and monitor skills tree",
        url: "/skills",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
    ],
  };
}
