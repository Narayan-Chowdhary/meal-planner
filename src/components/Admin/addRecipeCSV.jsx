import { Fragment, useId, useState } from "react";
import { useNavigate } from "react-router";
import Papa from "papaparse";
import {
  Alert, Box, Button, Chip, Collapse, IconButton, LinearProgress, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { base_url } from "../../config";
import FormCard, { FormSection } from "../common/FormCard";
import FoodImage from "../common/FoodImage";
import { UNSPLASH } from "../../theme/images";

// Columns the importer expects. Ingredient / Steps / keyword are JSON arrays inside the cell.
const TEMPLATE_COLUMNS = [
  { name: "title", example: "Vegetable Pulao" },
  { name: "description", example: "Fragrant one-pot rice with mixed vegetables" },
  { name: "mealCatogary", example: "Veg" },
  { name: "calories", example: "350" },
  { name: "img", example: "https://…/pulao.jpg" },
  { name: "Ingredient", example: '[{"title":"1 cup basmati rice"},{"title":"1 carrot"}]' },
  { name: "Steps", example: '[{"step":"Soak the rice"},{"step":"Cook with vegetables"}]' },
  { name: "keyword", example: '["rice","pulao"]' },
];

const formatSize = (bytes = 0) => (bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

function downloadTemplate() {
  const csv = Papa.unparse({
    fields: TEMPLATE_COLUMNS.map((c) => c.name),
    data: [TEMPLATE_COLUMNS.map((c) => (c.name === "img" ? "" : c.example))],
  });
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "recipes-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function RecipeRow({ recipe }) {
  const [open, setOpen] = useState(false);
  const ingredients = Array.isArray(recipe.Ingredient) ? recipe.Ingredient : [];
  const steps = Array.isArray(recipe.Steps) ? recipe.Steps : [];
  const keywords = Array.isArray(recipe.keyword) ? recipe.keyword : [];

  return (
    <Fragment>
      <TableRow hover sx={{ "& > td": { borderBottom: open ? "none" : undefined } }}>
        <TableCell padding="checkbox">
          <IconButton size="small" aria-label={open ? "Hide details" : "Show details"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <KeyboardArrowDownRoundedIcon sx={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 220 }}>
            <FoodImage src={recipe.img} alt={recipe.title} seed={recipe.title} width={120} ratio="1 / 1" sx={{ width: 48, flexShrink: 0, borderRadius: "10px" }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }} noWrap>{recipe.title}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 320 }}>{recipe.description}</Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>{recipe.mealCatogary && <Chip size="small" label={recipe.mealCatogary} color={recipe.mealCatogary === "Nonveg" ? "primary" : "secondary"} variant="outlined" />}</TableCell>
        <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{recipe.calories ? recipe.calories : "0"} kcal</TableCell>
        <TableCell align="right">{ingredients.length}</TableCell>
        <TableCell align="right">{steps.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" }, py: 2.5, px: { md: 1 } }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Ingredients</Typography>
                <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                  {ingredients.map((item, i) => <li key={i}><Typography variant="body2">{item.title}</Typography></li>)}
                </Box>
                {keywords.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Keywords</Typography>
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                      {keywords.map((k) => <Chip key={k} label={k} size="small" />)}
                    </Stack>
                  </>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Steps</Typography>
                <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                  {steps.map((s, i) => <li key={i}><Typography variant="body2" sx={{ mb: 0.5 }}>{s.step}</Typography></li>)}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

function AddRecipeCSV() {
  const nav = useNavigate();
  const inputId = useId();
  const [ufData, setUFData] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const startImport = (file) => {
    if (!file) return;
    setUFData(file);
    setImportError(null);
    handleCSVUpload(file);
  };

  const handleFileUpload = (event) => {
    startImport(event.target.files[0]);
    event.target.value = ""; // allow re-selecting the same file
  };

  function handleCSVUpload(data) {
    setImporting(true);
    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        parsingDataAndPreparingResult(results.data);
      },
      error: function (err) {
        setImportError(err?.message ?? "Could not read this file.");
        setImporting(false);
      },
    });
  }

  // Each parsed row is posted to the Food collection; the saved record is appended to the preview.
  const parsingDataAndPreparingResult = async (data) => {
    try {
      for (let i = 0; i < data.length; i++) {
        const finalfood = data[i];
        finalfood.Ingredient = JSON.parse(finalfood.Ingredient.replace(/(\r\n|\n|\r)/gm, "").trim());
        finalfood.Steps = JSON.parse(finalfood.Steps.replace(/(\r\n|\n|\r)/gm, "").trim());
        finalfood.keyword = JSON.parse(finalfood.keyword.replace(/(\r\n|\n|\r)/gm, "").trim());

        const postfood = await fetch(`${base_url}Food`, {
          method: "POST",
          body: JSON.stringify(finalfood),
          headers: { "Content-Type": "application/json ; charset=utf-8" },
        });
        const response = await postfood.json();
        setPreviewData((prev) => [...prev, response]);
      }
    } catch (err) {
      setImportError(`Import stopped: ${err?.message ?? "a row could not be processed"}. Check the Ingredient, Steps and keyword columns contain valid JSON.`);
    } finally {
      setImporting(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!importing) startImport(e.dataTransfer.files?.[0]);
  };

  return (
    <Box sx={{ pt: { xs: 2, md: 4 } }}>
      <FormCard
        maxWidth="lg"
        image={UNSPLASH.market}
        overline="Recipes"
        title="Upload recipes via CSV"
        subtitle="Import many recipes at once from a spreadsheet. Every row becomes a recipe."
        headerAction={
          <Button
            variant="outlined"
            startIcon={<EditNoteRoundedIcon />}
            onClick={() => nav("/addrecipe/:id")}
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,.6)", flexShrink: 0, alignSelf: { xs: "flex-start", sm: "auto" }, "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,.12)" } }}
          >
            Add a single recipe
          </Button>
        }
      >
        <FormSection title="Choose a file">
          <Box
            component="label"
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            sx={{
              position: "relative", display: "grid", placeItems: "center", textAlign: "center", gap: 1, px: 3, py: { xs: 4, md: 5 },
              borderRadius: "18px", border: "2px dashed", cursor: importing ? "progress" : "pointer",
              borderColor: dragOver ? "primary.main" : "rgba(194,65,12,.35)",
              bgcolor: dragOver ? "rgba(194,65,12,.08)" : "rgba(194,65,12,.04)",
              transition: "border-color .2s, background-color .2s",
              "&:hover": { borderColor: "primary.main", bgcolor: "rgba(194,65,12,.07)" },
              "&:focus-within": { outline: "3px solid rgba(194,65,12,.35)", outlineOffset: 2 },
            }}
          >
            <input type="file" id={inputId} onChange={handleFileUpload} accept=".csv, .xlsx" disabled={importing} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
            <CloudUploadRoundedIcon color="primary" sx={{ fontSize: 44 }} />
            <Typography sx={{ fontWeight: 700 }}>
              {importing ? "Importing recipes…" : <>Drag &amp; drop your CSV here, or <Box component="span" sx={{ color: "primary.main", textDecoration: "underline" }}>browse</Box></>}
            </Typography>
            <Typography variant="body2" color="text.secondary">One recipe per row, with a header row</Typography>
          </Box>

          {ufData && (
            <Stack direction="row" sx={{ mt: 2, flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              <Chip icon={<DescriptionRoundedIcon />} label={ufData.name} variant="outlined" sx={{ maxWidth: "100%" }} />
              <Chip label={formatSize(ufData.size)} variant="outlined" />
              <Chip label={`${previewData.length} imported`} color={previewData.length ? "secondary" : "default"} />
            </Stack>
          )}
          {importing && <LinearProgress sx={{ mt: 2, borderRadius: 2 }} aria-label="Importing recipes" />}
          {importError && <Alert severity="error" sx={{ mt: 2 }} onClose={() => setImportError(null)}>{importError}</Alert>}
        </FormSection>

        <FormSection title="File format" description="Use these column headers. Ingredient, Steps and keyword cells hold JSON arrays.">
          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: "14px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Column</TableCell>
                  <TableCell>Example</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {TEMPLATE_COLUMNS.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{c.name}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 13, wordBreak: "break-word" }}>{c.example}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="text" startIcon={<DownloadRoundedIcon />} onClick={downloadTemplate} sx={{ mt: 1.5 }}>
            Download template
          </Button>
        </FormSection>

        {previewData.length > 0 && (
          <FormSection title="Imported recipes" description={`${previewData.length} recipe${previewData.length === 1 ? "" : "s"} saved. Expand a row to check its ingredients and steps.`}>
            <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: "14px" }}>
              <Table size="small" aria-label="Imported recipes">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>Recipe</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Ingredients</TableCell>
                    <TableCell align="right">Steps</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((recipe, i) => <RecipeRow key={recipe.id ?? i} recipe={recipe} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </FormSection>
        )}
      </FormCard>
    </Box>
  );
}

export default AddRecipeCSV;
