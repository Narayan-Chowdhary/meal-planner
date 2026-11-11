// Diet classification shared by recipe cards and the recipe page.

export const DIET = {
  veg: { label: "Veg", color: "#2F855A" },
  vegan: { label: "Vegan", color: "#2F6B4F" },
  nonveg: { label: "Non-veg", color: "#C53030" },
};

export function dietOf(recipe) {
  const raw = String(recipe?.mealCatogary || recipe?.icon || "").toLowerCase().replace(/[^a-z]/g, "");
  if (raw.startsWith("nonveg")) return DIET.nonveg;
  if (raw.startsWith("vegan")) return DIET.vegan;
  if (raw.startsWith("veg")) return DIET.veg;
  return null;
}
