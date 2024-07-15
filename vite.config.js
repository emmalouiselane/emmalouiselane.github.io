import { defineConfig } from "vite";

export default defineConfig({
    base: "/developer-portfolio/",
    build: {
        minify: "terser"
    }
})