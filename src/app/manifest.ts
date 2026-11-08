import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "RLG",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/brand/app-icon-black-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/app-icon-black-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
