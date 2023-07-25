import '../../components/MajorCSS/majorCss.css'
import React, { useState, useEffect } from 'react';
import {
  base_url,
  getUserAPIEndpoint,
  getLayoutAPIEndpoint,
} from "../../config";
import { Box, Typography, TextField, Button, Grid, Container } from '@mui/material'

import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility1 from '@mui/icons-material/Visibility';
import VisibilityOff1 from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton1 from '@mui/material/IconButton';
import InputAdornment1 from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Notification from '../Notification/Notification';
import { GoogleLogin } from '@react-oauth/google';



export default function SignUp() {
  const [pageStyles, setpageStyles] = useState(null);

    const BoxStyling = {
        display: 'flex',
        justifyContent: "center",

    }
  const fetchStyles = async () => {
    const response = await fetch(
      `${base_url}${getLayoutAPIEndpoint}?module=Signup`
    );
    let styles = await response.json();
    setpageStyles(styles[0]?.styles);
  };

  useEffect(() => {
    fetchStyles();
  }, []);


    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


    const SignUpSchema = Yup.object().shape({
        Name: Yup.string()
            .min(3, 'Too Short!')
            .max(20, 'Too Long!')
            .required('Name is required'),


        Email: Yup.string()
            .email("Invalid email address format")
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid Email Address")
            .required("Email is required"),

        Phone: Yup.string()
            .matches(phoneRegExp, "Invalid contact number")
            .required("Contact number is required")
            .min(10, "min lenght should be 10 digit")
            .max(10, "max lenght should be 10 digit"),

        Password: Yup.string()
            .min(8, "Password must be 8 characters at minimum")
            .max(20, "Password must be less than 20 characters")
            .matches(/[0-9]/, 'Password requires a number')
            .matches(/[a-z]/, 'Password requires a lowercase letter')
            .matches(/[A-Z]/, 'Password requires an uppercase letter')
            .matches(/[^\w]/, 'Password requires a symbol')
            .required("Password is required"),


        ConfirmPassword: Yup.string()
            .oneOf([Yup.ref('Password'), null], 'Must match "Password" field value')
            .required("Confirm Password is required")

    })



    const [showConfirm, setshowConfirm] = useState(false)
    const [show, setShow] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [openExists, setOpenExists] = useState(false);
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUser();

    }, [])
    const getUser = () => {
        fetch(`${base_url}${getUserAPIEndpoint}`)
          .then((res) => res.json())
          .then((udata) => {
            setUserData(udata);
          });

    }

    const handleClickShowPassword = () => {

        setShow((show) => !show);
        setShowPassword(!showPassword)

    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowPassword1 = () => {

        setshowConfirm((showConfirm) => !showConfirm);
        setShowPasswordConfirm(!showPasswordConfirm)

    };



    const handleExists = () => {
        setOpenExists(true);
    }


let id =uuidv4();


    const handleExistsClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenExists(false);
    }
    let a = 0
    const createUser = async (data) => {
        userData.find(user => {
            if (user.email === data.Email) {
               
                handleExists();
                a = 1;
            }
        })
        if (a == 0) {
            const postData = {
                name: data.Name.trim(),
                id,
                email: data.Email,
                phone: data.Phone,
                password: data.Password,
                role: "user"
            }

            const fireBase = {
                name: data.Name.trim(),
                id,
                email: data.Email,
                role: "user",
                is_read: false
            }





    


            await fetch("https://meal-planner-390411-default-rtdb.firebaseio.com/mealplanner.json", {
                method: 'POST',
                body: JSON.stringify(fireBase),
                headers: {
                    "Content-Type": "application/json ; charset=utf-8"
                }
            })
          


            await fetch(`${base_url}${getUserAPIEndpoint}`, {
              method: "POST",
              body: JSON.stringify(postData),
              headers: {
                "Content-Type": "application/json ; charset=utf-8",
              },
            })
              .then((res) => res.json())
              .then((data) => console.log(data));

           

            navigate('/')

        }
        }


        const handleLogIn = () => {
            navigate('/')
        }


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
                    Name: "",
                    Email: "",
                    Phone: "",
                    Password: "",
                    ConfirmPassword: "",
                  }}
                  validationSchema={SignUpSchema}
                  validateOnChange={true}
                  onSubmit={(values) => {
                    console.log(values);
                    console.log(
                      "Values " + values.Email + " and " + values.Password
                    );
                    createUser(values);
                  }}
                >
                  {({ errors, values, handleChange, handleBlur, touched }) => (
                    <Form>
                      <Box>
                        <Box className="secound_Container_Form">
                          <Box>
                            <Typography
                              variant="h3"
                              className="Heading_Text_all"
                              sx={{
                                color: `${pageStyles?.TextColor} !important`,
                              }}
                            >
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
                              Welcome
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
                                Name
                              </Typography>

                              <TextField
                                sx={BoxStyling}
                                InputProps={{
                                  sx: {
                                    borderRadius: "10px",
                                    fontFamily: "Inter !important",
                                  },
                                }}
                                type="text"
                                name="Name"
                                value={values.Name}
                                onChange={handleChange("Name")}
                                helperText={
                                  touched.Name ? errors.Name : undefined
                                }
                                error={errors.Name && touched.Name}
                                // error={touched.Name ? errors.Name : undefined}
                                touched={touched.Name}
                              />
                            </Grid>
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
                                sx={BoxStyling}
                                InputProps={{
                                  sx: {
                                    borderRadius: "10px",
                                    fontFamily: "Inter !important",
                                  },
                                }}
                                type="text"
                                name="email"
                                value={values.Email}
                                onChange={handleChange("Email")}
                                helperText={
                                  touched.Email ? errors.Email : undefined
                                }
                                error={touched.Email ? errors.Email : undefined}
                                touched={touched.Email}
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
                                  Contact
                                </Typography>
                                <TextField
                                  sx={BoxStyling}
                                  InputProps={{
                                    sx: {
                                      borderRadius: "10px",
                                      fontFamily: "Inter !important",
                                    },
                                  }}
                                  type="text"
                                  name="phone"
                                  value={values.Phone}
                                  onChange={handleChange("Phone")}
                                  helperText={
                                    touched.Phone ? errors.Phone : undefined
                                  }
                                  error={
                                    touched.Phone ? errors.Phone : undefined
                                  }
                                  touched={touched.Phone}
                                />
                              </Box>
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
                                    sx={BoxStyling}
                                    type={show ? "text" : "Password"}
                                    name="Password"
                                    value={values.Password}
                                    onChange={handleChange("Password")}
                                    helperText={
                                      touched.Password
                                        ? errors.Password
                                        : undefined
                                    }
                                    error={
                                      touched.Password
                                        ? errors.Password
                                        : undefined
                                    }
                                    touched={touched.Password}
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
                                            onMouseDown={
                                              handleMouseDownPassword
                                            }
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
                            <Grid item xs={12} sm={12} md={12}>
                              <Box>
                                <Typography
                                  variant="h6"
                                  className="all_Lable_In_Components"
                                  sx={{
                                    color: `${pageStyles?.TextColor} !important`,
                                  }}
                                >
                                  Confirm Password
                                </Typography>
                                <TextField
                                  sx={BoxStyling}
                                  type={showConfirm ? "text" : "Password"}
                                  name="ConfirmPassword"
                                  value={values.ConfirmPassword}
                                  onChange={handleChange("ConfirmPassword")}
                                  // onBlur={handleBlur}
                                  helperText={
                                    touched.ConfirmPassword
                                      ? errors.ConfirmPassword
                                      : undefined
                                  }
                                  error={
                                    touched.ConfirmPassword
                                      ? errors.ConfirmPassword
                                      : undefined
                                  }
                                  touched={touched.ConfirmPassword}
                                  InputProps={{
                                    sx: {
                                      borderRadius: "10px",
                                      fontFamily: "Inter !important",
                                    },
                                    endAdornment: (
                                      <InputAdornment1 position="end">
                                        <IconButton1
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword1}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                        >
                                          {showPasswordConfirm ? (
                                            <Visibility1 />
                                          ) : (
                                            <VisibilityOff1 />
                                          )}
                                        </IconButton1>
                                      </InputAdornment1>
                                    ),
                                  }}
                                />
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
                                style={{
                                  textTransform: "none",
                                  borderRadius: "10px",
                                }}
                              >
                                SignUp
                              </Button>
                            </Grid>
                          </Grid>
                          <Snackbar
                            open={openExists}
                            autoHideDuration={2000}
                            onClose={handleExistsClose}
                          >
                            <Alert
                              onClose={handleExistsClose}
                              severity="error"
                              sx={{ width: "100%" }}
                            >
                              Email already exists
                            </Alert>
                          </Snackbar>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: `${pageStyles?.TextColor} !important`,
                                mr: 1,
                              }}
                            >
                              Already have an account ?
                            </Typography>
                            <Typography
                              onClick={handleLogIn}
                              sx={{
                                cursor: "pointer",
                                color: `${pageStyles?.TextColor} !important`,
                              }}
                            >
                              Login
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
          </>
        );
    }








