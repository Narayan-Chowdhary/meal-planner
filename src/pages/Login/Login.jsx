import { useState } from "react";
import { useNavigate } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box, Button, Chip, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { base_url, getUserAPIEndpoint } from "../../config";
import Notification from "../Notification/Notification";
import AuthLayout from "../../components/common/AuthLayout";
import { UNSPLASH } from "../../theme/images";

// Demo accounts that exist in db.json — clicking one fills the form.
const DEMO_ACCOUNTS = [
  { label: "Demo user", icon: <PersonOutlineRoundedIcon />, email: "test2@gmail.com", password: "Test@12345" },
  { label: "Demo admin", icon: <AdminPanelSettingsOutlinedIcon />, email: "narayan@gmail.com", password: "Narayan@123" },
];

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Enter a valid email address"),
  password: Yup.string().required("Enter Valid password"),
});

export default function Login() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleLoginButton = async (values) => {
    try {
      const response = await fetch(`${base_url}${getUserAPIEndpoint}`);
      const users = await response.json();
      const user = users?.find((u) => u.email === values.email);
      if (user && user.password === values.password) {
        localStorage.setItem("items", JSON.stringify(user));
        nav("/home");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <AuthLayout image={UNSPLASH.heroBowls} quote="Good food, planned well. Your week of meals starts here.">
      <Typography variant="overline" color="primary">Welcome back</Typography>
      <Typography variant="h3" component="h1" sx={{ mt: 0.5 }}>Sign in to MyRecipe</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        Plan meals, discover recipes and manage your groceries.
      </Typography>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        validateOnBlur={false}
        onSubmit={handleLoginButton}
      >
        {({ errors, values, touched, handleChange, handleBlur, isSubmitting, setValues }) => (
          <Form noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email ? errors.email : undefined}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><MailOutlineRoundedIcon fontSize="small" /></InputAdornment> } }}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password ? errors.password : undefined}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((s) => !s)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button type="submit" size="large" variant="contained" fullWidth disabled={isSubmitting} endIcon={<ArrowForwardRoundedIcon />}>
                Login
              </Button>
            </Stack>

            <Divider sx={{ my: 3, color: "text.secondary", fontSize: 13 }}>Try a demo account</Divider>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
              {DEMO_ACCOUNTS.map((d) => (
                <Chip
                  key={d.email}
                  icon={d.icon}
                  label={d.label}
                  variant="outlined"
                  clickable
                  onClick={() => setValues({ email: d.email, password: d.password })}
                  sx={{ px: 1, height: 38, borderColor: "divider", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                />
              ))}
            </Stack>
          </Form>
        )}
      </Formik>

      <Stack spacing={1} sx={{ mt: 4, alignItems: "center", textAlign: "center" }}>
        <Typography color="text.secondary">
          New to Meal Planner?{" "}
          <Link component="button" onClick={() => nav("/signup")}>Create account</Link>
        </Typography>
        <Typography color="text.secondary">
          Just looking?{" "}
          <Link component="button" onClick={() => nav("/recipeSuggestionPage")}>Continue as guest</Link>
        </Typography>
      </Stack>

      <Notification text="Invalid credentials" status="error" isActive={error} setActive={setError} />
    </AuthLayout>
  );
}
