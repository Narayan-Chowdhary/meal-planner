import { Box, Button, Card, CardActionArea, Checkbox, Chip, Stack, Typography } from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FoodImage from "../../common/FoodImage";
import { dietOf } from "./diet";

/** Veg / non-veg indicator in the familiar square-with-dot style. */
function DietMark({ diet }) {
  if (!diet) return null;
  return (
    <Chip
      size="small"
      label={diet.label}
      icon={
        <Box component="span" sx={{ width: 12, height: 12, border: `2px solid ${diet.color}`, borderRadius: "3px", display: "grid", placeItems: "center", ml: "6px !important" }}>
          <Box component="span" sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: diet.color }} />
        </Box>
      }
      sx={{ bgcolor: "rgba(255,255,255,.92)", backdropFilter: "blur(6px)", color: "text.primary", height: 26, fontSize: 12 }}
    />
  );
}

/**
 * Recipe card used across the app.
 * layout="grid" (image on top) or "list" (image on the left on larger screens).
 */
export default function RecipeCard({
  recipe, onOpen, actionLabel = "View recipe", layout = "grid", priority = false,
  actions, // optional extra buttons (e.g. edit / delete) shown in the footer
  selectable = false, selected = false, onSelect,
}) {
  const diet = dietOf(recipe);
  const calories = String(recipe?.calories ?? recipe?.numCal ?? "").trim();
  const isList = layout === "list";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        outline: selected ? "3px solid var(--mp-primary)" : "none",
        outlineOffset: -3,
        transition: "transform .45s var(--mp-ease), box-shadow .45s var(--mp-ease)",
        "&:hover": { transform: "translateY(-6px)", boxShadow: "var(--mp-shadow-lg)" },
        "&:hover img.recipe-img": { transform: "scale(1.07)" },
        "&:hover .recipe-cta svg": { transform: "translateX(4px)" },
      }}
    >
      {selectable && (
        <Checkbox
          checked={selected}
          onChange={(e) => onSelect?.(e.target.checked)}
          slotProps={{ input: { "aria-label": `Select ${recipe?.title}` } }}
          sx={{ position: "absolute", zIndex: 2, bottom: 8, right: 8, bgcolor: "rgba(255,255,255,.9)", borderRadius: 2, "&:hover": { bgcolor: "#fff" } }}
        />
      )}
      <CardActionArea
        onClick={selectable ? () => onSelect?.(!selected) : onOpen}
        sx={{ display: "flex", flexDirection: isList ? { xs: "column", sm: "row" } : "column", alignItems: "stretch", flex: 1 }}
      >
        <Box sx={{ position: "relative", flexShrink: 0, width: isList ? { xs: "100%", sm: 260 } : "100%" }}>
          <FoodImage
            className="recipe-img"
            src={recipe?.img}
            seed={recipe?.title ?? recipe?.id}
            alt={recipe?.title ?? "Recipe"}
            width={isList ? 520 : 640}
            ratio={isList ? "4 / 3" : "4 / 3"}
            priority={priority}
            sx={{ height: isList ? { sm: "100%" } : undefined }}
            imgSx={{ transition: "opacity .6s ease, transform 1s var(--mp-ease) !important" }}
          />
          <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 12, left: 12, right: 12, justifyContent: "space-between" }}>
            <DietMark diet={diet} />
            {calories && (
              <Chip
                size="small"
                icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 16, color: "#fff !important" }} />}
                label={`${calories} kcal`}
                sx={{ bgcolor: "rgba(31,23,18,.62)", color: "#fff", backdropFilter: "blur(6px)", height: 26, fontSize: 12 }}
              />
            )}
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 2, md: 2.5 }, display: "flex", flexDirection: "column", flex: 1, gap: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h3" sx={{ textTransform: "capitalize", fontSize: { xs: "1.25rem", md: "1.35rem" } }}>
            {recipe?.title}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: 14.5, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: isList ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {recipe?.description}
          </Typography>
          {Array.isArray(recipe?.keyword) && recipe.keyword.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 0.5 }}>
              {recipe.keyword.slice(0, 3).map((k) => (
                <Chip key={k} label={`#${k}`} size="small" variant="outlined" sx={{ height: 24, fontSize: 12, borderColor: "divider", color: "text.secondary" }} />
              ))}
            </Stack>
          )}
          <Box sx={{ flex: 1 }} />
          <Button
            component="span"
            className="recipe-cta"
            endIcon={<ArrowForwardRoundedIcon sx={{ transition: "transform .3s var(--mp-ease)" }} />}
            sx={{ alignSelf: "flex-start", px: 0, color: "primary.main", "&:hover": { bgcolor: "transparent", transform: "none" } }}
          >
            {actionLabel}
          </Button>
        </Box>
      </CardActionArea>
      {actions && !selectable && (
        <Stack direction="row" spacing={0.5} sx={{ position: "absolute", bottom: 10, right: 10, zIndex: 2 }}>
          {actions}
        </Stack>
      )}
    </Card>
  );
}
