import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    start_url: "/",
    name: "Arrow Up",
    short_name: "ArrowUp",
    display: "standalone",
    theme_color: "#fafafa",
    background_color: "#fafafa",
    orientation: "portrait-primary",
    description:
      "Personal Operating System for Daily Momentum, Habits & Missions",
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
        description: "Create a new todo item",
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
      {
        name: "Missions",
        url: "/missions",
        short_name: "Missions",
        description: "Track and manage your missions",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "Skills",
        url: "/skills",
        short_name: "Skills",
        description: "Upgrade and monitor skills tree",
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
