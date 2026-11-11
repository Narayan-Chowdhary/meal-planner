import { Box, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { Logo } from "../ui/Header/Header";
import { unsplash, unsplashSrcSet } from "../../theme/images";

const ease = [0.22, 1, 0.36, 1];

function FloatingCard({ sx, delay, children }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      sx={{ position: "absolute", ...sx }}
    >
      <Box
        sx={{
          bgcolor: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", color: "text.primary", borderRadius: 4,
          p: 1.5, pr: 2.5, boxShadow: "var(--mp-shadow-lg)", animation: `mp-float 6s ease-in-out ${delay + 1}s infinite`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/** Split-screen layout for login / sign-up: photo + story on the left, form on the right. */
export default function AuthLayout({ image, quote, children }) {
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" }, bgcolor: "background.default" }}>
      {/* Visual side */}
      <Box sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 220, md: "auto" }, color: "#fff", m: { md: 2 }, borderRadius: { md: "28px" } }}>
        <Box
          component="img"
          src={unsplash(image, { w: 1400, q: 70 })}
          srcSet={unsplashSrcSet(image, [640, 1000, 1400, 2000], { q: 70 })}
          sizes="(min-width: 900px) 52vw, 100vw"
          alt=""
          fetchPriority="high"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "mp-kenburns 16s var(--mp-ease) both" }}
        />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,23,18,.15) 0%, rgba(31,23,18,.25) 40%, rgba(31,23,18,.88) 100%)" }} />

        <Box sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", p: { xs: 3, md: 5 } }}>
          <Logo light />
          <Box sx={{ flex: 1 }} />

          {/* Decorative floating cards (desktop only) */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <FloatingCard delay={0.5} sx={{ top: "22%", right: "10%" }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "rgba(194,65,12,.12)", color: "primary.main" }}>
                  <LocalFireDepartmentRoundedIcon />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>1,850 kcal</Typography>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Today's plan</Typography>
                </Box>
              </Stack>
            </FloatingCard>
            <FloatingCard delay={0.75} sx={{ top: "40%", left: "8%" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Plan your week in minutes</Typography>
              </Stack>
            </FloatingCard>
          </Box>

          <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }} sx={{ display: { xs: "none", md: "block" } }}>
            <Typography sx={{ fontFamily: "var(--mp-font-display)", fontSize: { md: 34, lg: 42 }, fontWeight: 650, lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 520 }}>
              {quote}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form side */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 2.5, sm: 4 }, py: { xs: 4, md: 6 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          sx={{ width: "100%", maxWidth: 460 }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
