import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Box, Button, Card, CardActionArea, Container, Grid, InputAdornment, Stack, TextField,
  ToggleButton, ToggleButtonGroup, Typography,
} from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import RecipeGrid from "../../components/ui/Card/Card";
import Header from "../../components/ui/Header/Header";
import Footer from "../Footer/Footer";
import CardDetailsAdmin from "../../components/Admin/cardDetailsAdmin/CardDetailsAdmin";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";
import SectionHeading from "../../components/common/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../../components/common/Motion";
import { getCurrentUser } from "../../Services/session";
import { UNSPLASH, unsplash } from "../../theme/images";

const QUICK_ACTIONS = [
  { key: "meal_planner", path: "/mealplanner", icon: <CalendarMonthRoundedIcon />, hint: "Plan your week", color: "#C2410C" },
  { key: "groceries", path: "/groceries", icon: <ShoppingBasketRoundedIcon />, hint: "Shop fresh produce", color: "#2F6B4F" },
  { key: "fitness_report", path: "/fitenssreport", icon: <MonitorHeartRoundedIcon />, hint: "Track your intake", color: "#B7791F" },
  { key: "explore", path: "/recipevt", icon: <PlayCircleRoundedIcon />, hint: "Video tutorials", color: "#9A3412" },
];

function QuickActions() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Stagger>
      <Grid container spacing={2}>
        {QUICK_ACTIONS.map((a) => (
          <Grid key={a.path} size={{ xs: 6, md: 3 }}>
            <StaggerItem>
              <Card sx={{ height: "100%", transition: "transform .35s var(--mp-ease), box-shadow .35s", "&:hover": { transform: "translateY(-4px)", boxShadow: "var(--mp-shadow-md)" } }}>
                <CardActionArea onClick={() => nav(a.path)} sx={{ p: { xs: 2, md: 2.5 }, height: "100%" }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                    <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 3, display: "grid", placeItems: "center", color: a.color, bgcolor: `${a.color}14` }}>
                      {a.icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }}>{t(a.key, a.key.replace(/_/g, " "))}</Typography>
                      <Typography variant="body2" color="text.secondary">{a.hint}</Typography>
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>
            </StaggerItem>
          </Grid>
        ))}
      </Grid>
    </Stagger>
  );
}

function PlannerBanner() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Reveal>
      <Card sx={{ overflow: "hidden", mt: { xs: 8, md: 12 } }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={unsplash(UNSPLASH.healthyBowl, { w: 1000, h: 750 })}
              alt="A healthy breakfast bowl"
              loading="lazy"
              sx={{ width: "100%", height: "100%", minHeight: 260, objectFit: "cover", display: "block" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 3, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="overline" color="primary">Weekly planning</Typography>
            <Typography variant="h3" component="h2" sx={{ mt: 1 }}>
              Eat better with a plan you'll actually follow
            </Typography>
            <Stack spacing={1.2} sx={{ mt: 3 }}>
              {["Schedule breakfast, lunch and dinner on a calendar", "Export your planned meals to CSV", "Keep calories in check with your fitness report"].map((line) => (
                <Stack key={line} direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                  <CheckCircleRoundedIcon color="secondary" fontSize="small" />
                  <Typography color="text.secondary">{line}</Typography>
                </Stack>
              ))}
            </Stack>
            <Button size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 4, alignSelf: "flex-start" }} onClick={() => nav("/mealplanner")}>
              {t("meal_planner")}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Reveal>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const user = getCurrentUser();
  const isAdmin = user.role === "admin";
  const [gridView, setGridView] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header longHeader />

      <Container component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        {isAdmin ? (
          <>
            <SectionHeading overline="Dashboard" title="Overview" subtitle="A quick look at your users, products and recipes." />
            <CardDetailsAdmin />
          </>
        ) : (
          <>
            {user.role === "user" && (
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <QuickActions />
              </Box>
            )}

            <SectionHeading
              overline="Fresh picks"
              title={t("suggested_recipe")}
              subtitle="Hand-picked dishes to inspire your next meal."
              actions={
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", width: { xs: "100%", sm: "auto" } }}>
                  <TextField
                    size="small"
                    placeholder="Search recipes…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: { xs: "100%", sm: 240 } }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> } }}
                  />
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={gridView ? "grid" : "list"}
                    onChange={(_, v) => v && setGridView(v === "grid")}
                    aria-label="Layout"
                    sx={{ bgcolor: "background.paper", "& .MuiToggleButton-root": { border: 0, px: 1.5 }, "& .Mui-selected": { color: "primary.main !important" } }}
                  >
                    <ToggleButton value="grid" aria-label="Grid view"><GridViewRoundedIcon fontSize="small" /></ToggleButton>
                    <ToggleButton value="list" aria-label="List view"><ViewAgendaRoundedIcon fontSize="small" /></ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              }
            />
            <RecipeGrid calendarView={gridView} search={search} limit={8} />
            {!search && (
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <Button size="large" variant="outlined" endIcon={<ArrowForwardRoundedIcon />} onClick={() => nav("/recipeSuggestionPage")}>
                  See all recipes
                </Button>
              </Box>
            )}
            {user.role === "user" && <PlannerBanner />}
          </>
        )}
      </Container>

      <ScrollToTop />
      <Footer />
    </Box>
  );
}
