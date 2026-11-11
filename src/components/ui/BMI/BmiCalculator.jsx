import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, Chip, Grid, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { base_url, getUserAPIEndpoint } from "../../../config";
import FormDialog from "../../common/FormDialog";

const BmiSchema = Yup.object().shape({
  height: Yup.string().required("Height Required"),
  weight: Yup.string().required("Weight Required"),
});

// Scale shown under the result: 15 → 40 BMI.
const SCALE_MIN = 15;
const SCALE_MAX = 40;
const CATEGORIES = [
  { label: "Underweight", max: 18.5, color: "#2B6CB0" },
  { label: "Normal", max: 25, color: "#2F855A" },
  { label: "Overweight", max: 30, color: "#C05621" },
  { label: "Obese", max: Infinity, color: "#C53030" },
];
// Width (%) of each category band on the scale.
const BANDS = CATEGORIES.map((c, i) => {
  const start = i === 0 ? SCALE_MIN : CATEGORIES[i - 1].max;
  return { ...c, width: ((Math.min(c.max, SCALE_MAX) - start) / (SCALE_MAX - SCALE_MIN)) * 100 };
});
const categoryOf = (value) => CATEGORIES.find((c) => value < c.max);
const pct = (v) => ((Math.min(Math.max(v, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

function BmiResult({ value, title }) {
  const category = categoryOf(value);
  return (
    <Box sx={{ mt: 3, p: { xs: 2.5, sm: 3 }, borderRadius: "20px", bgcolor: "rgba(194,65,12,.05)", border: "1px solid rgba(194,65,12,.15)" }} aria-live="polite">
      <Typography variant="overline" color="text.secondary">{title}</Typography>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Typography sx={{ fontFamily: "var(--mp-font-display)", fontSize: { xs: 52, sm: 64 }, fontWeight: 700, lineHeight: 1, color: category.color }}>
          {value}
        </Typography>
        <Chip label={category.label} sx={{ bgcolor: category.color, color: "#fff", fontWeight: 700 }} />
      </Stack>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Box sx={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden" }}>
          {BANDS.map((c) => (
            <Box key={c.label} sx={{ width: `${c.width}%`, bgcolor: c.color, opacity: c.label === category.label ? 1 : 0.35 }} />
          ))}
        </Box>
        <Box
          sx={{
            position: "absolute", top: -5, left: `${pct(value)}%`, transform: "translateX(-50%)",
            width: 20, height: 20, borderRadius: "50%", bgcolor: "#fff", border: "4px solid", borderColor: category.color,
            boxShadow: "var(--mp-shadow-sm)", transition: "left .5s var(--mp-ease)",
          }}
        />
      </Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1 }}>
        {["< 18.5", "18.5–24.9", "25–29.9", "≥ 30"].map((r, i) => (
          <Typography key={r} variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: i === 0 ? "left" : i === 3 ? "right" : "center" }}>
            {r}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function BmiCalculator(props) {
  const openBmi = props.sendBmi;
  const setOpenBmi = props.sendBmi1;

  const [bmi, setBmi] = useState();
  const [showbmi, setShowBmi] = useState(false);
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("items")) || undefined);

  const dataChange = async () => {
    // Only the stored user is refreshed below; keep other keys (e.g. language) intact.

    let dataOfLogin = await fetch(`${base_url}${getUserAPIEndpoint}${items.id}`);
    let resOfLogin = await dataOfLogin.json();
    localStorage.setItem("items", JSON.stringify(resOfLogin));
    setItems(resOfLogin);
  };

  const handleCancel = () => {
    setOpenBmi(false);
    setBmi("");
    setShowBmi(false);
  };

  const bmiData = async (res) => {
    await fetch(`${base_url}${getUserAPIEndpoint}${items.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ bmi: res }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    dataChange();
  };

  const previous = Number(items?.bmi);

  return (
    <Formik
      initialValues={{ height: "", weight: "" }}
      validationSchema={BmiSchema}
      validateOnChange={false}
      onSubmit={(values) => {
        let height1 = values.height;
        let weight1 = values.weight;
        let bmiRes = weight1 / (height1 * height1);
        let res = Math.round(bmiRes);
        setShowBmi(true);
        setBmi(res);
        bmiData(res);
      }}
    >
      {({ values, errors, handleChange, handleSubmit, resetForm }) => (
        <FormDialog
          open={openBmi}
          onClose={() => {
            handleCancel();
            resetForm();
          }}
          title="BMI Calculator"
          subtitle="Body Mass Index from your height and weight."
          icon={<MonitorWeightRoundedIcon />}
          component="form"
          onSubmit={handleSubmit}
          actions={
            <Button type="submit" variant="contained" startIcon={<CalculateRoundedIcon />}>
              Calculate
            </Button>
          }
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Height"
                name="height"
                type="number"
                autoFocus
                value={values.height}
                error={Boolean(errors.height)}
                helperText={errors.height ?? "In meters, e.g. 1.70"}
                onChange={handleChange("height")}
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">m</InputAdornment> },
                  htmlInput: { min: 0, step: "0.01", inputMode: "decimal" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Weight"
                name="weight"
                type="number"
                value={values.weight}
                error={Boolean(errors.weight)}
                helperText={errors.weight ?? "In kilograms, e.g. 65"}
                onChange={handleChange("weight")}
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> },
                  htmlInput: { min: 0, step: "0.1", inputMode: "decimal" },
                }}
              />
            </Grid>
          </Grid>

          {showbmi && Number.isFinite(bmi) ? (
            <BmiResult value={bmi} title="Your new BMI" />
          ) : Number.isFinite(previous) && items?.bmi ? (
            <Stack direction="row" spacing={1.5} sx={{ mt: 3, alignItems: "center", color: "text.secondary" }}>
              <HistoryRoundedIcon fontSize="small" />
              <Typography variant="body2">
                Previously calculated BMI:{" "}
                <Box component="strong" sx={{ color: categoryOf(previous).color }}>
                  {items.bmi} ({categoryOf(previous).label})
                </Box>
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Enter your height and weight, then press Calculate.
            </Typography>
          )}
        </FormDialog>
      )}
    </Formik>
  );
}

export default BmiCalculator;
