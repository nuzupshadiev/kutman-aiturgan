"use client";

import { useEffect } from "react";

import { artboardWidthFor } from "@/lib/breakpoints";

/**
 * Keeps the artboard scale in sync with the viewport.
 *
 * `--artboard-width` is the window width (scrollbar included, matching the
 * width the design is laid out against) and `--zoom` scales the chosen
 * artboard up to it. The breakpoint itself comes from `clientWidth`, so it
 * always agrees with the CSS media queries.
 *
 * An inline copy runs before first paint so the page never renders unscaled.
 */
export const ZOOM_BOOTSTRAP_SCRIPT = `(function(){function z(){var d=document.documentElement,c=d.clientWidth,w=window.innerWidth||c,b=[320,480,640,960,1200],a=b[0],i;for(i=0;i<b.length;i++){if(c>=b[i])a=b[i];}d.style.setProperty('--zoom',(w/a).toFixed(4));d.style.setProperty('--artboard-width',w+'px');}z();window.addEventListener('resize',z);window.addEventListener('orientationchange',z);})();`;

export default function ZoomController() {
  useEffect(() => {
    const apply = () => {
      const root = document.documentElement;
      const clientWidth = root.clientWidth;
      const windowWidth = window.innerWidth || clientWidth;
      const artboard = artboardWidthFor(clientWidth);
      root.style.setProperty("--zoom", (windowWidth / artboard).toFixed(4));
      root.style.setProperty("--artboard-width", `${windowWidth}px`);
    };

    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  return null;
}
