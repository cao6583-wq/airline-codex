import { defineConfig } from "vite";
import { cpSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");

function copyStaticAssets() {
  mkdirSync(dist, { recursive: true });
  for (const file of ["manifest.json", "sw.js", "favicon.svg", "icon-192.svg", "icon-512.svg", "README.md", "vercel.json", "netlify.toml"]) {
    const src = resolve(root, file);
    if (existsSync(src)) copyFileSync(src, resolve(dist, file));
  }
  for (const dir of ["vendor", "supabase"]) {
    const src = resolve(root, dir);
    if (existsSync(src)) cpSync(src, resolve(dist, dir), { recursive: true });
  }
  const indexFile = resolve(dist, "index.html");
  if (existsSync(indexFile)) {
    const html = readFileSync(indexFile, "utf8")
      .replace(/href="\.?\/?assets\/manifest-[^"]+\.json"/, 'href="manifest.json"')
      .replace(/href="\.?\/?assets\/icon-192-[^"]+\.svg"/, 'href="icon-192.svg"')
      .replace(/href="\.?\/?assets\/favicon-[^"]+\.svg"/, 'href="favicon.svg"');
    writeFileSync(indexFile, html);
  }
}

export default defineConfig({
  base: "./",
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: "esbuild",
    cssMinify: "esbuild"
  },
  plugins: [
    {
      name: "airlink-copy-static-assets",
      closeBundle() {
        copyStaticAssets();
      }
    }
  ]
});
