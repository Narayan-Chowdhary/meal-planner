import { useEffect, useState } from "react";
import { Fab, Tooltip, Zoom } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

/** Floating "back to top" button (bottom-left, so it never collides with the chatbot). */
export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Zoom in={visible}>
      <Tooltip title="Back to top" placement="right">
        <Fab
          size="medium"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            left: { xs: 16, md: 28 },
            bottom: { xs: 16, md: 28 },
            zIndex: 1200,
            bgcolor: "background.paper",
            color: "primary.main",
            boxShadow: "var(--mp-shadow-lg)",
            "&:hover": { bgcolor: "primary.main", color: "#fff" },
          }}
        >
          <KeyboardArrowUpRoundedIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};
