import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box, Button, Chip, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import { base_url, cloudinaryUploadImage_url, getUserAPIEndpoint } from "../../config";
import { UNSPLASH } from "../../theme/images";
import FormCard, { FormSection } from "../common/FormCard";
import ImageUploadField from "../common/ImageUploadField";
import AlertComponent from "../ui/Alert/Alert";
import BmiCalculator from "../ui/BMI/BmiCalculator";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
];

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const SettingSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(20, "Too Long!")
    .required("Name is required"),

  phone: Yup.string()
    .matches(phoneRegExp, "Invalid contact number")
    .required("Contact number is required")
    .min(10, "min lenght should be 10 digit")
    .max(10, "max lenght should be 10 digit"),

  password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .max(20, "Password must be less than 20 characters")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("Password is required"),
});

const BMI_CATEGORIES = [
  { label: "Underweight", max: 18.5, color: "#2B6CB0" },
  { label: "Normal", max: 25, color: "#2F855A" },
  { label: "Overweight", max: 30, color: "#C05621" },
  { label: "Obese", max: Infinity, color: "#C53030" },
];

/** Two-column settings row: heading + description on the left, controls on the right (stacked on phones). */
function SettingsSection({ title, description, children }) {
  return (
    <FormSection>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" component="h2">{title}</Typography>
          {description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>}
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>{children}</Grid>
      </Grid>
    </FormSection>
  );
}

function Settings() {
  const nav = useNavigate();
  const { t, i18n } = useTranslation();

  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [openBmi, setBmi] = useState(false);
  const [showAlert, setShowshowAlert] = useState(false);
  const [open, setOpen] = useState(false); // avatar upload in progress

  const dataFromLogin = JSON.parse(localStorage.getItem("items"));

  const dataChanged = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mealPlanner");
    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json();
    let FinalImageKey = getImage.url;

    await fetch(`${base_url}${getUserAPIEndpoint}${dataFromLogin.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ ProfileImage: FinalImageKey }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    dataChange();
  };

  const dataChange = async () => {
    // Only the stored user is refreshed below; keep other keys (e.g. language) intact.

    let dataOfLogin = await fetch(`${base_url}${getUserAPIEndpoint}${dataFromLogin.id}`);
    let resOfLogin = await dataOfLogin.json();
    localStorage.setItem("items", JSON.stringify(resOfLogin));
    setItems(resOfLogin);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  const handleEditBmi = () => {
    if (items.bmi) {
      const confirmBox = window.confirm("Already Calculated Do you want again calculate");
      if (confirmBox === true) {
        setBmi(true);
      }
    } else {
      setBmi(true);
    }
  };

  const submitData = async (values) => {
    await fetch(`${base_url}users/${dataFromLogin.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    setShowshowAlert(true);
  };

  const handleLanguageChange = (event) => {
    i18next.changeLanguage(event.target.value);
  };

  const currentLanguage = languages.some((l) => l.code === i18n.resolvedLanguage) ? i18n.resolvedLanguage : "en";
  const bmiValue = Number(dataFromLogin?.bmi);
  const hasBmi = Boolean(dataFromLogin?.bmi) && Number.isFinite(bmiValue);
  const bmiCategory = hasBmi ? BMI_CATEGORIES.find((c) => bmiValue < c.max) : null;

  return (
    <Box sx={{ pt: { xs: 2, md: 4 } }}>
      <Formik
        initialValues={{
          name: dataFromLogin?.name,
          phone: dataFromLogin?.phone,
          password: dataFromLogin?.password,
        }}
        validationSchema={SettingSchema}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values) => {
          submitData(values);
        }}
      >
        {({ errors, values, handleChange, handleSubmit, touched, isSubmitting }) => {
          const field = (name) => ({
            name,
            value: values[name] ?? "",
            onChange: handleChange(name),
            error: Boolean(touched[name] && errors[name]),
            helperText: touched[name] ? errors[name] : undefined,
          });

          return (
            <FormCard
              image={UNSPLASH.vegetables}
              overline={t("settings", "Settings")}
              title={t("account_settings", "Your profile")}
              subtitle={t("settings_subtitle", "Manage your personal details, security, health stats and language.")}
              component="form"
              onSubmit={handleSubmit}
              actions={
                <Button type="submit" variant="contained" size="large" startIcon={<SaveRoundedIcon />} disabled={isSubmitting}>
                  {t("Submit")}
                </Button>
              }
            >
              <SettingsSection title={t("profile", "Profile")} description={t("profile_desc", "Your photo and contact details.")}>
                <Box sx={{ mb: 3 }}>
                  <ImageUploadField
                    variant="avatar"
                    label={dataFromLogin?.name || t("profile_photo", "Profile photo")}
                    helperText={t("profile_photo_hint", "PNG or JPG, square works best. Saved instantly.")}
                    value={dataFromLogin?.ProfileImage || ""}
                    uploading={open}
                    onFileSelect={(file) => {
                      dataChanged(file);
                      setOpen(true);
                    }}
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label={t("Name")} type="text" autoComplete="name" {...field("name")} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={t("contact_details")}
                      type="tel"
                      autoComplete="tel"
                      {...field("phone")}
                      slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 10 } }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label={t("Email")}
                      type="email"
                      name="email"
                      value={dataFromLogin?.email ?? ""}
                      helperText={t("email_locked", "Your email is used to sign in and can't be changed here.")}
                      slotProps={{ htmlInput: { readOnly: true } }}
                    />
                  </Grid>
                </Grid>
              </SettingsSection>

              <SettingsSection title={t("security", "Security")} description={t("security_desc", "Use 8–20 characters with upper & lower case, a number and a symbol.")}>
                <TextField
                  label={t("Password")}
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  {...field("password")}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={show ? "Hide password" : "Show password"}
                            onClick={() => setShow((s) => !s)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </SettingsSection>

              <SettingsSection title={t("health", "Health")} description={t("health_desc", "Your Body Mass Index and fitness report.")}>
                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: "18px", border: "1px solid", borderColor: "divider", bgcolor: "rgba(194,65,12,.03)" }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="overline" color="text.secondary">{t("BMI")}</Typography>
                      {hasBmi ? (
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Typography sx={{ fontFamily: "var(--mp-font-display)", fontSize: 40, fontWeight: 700, lineHeight: 1, color: bmiCategory.color }}>
                            {dataFromLogin.bmi}
                          </Typography>
                          <Chip size="small" label={bmiCategory.label} sx={{ bgcolor: bmiCategory.color, color: "#fff", fontWeight: 700 }} />
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">{t("bmi_not_calculated", "Not calculated yet")}</Typography>
                      )}
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <Button variant="outlined" startIcon={<MonitorWeightRoundedIcon />} onClick={handleEditBmi}>
                        {hasBmi ? t("recalculate_bmi", "Recalculate") : t("check_bmi", "Check BMI")}
                      </Button>
                      <Button variant="contained" color="secondary" startIcon={<AssessmentRoundedIcon />} onClick={() => nav("/fitenssreport")}>
                        {t("generate_fitness_report", "Generate fitness report")}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </SettingsSection>

              <SettingsSection title={t("preferences", "Preferences")} description={t("preferences_desc", "Choose the language used across the app.")}>
                <TextField
                  select
                  label={t("change_language")}
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  sx={{ maxWidth: { sm: 320 } }}
                  slotProps={{
                    input: { startAdornment: <InputAdornment position="start"><TranslateRoundedIcon fontSize="small" /></InputAdornment> },
                  }}
                >
                  {languages.map((l) => (
                    <MenuItem key={l.code} value={l.code}>{l.name}</MenuItem>
                  ))}
                </TextField>
              </SettingsSection>
            </FormCard>
          );
        }}
      </Formik>

      <BmiCalculator sendBmi={openBmi} sendBmi1={setBmi} />
      <AlertComponent text="Data Update" option2="Ok" show={showAlert} setShow={setShowshowAlert} />
    </Box>
  );
}

export default Settings;
