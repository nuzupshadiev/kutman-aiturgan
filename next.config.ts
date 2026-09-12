import type { NextConfig } from "next";

/**
 * One static page with no remote data, so the only thing worth configuring is
 * where Turbopack considers the project to start: without it a lockfile in a
 * parent directory (the templates checkout, for instance) is mistaken for the
 * workspace root.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
