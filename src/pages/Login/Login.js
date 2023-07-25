import "../../components/MajorCSS/majorCss.css";
import { React, useEffect, useState } from "react";
import {
  base_url,
  getUserAPIEndpoint,
  getMealAPIEndpoint,
  getLayoutAPIEndpoint,
} from "../../config";

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Container,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Notification from "../Notification/Notification";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const nav = useNavigate();

  const BoxStyling = {
    display: "flex",
    justifyContent: "center",
  };
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
    const [pageStyles, setpageStyles] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Enter a valid email address"),
    password: Yup.string().required("Enter Valid password"),
  });

  const handleLoginButton = async (values) => {
    const ApiResponse = await fetch(`${base_url}${getUserAPIEndpoint}`);
    const LoginResponse = await ApiResponse.json();
    const findUser = LoginResponse?.find((user) => user.email === values.email);
    const findEmail = findUser?.email === values?.email;
    const findPassword = findUser?.password === values?.password;

    if (findEmail && findPassword) {
      nav("/home");
      localStorage.setItem("items", JSON.stringify(findUser));
    } else {
      setError(true);
    }
  };

  const fetchStyles = async () => {
    const response = await fetch(
      `${base_url}${getLayoutAPIEndpoint}?module=Login`
    );
    let styles = await response.json();
 
    setpageStyles(styles[0]?.styles);
  };

  useEffect(() => {
    fetchStyles();
  }, []);
  return (
    <>
      <Box
        className="form_Data_Container"
        sx={{
          background: `${pageStyles?.bgColor} !important`,
        }}
      >
        <Box sx={{ width: 800 }}>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            validateOnChange={true}
            validateOnBlur={false}
            handleChange={() => {
              console.log("ad");
            }}
            onSubmit={(values) => {
              handleLoginButton(values);
            }}
          >
            {({
              errors,
              values,
              touched,
              handleChange,
              validateField,
              validateForm,
            }) => (
              <Form>
                <Box>
                  <Box className="secound_Container_Form">
                    <Box>
                      <Typography variant="h3" className="Heading_Text_all">
                        MyRecipe
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        className="font_Headline_Welcome"
                        sx={{
                          color: `${pageStyles?.TextColor} !important`,
                        }}
                      >
                        Welcome Back
                      </Typography>
                    </Box>
                    <Grid container rowSpacing={1} sx={{ px: 8 }}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Typography
                          variant="h6"
                          className="all_Lable_In_Components"
                          sx={{
                            color: `${pageStyles?.TextColor} !important`,
                          }}
                        >
                          Email
                        </Typography>
                        <TextField
                          type="text"
                          name="email"
                          value={values.email}
                          helperText={touched.email ? errors.email : undefined}
                          error={touched.email ? errors.email : undefined}
                          touched={touched.email}
                          sx={BoxStyling}
                          InputProps={{
                            sx: {
                              borderRadius: "10px",
                              fontFamily: "Inter !important",
                            },
                          }}
                          onChange={handleChange("email")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Box>
                          <Typography
                            variant="h6"
                            className="all_Lable_In_Components"
                            sx={{
                              color: `${pageStyles?.TextColor} !important`,
                            }}
                          >
                            Password
                          </Typography>
                          <FormControl fullWidth>
                            <TextField
                              type={show ? "text" : "password"}
                              name="password"
                              sx={BoxStyling}
                              helperText={
                                touched.password ? errors.password : undefined
                              }
                              error={
                                touched.password ? errors.password : undefined
                              }
                              touched={touched.password}
                              value={values.password}
                              onChange={handleChange("password")}
                              InputProps={{
                                sx: {
                                  borderRadius: "10px",
                                  fontFamily: "Inter !important",
                                },

                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} sx={{ pb: 3 }}>
                        <Button
                          variant="contained"
                          type="submit"
                          className="Long_Buttons_Forms"
                          sx={{
                            backgroundColor: `${pageStyles?.ButtonColor} !important`,
                          }}
                        >
                          Login
                        </Button>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Typography
                        variant="outlined"
                        sx={{
                          mr: 1,
                          color: `${pageStyles?.TextColor} !important`,
                        }}
                      >
                        New to Meal Planner?{" "}
                      </Typography>
                      <Typography
                        onClick={() => {
                          nav("/signup");
                        }}
                        sx={{
                          cursor: "pointer",
                          color: "#0ea5e9",
                     
                        }}
                      >
                        {" "}
                        Create Account
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <Typography
                        variant="outlined"
                        sx={{
                          mr: 1,
                          color: `${pageStyles?.TextColor} !important`,
                        }}
                      >
                        Login As
                      </Typography>
                      <Typography
                        onClick={() => {
                          nav("/home");
                        }}
                        sx={{ cursor: "pointer", color: "#0ea5e9" }}
                      >
                        Guest
                      </Typography>

    
                    </Box>
                      <div style={{display:'flex',justifyContent:'space-around'}}>
                      <div>
                        <h2>User</h2>
                        <h4>test2@gmail.com</h4>
                        <h4>Test@123</h4>
                      </div>
                      <div>
                        <h2>Admin</h2>
                        <h4>narayan.chowdhary@hiteshi.com</h4>
                        <h4>Narayan@123</h4>
                      </div>
                      </div>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
          <Notification
            text="Invalid credentials"
            status="error"
            isActive={error}
            setActive={setError}
          />


        </Box>
      </Box>
    </>
  );
}
