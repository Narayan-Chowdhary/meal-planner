import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import {
  Avatar, Box, Button, FormHelperText, FormLabel, Grid, IconButton, InputAdornment, LinearProgress, List, ListItem,
  ListItemAvatar, ListItemText, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { base_url, cloudinaryUploadImage_url, getFoodAPIEndpoint } from "../../../config";
import FormCard, { FormSection } from "../../common/FormCard";
import ImageUploadField from "../../common/ImageUploadField";
import { UNSPLASH } from "../../../theme/images";
import vegIcon from "../../../assests/veg-icon.png";
import NonvegIcon from "../../../assests/non-veg-icon.png";
import VeganIcon from "../../../assests/green-leaf-icon.png";
import TagsInput from "../Chip/TagInput";
import AlertComponent from "../Alert/Alert";
import Notification from "../../../pages/Notification/Notification";

const EventSchema = Yup.object().shape({
  title: Yup.string().min(4, "too short").max(20, "Title too long").required("Cannot be empty"),
  description: Yup.string().required("Cannot be empty").max(250, "maximum limit reached"),
  calories: Yup.string().max(3, "Maximum limit reached").required("Cannot be empty"),
  Steps: Yup.array()
    .of(Yup.object().shape({ step: Yup.string().required("Cannot be empty") }))
    .required(1, "Step is required"),
  Ingredient: Yup.array()
    .of(Yup.object().shape({ title: Yup.string().required("Cannot be empty") }))
    .required("Ingredient is required"),
  mealCatogary: Yup.string().required("Cannot be empty"),
});

const DESCRIPTION_MAX = 250;

/** First error message for a Formik array field (either a string or an array of item errors). */
function listError(error, itemKey) {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  return error.find?.((e) => e?.[itemKey])?.[itemKey];
}

/**
 * Repeatable list of `{ [itemKey]: string }` objects: text field + Add button (Enter adds too),
 * items rendered as a numbered list with a delete button each. Keeps the original array shape.
 */
function ListField({ name, itemKey, items = [], setFieldValue, label, placeholder, addLabel, emptyText, error, multiline }) {
  const [draft, setDraft] = useState("");
  // Blank placeholder rows (from the initial `[{ ... : "" }]`) are hidden and replaced on first add.
  const filled = items.map((item, index) => ({ item, index })).filter(({ item }) => String(item?.[itemKey] ?? "").trim());

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setFieldValue(name, [...filled.map(({ item }) => item), { [itemKey]: text }]);
    setDraft("");
  };
  const remove = (index) => {
    const next = items.filter((_, i) => i !== index);
    setFieldValue(name, next.length ? next : [{ [itemKey]: "" }]);
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
        <TextField
          label={label}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              add();
            }
          }}
          multiline={multiline}
          maxRows={multiline ? 4 : undefined}
          error={Boolean(error) && filled.length === 0}
          helperText={error && filled.length === 0 ? error : "Press Enter to add"}
        />
        <Button variant="outlined" onClick={add} disabled={!draft.trim()} startIcon={<AddRoundedIcon />} sx={{ flexShrink: 0, minHeight: 56 }}>
          {addLabel}
        </Button>
      </Stack>

      {filled.length > 0 ? (
        <List dense disablePadding sx={{ mt: 1.5, border: "1px solid", borderColor: "divider", borderRadius: "14px", overflow: "hidden" }}>
          {filled.map(({ item, index }, n) => (
            <ListItem
              key={`${index}-${item[itemKey]}`}
              divider={n < filled.length - 1}
              secondaryAction={
                <Tooltip title="Remove">
                  <IconButton edge="end" aria-label={`Remove ${item[itemKey]}`} onClick={() => remove(index)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
              sx={{ py: 1 }}
            >
              <ListItemAvatar sx={{ minWidth: 44 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 13, fontWeight: 700, bgcolor: "rgba(194,65,12,.1)", color: "primary.main" }}>
                  {n + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item[itemKey]} slotProps={{ primary: { sx: { wordBreak: "break-word" } } }} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, px: 2, py: 1.5, border: "1px dashed", borderColor: "divider", borderRadius: "14px" }}>
          {emptyText}
        </Typography>
      )}
    </Box>
  );
}

function Addrecipe() {
  const { id } = useParams();
  const { t } = useTranslation();
  const nav = useNavigate();

  const [show, setActive] = useState(false);
  const [circular, setCircular] = useState(false);
  const [datafound, setFoundData] = useState(true);
  const [data, setData] = useState();
  const [imgdata, setImage] = useState();
  const [keywords, setkeywords] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const sendimg = async (file, event) => {
    setCircular(true);
    event?.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mealPlanner");

    try {
      const responseImg = await fetch(`${cloudinaryUploadImage_url}`, { method: "post", body: formData });
      const getImage = await responseImg.json();
      const FinalImageKey = getImage.url;
      setActive(true);
      setImage(FinalImageKey);
    } finally {
      setCircular(false);
    }
  };

  function handleSelecetedTags(items) {
    setkeywords(items);
  }

  const sendData = async (values) => {
    let obj2 = { ...values };
    if (!obj2.calories) {
      obj2.calories = obj2.calories + "/" + obj2.caloriesdes;
    }
    const isEdit = id !== ":id";
    obj2.keyword = keywordData?.length ? keywordData : keywords;
    // Keep the existing id on edit; only new recipes get a fresh one
    if (isEdit) delete obj2.id;
    else obj2.id = uuidv4();

    for (let i = 0; i < obj2.Ingredient.length; i++) {
      obj2.Ingredient[i].order = i + 1;
    }
    for (let i = 0; i < obj2.Steps.length; i++) {
      obj2.Steps[i].order = i + 1;
    }

    // On edit keep the current image and votes unless a new image was uploaded
    obj2.img = imgdata || (isEdit ? data?.img : undefined);
    if (isEdit) {
      delete obj2.like;
      delete obj2.dislike;
    } else {
      obj2.like = 0;
      obj2.dislike = 0;
    }

    if (id !== ":id") {
      setTimeout(async () => {
        await fetch(`${base_url}${getFoodAPIEndpoint}${id}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify(obj2),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(() => {
          nav("/recipeSuggestionPage");
        });
      }, 2000);
      setShowAlert(true);
    } else {
      setTimeout(async () => {
        await fetch(`${base_url}${getFoodAPIEndpoint}`, {
          method: "POST",
          body: JSON.stringify(obj2),
          headers: { "Content-Type": "application/json ; charset=utf-8" },
        }).then(() => {
          nav("/recipeSuggestionPage");
        });
      }, 2000);
      setShowAlert(true);
    }
  };

  // Switching back to "add" mode (e.g. /addrecipe/123 -> /addrecipe/:id) resets the form data.
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    if (id === ":id") {
      setData({});
      setFoundData(true);
    }
  }

  useEffect(() => {
    if (id === ":id") return;
    const findFood = async (id) => {
      const res = await fetch(`${base_url}${getFoodAPIEndpoint}${id}`);
      const final = await res.json();
      setData(final);
      setFoundData(false);
    };
    findFood(id);
  }, [id]);

  // Enter in a single-line field must not submit the whole form (list fields handle Enter themselves).
  const preventEnterSubmit = (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") e.preventDefault();
  };

  const loading = id !== ":id" && datafound;
  const categories = [
    { value: "Veg", label: t("veg"), icon: vegIcon },
    { value: "Nonveg", label: t("non_veg"), icon: NonvegIcon },
    { value: "Vegan", label: t("vegan"), icon: VeganIcon },
  ];

  return (
    <Box sx={{ pt: { xs: 2, md: 4 } }}>
      <Formik
        initialValues={
          datafound
            ? {
                id: "",
                img: "",
                title: "",
                description: "",
                calories: "",
                Steps: [{ step: "" }],
                mealCatogary: "",
                Ingredient: [{ title: "" }],
                caloriesdes: "",
                keyword: "",
              }
            : {
                id: data.id,
                img: "",
                title: data.title,
                description: data.description,
                calories: data.calories,
                Steps: data.Steps ? data.Steps : [{ step: "" }],
                mealCatogary: data.mealCatogary,
                Ingredient: data.Ingredient ? data.Ingredient : [{ title: "" }],
                caloriesdes: data.caloriesdes ? data.caloriesdes : "100",
                keyword: data.keyword,
              }
        }
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={EventSchema}
        onSubmit={async (values) => {
          sendData(values);
        }}
        enableReinitialize
      >
        {({ values, errors, handleChange, handleSubmit, setFieldValue, isSubmitting }) => (
          <FormCard
            image={UNSPLASH.rainbowPantry}
            overline={t("recipes", "Recipes")}
            title={datafound ? t("add_your_recipe") : t("update_your_recipe", "Update Your Recipe")}
            subtitle={t("add_recipe_subtitle", "Share the ingredients, method and a photo — we'll take care of the rest.")}
            headerAction={
              datafound && (
                <Button
                  variant="outlined"
                  startIcon={<UploadFileRoundedIcon />}
                  onClick={() => nav("/add-recipe-csv")}
                  sx={{ color: "#fff", borderColor: "rgba(255,255,255,.6)", flexShrink: 0, alignSelf: { xs: "flex-start", sm: "auto" }, "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,.12)" } }}
                >
                  {t("upload_via_csv", "Upload via CSV")}
                </Button>
              )
            }
            component="form"
            onSubmit={handleSubmit}
            actions={
              <>
                <Button variant="text" color="inherit" onClick={() => nav(-1)}>
                  {t("cancel", "Cancel")}
                </Button>
                <Button type="submit" variant="contained" size="large" startIcon={<CheckRoundedIcon />} disabled={isSubmitting || circular}>
                  {datafound ? t("add_recipe") : t("update_recipe", "Update Recipe")}
                </Button>
              </>
            }
          >
            <Box onKeyDown={preventEnterSubmit}>
              {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} aria-label="Loading recipe" />}

              <FormSection title={t("recipe_details", "Recipe details")}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={2.5}>
                      <TextField
                        label={t("title")}
                        name="title"
                        value={values.title ?? ""}
                        onChange={handleChange("title")}
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                      />
                      <TextField
                        label={t("description")}
                        name="description"
                        multiline
                        minRows={4}
                        value={values.description ?? ""}
                        onChange={handleChange("description")}
                        error={Boolean(errors.description)}
                        helperText={errors.description || `${(values.description ?? "").length}/${DESCRIPTION_MAX}`}
                      />
                      <Box>
                        <FormLabel id="meal-category-label" error={Boolean(errors.mealCatogary)} sx={{ display: "block" }}>
                          {t("meal_category")}
                        </FormLabel>
                        <ToggleButtonGroup
                          exclusive
                          fullWidth
                          color="primary"
                          aria-labelledby="meal-category-label"
                          value={values.mealCatogary || null}
                          onChange={(_, value) => value && setFieldValue("mealCatogary", value)}
                          sx={{ "& .MuiToggleButton-root": { gap: 1, py: 1.25, textTransform: "none", fontWeight: 600, borderRadius: "12px" } }}
                        >
                          {categories.map((c) => (
                            <ToggleButton key={c.value} value={c.value}>
                              <Box component="img" src={c.icon} alt="" sx={{ width: 20, height: 20, objectFit: "contain" }} />
                              {c.label}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                        {errors.mealCatogary && <FormHelperText error sx={{ mx: 1.75 }}>{errors.mealCatogary}</FormHelperText>}
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <ImageUploadField
                      label={t("upload_image")}
                      value={imgdata || data?.img}
                      uploading={circular}
                      onFileSelect={sendimg}
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection title={t("ingredients")} description={t("ingredients_hint", "Add one ingredient at a time, with its quantity.")}>
                <ListField
                  name="Ingredient"
                  itemKey="title"
                  items={values.Ingredient}
                  setFieldValue={setFieldValue}
                  label={t("ingredient", "Ingredient")}
                  placeholder="e.g. 2 cups basmati rice"
                  addLabel={t("add", "Add")}
                  emptyText={t("no_ingredients", "No ingredients added yet.")}
                  error={listError(errors.Ingredient, "title")}
                />
              </FormSection>

              <FormSection title={t("steps")} description={t("steps_hint", "Describe the method step by step, in order.")}>
                <ListField
                  name="Steps"
                  itemKey="step"
                  items={values.Steps}
                  setFieldValue={setFieldValue}
                  label={t("step", "Step")}
                  placeholder="e.g. Rinse the rice and soak for 20 minutes"
                  addLabel={t("add", "Add")}
                  emptyText={t("no_steps", "No steps added yet.")}
                  error={listError(errors.Steps, "step")}
                  multiline
                />
              </FormSection>

              <FormSection title={t("nutrition_and_tags", "Nutrition & keywords")}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: datafound ? 6 : 12 }}>
                    <TextField
                      label={t("calories")}
                      type="number"
                      name="calories"
                      value={values.calories ?? ""}
                      onChange={handleChange("calories")}
                      error={Boolean(errors.calories)}
                      helperText={errors.calories}
                      slotProps={{
                        input: { endAdornment: <InputAdornment position="end">kcal</InputAdornment> },
                        htmlInput: { min: 0, inputMode: "numeric" },
                      }}
                    />
                  </Grid>
                  {datafound && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label={t("calories_per", "Per quantity (g / kg)")}
                        type="number"
                        name="caloriesdes"
                        value={values.caloriesdes ?? ""}
                        onChange={handleChange("caloriesdes")}
                        error={Boolean(errors.caloriesdes)}
                        helperText={errors.caloriesdes || "e.g. 100"}
                        slotProps={{ htmlInput: { min: 0, inputMode: "numeric" } }}
                      />
                    </Grid>
                  )}
                  <Grid size={12}>
                    <TagsInput
                      selectedTags={handleSelecetedTags}
                      label={t("keywords")}
                      placeholder={data?.keyword ? "Update keywords" : "Add keyword"}
                      helperText={t("keywords_hint", "Press space to add a keyword")}
                      data={data?.keyword}
                      fun={setKeywordData}
                    />
                  </Grid>
                </Grid>
              </FormSection>
            </Box>
          </FormCard>
        )}
      </Formik>

      <AlertComponent text="Recipe Updated" option2="Ok" show={showAlert} setShow={setShowAlert} />
      <Notification text={"image uploaded"} isActive={show} setActive={setActive} />
    </Box>
  );
}

export default Addrecipe;
