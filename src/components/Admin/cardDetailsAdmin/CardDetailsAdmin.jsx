import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box, Card, CardActionArea, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { animate } from "motion/react";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import RamenDiningRoundedIcon from "@mui/icons-material/RamenDiningRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

import { fetchUsersData, fetchProductsData, fetchRecipeData } from "../../../Services/APIEngine";
import { UNSPLASH, unsplash } from "../../../theme/images";
import { Stagger, StaggerItem } from "../../common/Motion";

function CountUp({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value == null) return undefined;
    const controls = animate(0, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [value]);
  return value == null ? <Skeleton width={60} /> : display;
}

function CardDetailsAdmin() {
  const nav = useNavigate();
  const [counts, setCounts] = useState({ users: null, products: null, recipes: null });

  useEffect(() => {
    const safe = (p) => p.catch(() => []);
    Promise.all([safe(fetchUsersData()), safe(fetchProductsData()), safe(fetchRecipeData())]).then(([users, products, recipes]) =>
      setCounts({
        users: (users ?? []).filter((u) => u.role === "user").length,
        products: (products ?? []).length,
        recipes: (recipes ?? []).length,
      })
    );
  }, []);

  const stats = [
    { name: "Users", path: "/users", total: counts.users, icon: <PeopleAltRoundedIcon />, image: UNSPLASH.cookingTogether, tint: "#C2410C" },
    { name: "Products", path: "/products", total: counts.products, icon: <ShoppingBasketRoundedIcon />, image: UNSPLASH.groceryAisle, tint: "#2F6B4F" },
    { name: "Recipes", path: "/allmeals", total: counts.recipes, icon: <RamenDiningRoundedIcon />, image: UNSPLASH.curry, tint: "#9A3412" },
  ];

  return (
    <Stagger>
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid key={s.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <StaggerItem>
              <Card sx={{ position: "relative", overflow: "hidden", color: "#fff", "&:hover .stat-bg": { transform: "scale(1.08)" } }}>
                <Box
                  className="stat-bg"
                  sx={{
                    position: "absolute", inset: 0, backgroundImage: `url(${unsplash(s.image, { w: 700, q: 60 })})`,
                    backgroundSize: "cover", backgroundPosition: "center", transition: "transform 1s var(--mp-ease)",
                  }}
                />
                <Box sx={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${s.tint}EE 10%, ${s.tint}99 60%, rgba(31,23,18,.4))` }} />
                <CardActionArea onClick={() => nav(s.path)} sx={{ position: "relative", p: 3, minHeight: 180 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)" }}>
                      {s.icon}
                    </Box>
                    <ArrowOutwardRoundedIcon sx={{ opacity: 0.8 }} />
                  </Stack>
                  <Typography sx={{ mt: 3, fontFamily: "var(--mp-font-display)", fontWeight: 750, fontSize: 44, lineHeight: 1 }}>
                    <CountUp value={s.total} />
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 600, opacity: 0.9 }}>{s.name}</Typography>
                </CardActionArea>
              </Card>
            </StaggerItem>
          </Grid>
        ))}
      </Grid>
    </Stagger>
  );
}

export default CardDetailsAdmin;
