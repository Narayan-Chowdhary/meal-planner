import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { base_url, getFoodAPIEndpoint } from "../../../config";
import RecipeCard from "./RecipeCard";
import { Stagger, StaggerItem } from "../../common/Motion";

function CardSkeleton() {
  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--mp-shadow-sm)" }}>
      <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 3", height: "auto" }} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="60%" height={32} />
        <Skeleton />
        <Skeleton width="80%" />
      </Box>
    </Box>
  );
}

/** Recipe grid/list used on the home page. `calendarView` = grid layout (legacy prop name). */
function Card({ calendarView = true, search = "", limit }) {
  const [recipes, setRecipes] = useState(null);
  const nav = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${base_url}${getFoodAPIEndpoint}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRecipes([...data].reverse()))
      .catch((err) => {
        if (err.name !== "AbortError") setRecipes([]);
      });
    return () => controller.abort();
  }, []);

  const q = search.trim().toLowerCase();
  const matches = (recipes ?? []).filter(
    (r) => !q || r.title?.toLowerCase().includes(q) || r.keyword?.some?.((k) => String(k).toLowerCase().includes(q))
  );
  // When searching show every match; otherwise show a short curated selection.
  const visible = limit && !q ? matches.slice(0, limit) : matches;
  const size = calendarView ? { xs: 12, sm: 6, md: 4, lg: 3 } : { xs: 12, md: 6 };

  if (recipes === null) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} size={size}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (visible.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5">No recipes found</Typography>
        <Typography color="text.secondary">Try a different search.</Typography>
      </Box>
    );
  }

  return (
    <Stagger key={`${calendarView}-${q}`}>
      <Grid container spacing={3}>
        {visible.map((item, index) => (
          <Grid key={item.id ?? index} size={size}>
            <StaggerItem>
              <RecipeCard
                recipe={item}
                layout={calendarView ? "grid" : "list"}
                priority={index < 4}
                actionLabel={t("view_recipe")}
                onOpen={() => nav("/dishPage", { state: { element: item } })}
              />
            </StaggerItem>
          </Grid>
        ))}
      </Grid>
    </Stagger>
  );
}

export default Card;
