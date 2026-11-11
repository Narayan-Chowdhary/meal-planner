import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Box, Button, Chip, Container, Grid, IconButton, InputAdornment, Paper, Skeleton, Stack, TextField,
  ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";

import { base_url, getFoodAPIEndpoint, getIngredientAPIEndpoint } from "../../../config";
import { fetchRecipeData } from "../../../Services/APIEngine";
import { getCurrentUser } from "../../../Services/session";
import AlertComponent from "../Alert/Alert";
import Footer from "../../../pages/Footer/Footer";
import Header from "../Header/Header";
import RecipeCard from "../Card/RecipeCard";
import SectionHeading from "../../common/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../../common/Motion";
import { ScrollToTop } from "../../ScrollToTop/ScrollToTop";

const CATEGORIES = [
  { name: "all", key: "all" },
  { name: "veg", key: "Veg" },
  { name: "non_veg", key: "Nonveg" },
  { name: "vegan", key: "Vegan" },
];

const capitalize = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

function FilterGroup({ title, children }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">{title}</Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}>{children}</Stack>
    </Box>
  );
}

function RecipeSuggestionPage() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const canEdit = getCurrentUser().role === "user";

  const [recipes, setRecipes] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState("all");
  const [ingredient, setIngredient] = useState(null);
  const [search, setSearch] = useState("");
  const [gridView, setGridView] = useState(true);

  // deletion
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);

  const fetchRecipes = () =>
    fetchRecipeData()
      .then((data) => [...(data ?? [])].reverse().map((r) => ({ ...r, keyword: (r.keyword ?? []).map(capitalize) })))
      .catch(() => []);
  const loadRecipes = () => fetchRecipes().then(setRecipes);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
    fetch(`${base_url}${getIngredientAPIEndpoint}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setIngredients)
      .catch(() => setIngredients([]));
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (recipes ?? []).filter(
      (r) =>
        (category === "all" || r.mealCatogary === category) &&
        (!ingredient || r.keyword.includes(ingredient)) &&
        (!q || r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
    );
  }, [recipes, category, ingredient, search]);

  const handleDelete = async (id) => {
    await fetch(`${base_url}${getFoodAPIEndpoint}${id}`, { method: "DELETE" });
    setSelected([]);
    setSelectMode(false);
    loadRecipes();
  };

  const toggleSelected = (id, on) => setSelected((prev) => (on ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)));

  const clearFilters = () => {
    setCategory("all");
    setIngredient(null);
    setSearch("");
  };

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header longHeader />

      <Container component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        <SectionHeading
          overline="Recipe library"
          title={t("all_recipe")}
          subtitle={recipes ? `${visible.length} of ${recipes.length} recipes` : "Loading recipes…"}
          actions={
            canEdit && (
              <Stack direction="row" spacing={1}>
                {selectMode ? (
                  <>
                    <Button variant="outlined" startIcon={<CloseRoundedIcon />} onClick={() => { setSelectMode(false); setSelected([]); }}>
                      Cancel
                    </Button>
                    <Button variant="contained" color="error" startIcon={<DeleteOutlineRoundedIcon />} disabled={!selected.length} onClick={() => setConfirmOpen(true)}>
                      Delete {selected.length || ""}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" startIcon={<ChecklistRoundedIcon />} onClick={() => setSelectMode(true)}>
                      Select
                    </Button>
                    <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => nav("/addrecipe/:id")}>
                      {t("add_recipe")}
                    </Button>
                  </>
                )}
              </Stack>
            )
          }
        />

        {/* Filters toolbar */}
        <Reveal>
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
            <Grid container spacing={3} sx={{ alignItems: "flex-end" }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  placeholder="Search by name or description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FilterGroup title={t("meal_category")}>
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c.key}
                      label={t(c.name, capitalize(c.name.replace("_", "-")))}
                      onClick={() => setCategory(c.key)}
                      color={category === c.key ? "primary" : "default"}
                      variant={category === c.key ? "filled" : "outlined"}
                    />
                  ))}
                </FilterGroup>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FilterGroup title={t("meal_ingredients")}>
                  {ingredients.map((ing) => (
                    <Chip
                      key={ing.ingrid}
                      label={ing.ingrid}
                      onClick={() => setIngredient((cur) => (cur === ing.ingrid ? null : ing.ingrid))}
                      color={ingredient === ing.ingrid ? "secondary" : "default"}
                      variant={ingredient === ing.ingrid ? "filled" : "outlined"}
                    />
                  ))}
                </FilterGroup>
              </Grid>
              <Grid size={{ xs: 12, md: 1 }} sx={{ display: "flex", justifyContent: { md: "flex-end" } }}>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={gridView ? "grid" : "list"}
                  onChange={(_, v) => v && setGridView(v === "grid")}
                  aria-label="Layout"
                >
                  <ToggleButton value="grid" aria-label="Grid view"><GridViewRoundedIcon fontSize="small" /></ToggleButton>
                  <ToggleButton value="list" aria-label="List view"><ViewAgendaRoundedIcon fontSize="small" /></ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Paper>
        </Reveal>

        {/* Results */}
        {recipes === null ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton variant="rounded" sx={{ aspectRatio: "3 / 4", height: "auto", borderRadius: "20px" }} />
              </Grid>
            ))}
          </Grid>
        ) : visible.length === 0 ? (
          <Paper sx={{ textAlign: "center", py: 8, px: 3 }}>
            <RestaurantRoundedIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
            <Typography variant="h5">No recipes match those filters</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Try another ingredient or clear your filters.</Typography>
            <Button variant="contained" onClick={clearFilters}>Clear filters</Button>
          </Paper>
        ) : (
          <Stagger key={`${category}-${ingredient}-${gridView}`}>
            <Grid container spacing={3}>
              {visible.map((item, index) => (
                <Grid key={item.id ?? index} size={gridView ? { xs: 12, sm: 6, md: 4, lg: 3 } : { xs: 12, md: 6 }}>
                  <StaggerItem>
                    <RecipeCard
                      recipe={item}
                      layout={gridView ? "grid" : "list"}
                      priority={index < 4}
                      actionLabel={t("view_recipe")}
                      onOpen={() => nav("/dishPage", { state: { element: item } })}
                      selectable={selectMode}
                      selected={selected.includes(item.id)}
                      onSelect={(on) => toggleSelected(item.id, on)}
                      actions={
                        canEdit && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => nav(`/addrecipe/${item.id}`)} sx={{ bgcolor: "rgba(31,23,18,.05)" }}>
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => { setDeleteId(item.id); setSelected([]); setConfirmOpen(true); }}
                                sx={{ bgcolor: "rgba(197,48,48,.08)" }}
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )
                      }
                    />
                  </StaggerItem>
                </Grid>
              ))}
            </Grid>
          </Stagger>
        )}

        <AlertComponent
          text={selected.length > 1 ? `Delete ${selected.length} recipes?` : "Delete this recipe?"}
          option1="Delete"
          option2="Cancel"
          show={confirmOpen}
          setShow={setConfirmOpen}
          handeldelete={handleDelete}
          dataid={deleteId}
          collectIdToDelete={selected}
        />
      </Container>

      <ScrollToTop />
      <Footer />
    </Box>
  );
}

export default RecipeSuggestionPage;
