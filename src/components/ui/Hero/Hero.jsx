import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import { UNSPLASH, unsplash, unsplashSrcSet } from "../../../theme/images";

const ease = [0.22, 1, 0.36, 1];

// Each page that shows the hero gets its own photo + copy.
const VARIANTS = {
  "/recipesuggestionpage": {
    image: UNSPLASH.heroBowls,
    eyebrow: { key: "hero_recipes_eyebrow", en: "Cook something new" },
    subtitle: { key: "hero_recipes_subtitle", en: "Browse every recipe, filter by what you love and find tonight's dinner in seconds." },
  },
  "/recipevt": {
    image: UNSPLASH.cookingTogether,
    eyebrow: { key: "hero_videos_eyebrow", en: "Learn by watching" },
    subtitle: { key: "hero_videos_subtitle", en: "Step-by-step video tutorials from kitchens around the world." },
  },
  default: {
    image: UNSPLASH.heroSpread,
    eyebrow: { key: "hero_home_eyebrow", en: "Plan · Cook · Enjoy" },
    subtitle: { key: "hero_home_subtitle", en: "Plan your week, discover recipes you'll love and keep your groceries in check — all in one place." },
  },
};

const item = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

export default function Hero({ user }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const v = VARIANTS[pathname.toLowerCase()] ?? VARIANTS.default;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        minHeight: { xs: 420, md: 520 },
        display: "flex",
        alignItems: "flex-end",
        mx: { xs: 0, md: 2 },
        borderRadius: { xs: 0, md: "28px" },
        mt: { xs: 0, md: 1 },
      }}
    >
      {/* Background photo with slow Ken Burns zoom */}
      <Box
        component="img"
        src={unsplash(v.image, { w: 1600, q: 70 })}
        srcSet={unsplashSrcSet(v.image, [640, 1024, 1600, 2200], { q: 70 })}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        sx={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          animation: "mp-kenburns 14s var(--mp-ease) both",
        }}
      />
      <Box
        sx={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, rgba(31,23,18,.35) 0%, rgba(31,23,18,.15) 35%, rgba(31,23,18,.85) 100%), radial-gradient(80% 60% at 0% 100%, rgba(194,65,12,.45), transparent 70%)",
        }}
      />

      <Container sx={{ position: "relative", pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 9 } }}>
        <motion.div {...item(0.05)}>
          <Chip
            icon={<LocalDiningRoundedIcon sx={{ color: "#fff !important" }} />}
            label={t(v.eyebrow.key, v.eyebrow.en)}
            sx={{ bgcolor: "rgba(255,255,255,.16)", color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.25)", mb: 2.5 }}
          />
        </motion.div>
        <motion.div {...item(0.15)}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.2rem" }, maxWidth: 820, textShadow: "0 2px 24px rgba(0,0,0,.25)" }}
          >
            {isAdmin ? t("Welcome_admin") : t("Welcome_to_myrecipe")}
            {isUser && user?.name ? (
              <Box component="span" sx={{ display: "block", color: "#FED7AA", fontStyle: "italic", fontWeight: 600 }}>
                {user.name.split(" ")[0]}
              </Box>
            ) : null}
          </Typography>
        </motion.div>
        <motion.div {...item(0.28)}>
          <Typography sx={{ mt: 2, maxWidth: 560, fontSize: { xs: "1rem", md: "1.15rem" }, opacity: 0.92 }}>
            {t(v.subtitle.key, v.subtitle.en)}
          </Typography>
        </motion.div>
        {!isAdmin && (
          <motion.div {...item(0.4)}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
              {isUser && (
                <Button size="large" variant="contained" startIcon={<CalendarMonthRoundedIcon />} onClick={() => nav("/mealplanner")}>
                  {t("meal_planner")}
                </Button>
              )}
              <Button
                size="large"
                variant="outlined"
                startIcon={<TravelExploreRoundedIcon />}
                onClick={() => nav(pathname.toLowerCase() === "/recipevt" ? "/recipeSuggestionPage" : "/recipevt")}
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,.6)", backdropFilter: "blur(6px)", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,.12)" } }}
              >
                {pathname.toLowerCase() === "/recipevt" ? t("all_recipe") : t("explore")}
              </Button>
            </Stack>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
