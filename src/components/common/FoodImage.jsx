import { useState } from "react";
import { Box } from "@mui/material";
import { foodImageFor, optimizeImage } from "../../theme/images";

/**
 * Responsive, lazy-loaded image with a shimmer placeholder, fade-in on load and an
 * Unsplash food-photo fallback when the source is missing or fails to load.
 */
export default function FoodImage({ src, alt = "", seed, width = 800, ratio = "4 / 3", sx, imgSx, priority = false, ...rest }) {
  const fallback = foodImageFor(seed ?? alt ?? "food", { w: width, h: Math.round(width * 0.75) });
  const [current, setCurrent] = useState(() => optimizeImage(src, width) || fallback);
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: ratio,
        bgcolor: "rgba(194,65,12,0.06)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(100deg, transparent 20%, rgba(255,255,255,.55) 50%, transparent 80%)",
          backgroundSize: "200% 100%",
          animation: loaded ? "none" : "mp-shimmer 1.4s linear infinite",
          opacity: loaded ? 0 : 1,
          transition: "opacity .3s",
        },
        ...sx,
      }}
    >
      <Box
        component="img"
        src={current}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallback) setCurrent(fallback);
          else setLoaded(true);
        }}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "scale(1)" : "scale(1.04)",
          transition: "opacity .6s ease, transform .9s cubic-bezier(.22,1,.36,1)",
          ...imgSx,
        }}
        {...rest}
      />
    </Box>
  );
}
