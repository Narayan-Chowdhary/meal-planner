import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Container, Divider, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Logo } from "../../components/ui/Header/Header";
import { UNSPLASH, unsplash } from "../../theme/images";

const LINKS = [
  { title: "Explore", items: [["all_recipe", "/recipeSuggestionPage"], ["meal_planner", "/mealplanner"], ["groceries", "/groceries"]] },
  { title: "Account", items: [["settings", "/settings"], ["fitness_report", "/fitenssreport"], ["home", "/home"]] },
];

const SOCIAL = [
  { icon: <InstagramIcon />, label: "Instagram", href: "https://instagram.com" },
  { icon: <FacebookRoundedIcon />, label: "Facebook", href: "https://facebook.com" },
  { icon: <LinkedInIcon />, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: <YouTubeIcon />, label: "YouTube", href: "https://youtube.com" },
];

export default function Footer() {
  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <Box component="footer" sx={{ position: "relative", mt: { xs: 8, md: 12 }, color: "rgba(255,255,255,.78)", bgcolor: "var(--mp-ink)", overflow: "hidden" }}>
      {/* subtle food photo texture */}
      <Box
        aria-hidden
        sx={{
          position: "absolute", inset: 0, opacity: 0.12,
          backgroundImage: `url(${unsplash(UNSPLASH.rainbowPantry, { w: 1600, q: 50 })})`,
          backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(30%)",
        }}
      />
      <Container sx={{ position: "relative", py: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Logo light onClick={() => nav("/home")} />
            <Typography sx={{ mt: 2, maxWidth: 380, lineHeight: 1.7 }}>
              {t("footer_tagline", "Good food starts with a good plan. Discover recipes, plan your meals and shop smarter — every day.")}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {SOCIAL.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  sx={{ color: "#fff", bgcolor: "rgba(255,255,255,.08)", "&:hover": { bgcolor: "var(--mp-primary)" } }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
          {LINKS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, md: 2 }}>
              <Typography variant="overline" sx={{ color: "#FED7AA" }}>{col.title}</Typography>
              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                {col.items.map(([key, path]) => (
                  <Link
                    key={path}
                    component="button"
                    onClick={() => nav(path)}
                    sx={{ color: "rgba(255,255,255,.78)", textAlign: "left", fontWeight: 500, "&:hover": { color: "#fff" } }}
                  >
                    {t(key, key.replace(/_/g, " "))}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="overline" sx={{ color: "#FED7AA" }}>Contact</Typography>
            <Stack spacing={1.2} sx={{ mt: 1.5 }}>
              <Link href="tel:+188574643" sx={{ color: "rgba(255,255,255,.78)", fontWeight: 500 }}>+1 885 746 43</Link>
              <Typography>Made with care for home cooks.</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,.1)" }} />
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1, fontSize: 14 }}>
          <Typography variant="body2">© {new Date().getFullYear()} MyRecipe. All rights reserved.</Typography>
          <Typography variant="body2">
            Photos from{" "}
            <Link href="https://unsplash.com" target="_blank" rel="noopener noreferrer" sx={{ color: "#FED7AA" }}>
              Unsplash
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
