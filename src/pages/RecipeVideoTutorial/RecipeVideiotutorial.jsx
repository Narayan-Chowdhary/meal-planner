import { useEffect, useState } from "react";
import Header from "../../components/ui/Header/Header";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "./RecipeVideoTutorial.css";
import Notification from "../Notification/Notification";
import SectionHeading from "../../components/common/SectionHeading";
import FoodImage from "../../components/common/FoodImage";
import { Reveal, Stagger, StaggerItem } from "../../components/common/Motion";

const CUISINES_WITH_DISHES = new Set([
  "Algerian", "Australian", "Canadian", "Chinese", "Croatian", "Egyptian", "Filipino", "Greek", "Irish", "Italian",
  "Jamaican", "Japanese", "Kenyan", "Malaysian", "Mexican", "Moroccan", "Polish", "Portuguese", "Russian", "Saudi Arabian",
]);

function RecipeVideiotutorial() {
  const nav = useNavigate();
  const { t } = useTranslation();

  const [foodData, setFoodData] = useState([]);
  const [meals, setMeals] = useState([]);
  const [flags, setFlags] = useState([]);
  const [youlink, setYoulink] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");

  const getData = async () => {
    const food = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const res = await food.json();
    setFoodData(res.meals);

    // Cuisines come from TheMealDB's own area list (the same API used to filter dishes),
    // so every option is guaranteed to return results. (restcountries.com retired its free API.)
    try {
      const areaResponse = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
      const areas = (await areaResponse.json())?.meals ?? [];
      setFlags(
        areas
          .filter((a) => a.strArea && a.strArea !== "Unknown")
          .map((a) => ({ country: a.strArea, label: a.strCountry }))
          .sort((a, b) => a.country.localeCompare(b.country))
      );
    } catch (err) {
      console.warn("Could not load cuisines", err);
    }
  };

  // Extract the video id from a YouTube "watch?v=<id>" link and open the player.
  const playVideo = (e) => {
    let count = 0;
    let ste = "";
    for (let i = 0; i < e.length - 1; i++) {
      if (e[i] === "=") {
        count = 1;
      }
      if (count == 1) {
        ste += e[i + 1];
      }
    }
    setYoulink(ste);
    setShow(true);
  };

  const findbyCountry = async (con) => {
    const county = con.target.value;
    setCountry(county);
    // "All countries": clear the country-specific list.
    if (!county) {
      setMeals([]);
      return;
    }
    const country = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${county}`);
    const response = await country.json();
    setMeals(response.meals);
    if (response.meals == null) {
      setError(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // TheMealDB lists ~195 cuisines but only these return dishes on the free API (checked Nov 2026).
  // Show just those; if none match (data changed), fall back to the full list.
  const withDishes = flags.filter((f) => CUISINES_WITH_DISHES.has(f.country));
  const countryOptions = withDishes.length ? withDishes : flags;

  return (
    <>
      <Header longHeader />

      <Box component="main" sx={{ bgcolor: "background.default" }}>
        <Container sx={{ py: { xs: 4, md: 6 } }}>
          <SectionHeading
            overline={t("watch_and_cook", "Watch & cook")}
            title={t("recipe_videos", "Recipe videos")}
            subtitle={t("recipe_videos_subtitle", "A fresh recipe video every visit, plus famous dishes from around the world.")}
          />

          {/* Filter toolbar */}
          <Reveal>
            <Paper
              sx={{
                p: { xs: 2, md: 2.5 },
                mb: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flex: 1, minWidth: 0 }}>
                <Avatar sx={{ bgcolor: "rgba(194,65,12,.1)", color: "primary.main", width: 40, height: 40 }}>
                  <PublicRoundedIcon fontSize="small" />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{t("browse_by_country", "Browse by country")}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("browse_by_country_hint", "See the dishes a cuisine is famous for.")}
                  </Typography>
                </Box>
              </Stack>
              <TextField
                select
                size="small"
                label={t("country", "Country")}
                value={country}
                onChange={findbyCountry}
                disabled={countryOptions.length === 0}
                helperText={countryOptions.length === 0 ? t("countries_unavailable", "Country list unavailable right now") : undefined}
                sx={{ width: { xs: "100%", sm: 300 } }}
              >
                <MenuItem value="">{t("all_countries", "All countries")}</MenuItem>
                {countryOptions.map((ele, i) => (
                  <MenuItem value={ele.country} key={`${ele.country}-${i}`}>
                    <Typography component="span" noWrap sx={{ flex: 1 }}>
                      {ele.country}
                    </Typography>
                    {ele.label && (
                      <Typography component="span" variant="body2" color="text.secondary" noWrap>
                        {ele.label}
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </TextField>
            </Paper>
          </Reveal>

          {/* Featured recipe video */}
          <Stack spacing={3}>
            {foodData?.map((item, index) => (
              <Reveal key={item.idMeal ?? index}>
                <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, overflow: "hidden" }}>
                  <Box sx={{ position: "relative", width: { xs: "100%", md: "52%" }, flexShrink: 0 }}>
                    <FoodImage src={item.strMealThumb} seed={item.strMeal} alt={item.strMeal} width={960} ratio="16 / 10" priority sx={{ height: { md: "100%" } }} />
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(31,23,18,.45) 100%)", pointerEvents: "none" }} />
                    <IconButton
                      aria-label={t("play_video", "Play video")}
                      onClick={() => playVideo(item.strYoutube)}
                      disabled={!item.strYoutube}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: 64, md: 80 },
                        height: { xs: 64, md: 80 },
                        bgcolor: "rgba(255,255,255,.92)",
                        color: "primary.main",
                        boxShadow: "var(--mp-shadow-lg)",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          animation: "mp-pulse-ring 2s ease-out infinite",
                        },
                        "&:hover": { bgcolor: "#fff", transform: "translate(-50%, -50%) scale(1.08)" },
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: { xs: 36, md: 44 } }} />
                    </IconButton>
                  </Box>

                  <Stack spacing={2} sx={{ p: { xs: 2.5, md: 4 }, flex: 1, justifyContent: "center" }}>
                    <Typography variant="overline" color="primary">
                      {t("featured_video", "Featured video")}
                    </Typography>
                    <Typography variant="h3" component="h3" sx={{ mt: "0 !important" }}>
                      {item.strMeal}
                    </Typography>
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                      {item.strArea && (
                        <Chip icon={<PlaceOutlinedIcon />} label={`${t("region", "Region")}: ${item.strArea}`} variant="outlined" />
                      )}
                      {item.strCategory && (
                        <Chip icon={<CategoryOutlinedIcon />} label={`${t("category", "Category")}: ${item.strCategory}`} variant="outlined" />
                      )}
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowRoundedIcon />}
                        disabled={!item.strYoutube}
                        onClick={() => playVideo(item.strYoutube)}
                      >
                        {t("watch_video", "Watch video")}
                      </Button>
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() => {
                          nav("/recipeSuggestionPage");
                        }}
                      >
                        {t("other_recipe", "Other recipes")}
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Reveal>
            ))}
          </Stack>

          {/* Dishes for the selected country */}
          {meals?.length ? (
            <Box sx={{ mt: { xs: 5, md: 7 } }}>
              <SectionHeading
                overline={t("around_the_world", "Around the world")}
                title={`${t("famous", "Famous")} ${country} ${t("dishes", "dishes")}`}
                subtitle={`${meals.length} ${t("dishes", "dishes")}`}
              />
              <Stagger>
                <Grid container spacing={3}>
                  {meals.map((e, i) => (
                    <Grid key={e.idMeal ?? i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <StaggerItem>
                        <Card
                          sx={{
                            height: "100%",
                            transition: "transform .45s var(--mp-ease), box-shadow .45s",
                            "&:hover": { transform: "translateY(-6px)", boxShadow: "var(--mp-shadow-lg)" },
                            "&:hover img": { transform: "scale(1.07)" },
                          }}
                        >
                          <FoodImage
                            src={e.strMealThumb}
                            seed={e.strMeal}
                            alt={e.strMeal}
                            width={640}
                            imgSx={{ transition: "opacity .6s ease, transform 1s var(--mp-ease) !important" }}
                          />
                          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography variant="h5" component="h3" sx={{ fontSize: { xs: "1.15rem", md: "1.25rem" } }}>
                              {e.strMeal}
                            </Typography>
                            {country && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {country}
                              </Typography>
                            )}
                          </Box>
                        </Card>
                      </StaggerItem>
                    </Grid>
                  ))}
                </Grid>
              </Stagger>
            </Box>
          ) : null}
        </Container>

        <Dialog
          open={show}
          maxWidth="lg"
          fullWidth
          onClose={() => {
            setShow(false);
          }}
          slotProps={{ paper: { sx: { bgcolor: "#000", overflow: "hidden", position: "relative" } } }}
        >
          <IconButton
            aria-label={t("close", "Close")}
            onClick={() => setShow(false)}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, bgcolor: "rgba(255,255,255,.9)", "&:hover": { bgcolor: "#fff" } }}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Box sx={{ aspectRatio: "16 / 9", width: "100%" }}>
            <iframe
              width="100%"
              height="100%"
              style={{ display: "block", border: 0 }}
              src={`https://www.youtube.com/embed/${youlink}`}
              title={t("recipe_video", "Recipe video")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </Box>
        </Dialog>
      </Box>

      <Notification text="No meals found" status="error" isActive={error} setActive={setError} />
    </>
  );
}

export default RecipeVideiotutorial;
