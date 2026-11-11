import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router";
import {
  Box, Button, Card, Checkbox, Chip, Container, Divider, Grid, IconButton, Menu, MenuItem, ListItemIcon,
  Stack, Tooltip, Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import ThumbDownOffAltRoundedIcon from "@mui/icons-material/ThumbDownOffAltRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon } from "react-share";

import { base_url, getFoodAPIEndpoint } from "../../config";
import { getCurrentUser } from "../../Services/session";
import BmiCalculator from "../ui/BMI/BmiCalculator";
import FoodImage from "../common/FoodImage";
import { Reveal } from "../common/Motion";
import { dietOf } from "../ui/Card/diet";
import { optimizeImage } from "../../theme/images";

const json = { "Content-Type": "application/json; charset=UTF-8" };

function Fact({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "rgba(194,65,12,.1)", color: "primary.main" }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Stack>
  );
}

function DishPage() {
  const location = useLocation();
  const nav = useNavigate();
  const recipe = location.state.element;
  const user = getCurrentUser();
  const isUser = user.role === "user";

  const [servings, setServings] = useState(1);
  const [openBmi, setOpenBmi] = useState(false);
  const [shareEl, setShareEl] = useState(null);
  const [vote, setVote] = useState({ like: recipe.like, dislike: recipe.dislike });
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    fetch(`${base_url}${getFoodAPIEndpoint}${recipe.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setVote({ like: data.like, dislike: data.dislike }))
      .catch(() => {});
  }, [recipe.id]);

  const castVote = (liked) => {
    const next = { like: liked ? 1 : 0, dislike: liked ? 0 : 1 };
    setVote(next);
    fetch(`${base_url}${getFoodAPIEndpoint}${recipe.id}`, { method: "PATCH", headers: json, body: JSON.stringify(next) }).catch(() => {});
  };

  const ingredients = recipe.Ingredient ?? [];
  const steps = recipe.Steps ?? [];
  const caloriesPerServing = Number(String(recipe.calories ?? recipe.numCal ?? "").trim()) || null;
  const diet = dietOf(recipe);

  const shareText = [
    `${recipe.title}`,
    ingredients.length ? `\nIngredients:\n${ingredients.map((i) => `• ${i.title}`).join("\n")}` : "",
    steps.length ? `\nSteps:\n${steps.map((s, i) => `${i + 1}. ${s.step}`).join("\n")}` : "",
  ].join("\n");
  const shareUrl = optimizeImage(recipe.img, 1200) || window.location.origin;

  const nativeShare = async () => {
    setShareEl(null);
    try {
      await navigator.share({ title: recipe.title, text: shareText, url: shareUrl });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <Container>
      <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => nav(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      {/* Hero */}
      <Reveal>
        <Box sx={{ position: "relative", borderRadius: "28px", overflow: "hidden", color: "#fff" }}>
          <FoodImage src={recipe.img} seed={recipe.title} alt={recipe.title} width={1600} ratio="21 / 9" priority sx={{ minHeight: { xs: 300, md: 420 } }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,23,18,.05) 30%, rgba(31,23,18,.85) 100%)" }} />
          <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, p: { xs: 2.5, md: 5 } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}>
              {diet && <Chip label={diet.label} sx={{ bgcolor: diet.color, color: "#fff" }} />}
              {(recipe.keyword ?? []).slice(0, 3).map((k) => (
                <Chip key={k} label={`#${k}`} sx={{ bgcolor: "rgba(255,255,255,.18)", color: "#fff", backdropFilter: "blur(6px)", textTransform: "capitalize" }} />
              ))}
            </Stack>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" }, textTransform: "capitalize" }}>
              {recipe.title}
            </Typography>
          </Box>
        </Box>
      </Reveal>

      {/* Toolbar: facts + actions */}
      <Card sx={{ mt: { xs: 2, md: -5 }, mx: { md: 4 }, position: "relative", p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}>
          <Stack direction="row" spacing={{ xs: 2, sm: 4 }} sx={{ flexWrap: "wrap", rowGap: 2 }}>
            {caloriesPerServing && (
              <Fact icon={<LocalFireDepartmentRoundedIcon />} value={`${caloriesPerServing * servings} kcal`} label={servings > 1 ? `${servings} servings` : "per serving"} />
            )}
            <Fact icon={<FormatListBulletedRoundedIcon />} value={ingredients.length} label="Ingredients" />
            <Fact icon={<ListAltRoundedIcon />} value={steps.length} label="Steps" />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
            <Stack direction="row" sx={{ alignItems: "center", bgcolor: "rgba(31,23,18,.05)", borderRadius: 999, p: 0.5 }}>
              <IconButton size="small" aria-label="Fewer servings" disabled={servings <= 1} onClick={() => setServings((s) => Math.max(1, s - 1))}>
                <RemoveRoundedIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 72, textAlign: "center", fontWeight: 700 }}>{servings} serving{servings > 1 ? "s" : ""}</Typography>
              <IconButton size="small" aria-label="More servings" onClick={() => setServings((s) => s + 1)}>
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Tooltip title="I like this">
              <IconButton onClick={() => castVote(true)} color={vote.like ? "primary" : "default"} aria-pressed={Boolean(vote.like)}>
                {vote.like ? <ThumbUpRoundedIcon /> : <ThumbUpOffAltRoundedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Not for me">
              <IconButton onClick={() => castVote(false)} color={vote.dislike ? "primary" : "default"} aria-pressed={Boolean(vote.dislike)}>
                {vote.dislike ? <ThumbDownRoundedIcon /> : <ThumbDownOffAltRoundedIcon />}
              </IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<IosShareRoundedIcon />} onClick={(e) => setShareEl(e.currentTarget)}>
              Share
            </Button>
            {isUser && (
              <Button variant="contained" startIcon={<MonitorWeightRoundedIcon />} onClick={() => setOpenBmi(true)}>
                Check BMI
              </Button>
            )}
          </Stack>
        </Stack>
      </Card>

      {recipe.description && (
        <Reveal>
          <Typography sx={{ mt: { xs: 4, md: 6 }, maxWidth: 820, fontSize: { md: "1.15rem" }, lineHeight: 1.8, color: "text.secondary" }}>
            {recipe.description}
          </Typography>
        </Reveal>
      )}

      <Grid container spacing={{ xs: 3, md: 5 }} sx={{ mt: { xs: 1, md: 3 } }}>
        {/* Ingredients checklist */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal>
            <Card sx={{ p: { xs: 2.5, md: 3.5 }, position: { md: "sticky" }, top: { md: 90 } }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
                <Typography variant="h4" component="h2">Ingredients</Typography>
                {ingredients.length > 0 && (
                  <Typography variant="body2" color="text.secondary">{checked.length}/{ingredients.length}</Typography>
                )}
              </Stack>
              <Divider sx={{ my: 2 }} />
              {ingredients.length === 0 && <Typography color="text.secondary">No ingredients listed.</Typography>}
              <Stack>
                {ingredients.map((ing, i) => {
                  const on = checked.includes(i);
                  return (
                    <Stack
                      key={i}
                      direction="row"
                      component="label"
                      sx={{ alignItems: "center", py: 0.5, cursor: "pointer", borderRadius: 2, "&:hover": { bgcolor: "rgba(31,23,18,.03)" } }}
                    >
                      <Checkbox checked={on} onChange={() => setChecked((c) => (on ? c.filter((x) => x !== i) : [...c, i]))} color="secondary" />
                      <Typography sx={{ textDecoration: on ? "line-through" : "none", color: on ? "text.secondary" : "text.primary", transition: "color .2s" }}>
                        {ing.title}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>
          </Reveal>
        </Grid>

        {/* Steps */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 3 }}>Method</Typography>
          {steps.length === 0 && <Typography color="text.secondary">No steps listed.</Typography>}
          <Stack spacing={0}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={Math.min(i, 6) * 0.04}>
                <Stack direction="row" spacing={2.5} sx={{ position: "relative", pb: 3.5 }}>
                  {/* timeline line */}
                  {i < steps.length - 1 && <Box sx={{ position: "absolute", left: 19, top: 44, bottom: 0, width: 2, bgcolor: "rgba(194,65,12,.18)" }} />}
                  <Box
                    sx={{
                      flexShrink: 0, width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center",
                      fontWeight: 800, color: "#fff", background: "linear-gradient(135deg, var(--mp-primary-light), var(--mp-primary))",
                      boxShadow: "0 6px 14px rgba(194,65,12,.3)",
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography sx={{ pt: 1, lineHeight: 1.75 }}>{s.step}</Typography>
                </Stack>
              </Reveal>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* Share menu */}
      <Menu anchorEl={shareEl} open={Boolean(shareEl)} onClose={() => setShareEl(null)}>
        {typeof navigator !== "undefined" && navigator.share && (
          <MenuItem onClick={nativeShare}>
            <ListItemIcon><IosShareRoundedIcon fontSize="small" /></ListItemIcon>
            Share…
          </MenuItem>
        )}
        <MenuItem onClick={() => setShareEl(null)} sx={{ p: 0 }}>
          <WhatsappShareButton title={shareText} url={shareUrl} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 16px", width: "100%" }}>
            <WhatsappIcon size={24} round /> WhatsApp
          </WhatsappShareButton>
        </MenuItem>
        <MenuItem onClick={() => setShareEl(null)} sx={{ p: 0 }}>
          <FacebookShareButton url={shareUrl} hashtag="#MyRecipe" style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 16px", width: "100%" }}>
            <FacebookIcon size={24} round /> Facebook
          </FacebookShareButton>
        </MenuItem>
      </Menu>

      <BmiCalculator sendBmi={openBmi} sendBmi1={setOpenBmi} />
    </Container>
  );
}

// This page depends on router state passed via navigate(); when opened directly
// (refresh / deep link) that state is missing, so redirect instead of crashing.
function DishPageRoute() {
  const location = useLocation();
  if (location.state?.element == null) return <Navigate to="/recipeSuggestionPage" replace />;
  return <DishPage />;
}

export default DishPageRoute;
