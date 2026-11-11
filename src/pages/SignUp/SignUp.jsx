import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import {
  Alert, Button, Grid, IconButton, InputAdornment, LinearProgress, Link, Snackbar, Stack, TextField, Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { base_url, getUserAPIEndpoint, firebaseDatabaseURL } from "../../config";
import AuthLayout from "../../components/common/AuthLayout";
import { UNSPLASH } from "../../theme/images";

const phoneRegExp = /^[0-9]{10}$/;

const SignUpSchema = Yup.object().shape({
  Name: Yup.string().trim().min(3, "Too Short!").max(20, "Too Long!").required("Name is required"),
  Email: Yup.string()
    .email("Invalid email address format")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid Email Address")
    .required("Email is required"),
  Phone: Yup.string().matches(phoneRegExp, "Enter a 10-digit contact number").required("Contact number is required"),
  Password: Yup.string()
    .min(8, "Password must be 8 characters at minimum")
    .max(20, "Password must be less than 20 characters")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol")
    .required("Password is required"),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("Password"), null], 'Must match "Password" field value')
    .required("Confirm Password is required"),
});

/** 0–4 score for the strength meter */
function passwordScore(pw = "") {
  return [/.{8,}/, /[A-Z]/, /[0-9]/, /[^\w]/].filter((r) => r.test(pw)).length;
}
const STRENGTH = [
  { label: "Too weak", color: "error" },
  { label: "Weak", color: "error" },
  { label: "Fair", color: "warning" },
  { label: "Good", color: "info" },
  { label: "Strong", color: "success" },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState({ password: false, confirm: false });
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    fetch(`${base_url}${getUserAPIEndpoint}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const createUser = async (data) => {
    if (users.some((u) => u.email?.toLowerCase() === data.Email.toLowerCase())) {
      setEmailExists(true);
      return;
    }
    const id = uuidv4();
    const name = data.Name.trim();
    const headers = { "Content-Type": "application/json; charset=utf-8" };

    // Notify admins (Firebase realtime DB) — best-effort, never blocks sign-up
    fetch(`${firebaseDatabaseURL}mealplanner.json`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, id, email: data.Email, role: "user", is_read: false }),
    }).catch(() => {});

    await fetch(`${base_url}${getUserAPIEndpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, id, email: data.Email, phone: data.Phone, password: data.Password, role: "user" }),
    });
    navigate("/");
  };

  const passwordAdornment = (key) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label={show[key] ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
          onMouseDown={(e) => e.preventDefault()}
          edge="end"
        >
          {show[key] ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  });

  return (
    <AuthLayout image={UNSPLASH.market} quote="Fresh ingredients, smarter plans and recipes you'll want to cook again.">
      <Typography variant="overline" color="primary">Get started</Typography>
      <Typography variant="h3" component="h1" sx={{ mt: 0.5 }}>Create your account</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        It takes less than a minute. No credit card needed.
      </Typography>

      <Formik
        initialValues={{ Name: "", Email: "", Phone: "", Password: "", ConfirmPassword: "" }}
        validationSchema={SignUpSchema}
        onSubmit={createUser}
      >
        {({ errors, values, handleChange, handleBlur, touched, isSubmitting }) => {
          const field = (name, props = {}) => ({
            name,
            value: values[name],
            onChange: handleChange,
            onBlur: handleBlur,
            error: Boolean(touched[name] && errors[name]),
            helperText: touched[name] ? errors[name] : undefined,
            ...props,
          });
          const score = passwordScore(values.Password);

          return (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField label="Full name" autoComplete="name" {...field("Name")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <TextField label="Email" type="email" autoComplete="email" {...field("Email")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField label="Phone" type="tel" autoComplete="tel" {...field("Phone", { slotProps: { htmlInput: { inputMode: "numeric", maxLength: 10 } } })} />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Password"
                    type={show.password ? "text" : "password"}
                    autoComplete="new-password"
                    {...field("Password", { slotProps: { input: passwordAdornment("password") } })}
                  />
                  {values.Password && (
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mt: 1, px: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(score / 4) * 100}
                        color={STRENGTH[score].color}
                        sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "rgba(31,23,18,.08)" }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 56 }}>{STRENGTH[score].label}</Typography>
                    </Stack>
                  )}
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Confirm password"
                    type={show.confirm ? "text" : "password"}
                    autoComplete="new-password"
                    {...field("ConfirmPassword", { slotProps: { input: passwordAdornment("confirm") } })}
                  />
                </Grid>
                <Grid size={12}>
                  <Button type="submit" size="large" variant="contained" fullWidth disabled={isSubmitting} endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 1 }}>
                    Create account
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>

      <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        Already have an account? <Link component="button" onClick={() => navigate("/")}>Sign in</Link>
      </Typography>

      <Snackbar open={emailExists} autoHideDuration={4000} onClose={() => setEmailExists(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled" onClose={() => setEmailExists(false)}>
          An account with this email already exists.
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}
