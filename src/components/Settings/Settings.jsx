import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Box, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
    base_url, cloudinaryUploadImage_url, getUserAPIEndpoint
} from "../../config";
import "./Settings.css";
// import AvatarChange from 'react-avatar-edit'
import UploadIcon from "@mui/icons-material/Upload";

import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import image from "../../assests/meal.jpg";
import AlertComponent from "../ui/Alert/Alert";
import BmiCalculator from "../ui/BMI/BmiCalculator";

function Settings() {
  const nav = useNavigate()
  const { t } = useTranslation();
  const languages = [
    {
      code: "es",
      name: "हिंदी",
      country_code: "es",
    },
    {
      code: "en",
      name: "English",
      country_code: "gb",
    },
  ];

  const UpdatationCSS = {
    display: "flex",
    alignItems: "center",
  };

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

  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [items, setItems] = useState([]);
  const [openBmi, setBmi] = useState(false);
  const [showAlert, setShowshowAlert] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const dataFromLogin = JSON.parse(localStorage.getItem("items"));
  useEffect(() => {
    geData();
  }, []);

  const geData = async () => {
    // if (dataFromLogin) {
    //     console.log("ASdfasdf", dataFromLogin);
    //     setItems(dataFromLogin);
    // }
  };

  const dataChanged = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "mealPlanner");
    console.log("Image set to cloudinary", e.target.files[0]);
    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json();
    let FinalImageKey = getImage.url;

    console.log("Image in state", FinalImageKey);

    await fetch(`${base_url}${getUserAPIEndpoint}${dataFromLogin.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ ProfileImage: FinalImageKey }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    console.log("Image updated", FinalImageKey);

    dataChange();
  };

  const dataChange = async () => {
    localStorage.clear();
    console.log("state cleared", items);

    let dataOfLogin = await fetch(
      `${base_url}${getUserAPIEndpoint}${dataFromLogin.id}`
    );
    let resOfLogin = await dataOfLogin.json();
    console.log("data of login", resOfLogin);
    localStorage.setItem("items", JSON.stringify(resOfLogin));
    setItems(resOfLogin);
    console.log("state Updated:", items);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  const handleEditBmi = () => {
    if (items.bmi) {
      const confirmBox = window.confirm(
        "Already Calculated Do you want again calculate"
      );
      if (confirmBox === true) {
        setBmi(true);
      }
    } else {
      setBmi(true);
    }
  };

  const handleClickShowPassword = () => {
    setShow((show) => !show);
    setShowPassword(!showPassword);
  };

  const submitData = async (values) => {
    console.log("data", values);
    await fetch(`http://localhost:8000/users/${dataFromLogin.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log("data", values);
    setShowshowAlert(true);
  };
  const handleChange = (event) => {
    const val = event.target.value;
    // console.log(val)
    // localStorage.setItem("language",JSON.stringify(val))
    i18next.changeLanguage(val);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${image})`,

        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#e9e9e9",
            height: "80vh",
            width: 800,
            px: 10,
            mt: 5,
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Box sx={{ mt: 2 }}>
              <Typography>{t("change_language")}</Typography>
            </Box>
            <Box sx={{ ml: 1 }}>
              <FormControl>
                <Select
                  value={
                    localStorage.getItem("i18nextLng") || languages[0]?.code
                  }
                  onChange={handleChange}
                >
                  {languages.map((e, i) => {
                    return (
                      <MenuItem key={i} value={e.code}>
                        {e.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "end", cursor: "pointer" }}
          >
            <Typography onClick={() => nav("/fitenssreport")}>
              Generate fitness report{" "}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box position="relative">
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
                onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>

              <Avatar
                alt="T"
                src={
                  dataFromLogin?.ProfileImage ? dataFromLogin?.ProfileImage : ""
                }
                sx={{ height: 150, width: 150 }}
              />

              <label htmlFor="upload-photo">
                <input
                  style={{ display: "none" }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                />

                <Box>
                  {/* <EditIcon sx={{ height: 50 }} onClick={openDialogBox} /> */}

                  <Button
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: "47px",
                      right: "24px",
                      backgroundColor: "#fff",
                      borderRadius: "50px",
                      minWidth: "35px",
                    }}
                  >
                    <EditIcon fontSize="medium" />
                    <input
                      hidden
                      type="file"
                      onChange={(e) => {
                        // setFile(URL.createObjectURL(e.target.files[0]))
                        dataChanged(e);
                        handleOpen();
                      }}
                    />
                  </Button>
                </Box>
                <br />
                <br />
              </label>
            </Box>
          </Box>
          <Box>
            {console.log("ite", items)}
            <Box>
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
                {({ errors, values, handleChange, handleBlur, touched }) => (
                  <Form>
                    <Grid container paddingBottom="10px">
                      <Grid
                        item
                        md={2}
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <Typography>{t("Name")}</Typography>
                      </Grid>
                      <Grid item md={10}>
                        <Box sx={UpdatationCSS}>
                          <TextField
                            fullWidth
                            sx={{
                              borderRadius: "8px",
                            }}
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange("name")}
                            helperText={touched.name ? errors.name : undefined}
                            error={touched.name ? errors.name : undefined}
                            touched={touched.name}
                          />
                          {/* <UploadIcon onClick={() => { submitData(values.name, "name") }} /> */}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container paddingBottom="10px">
                      <Grid
                        item
                        md={2}
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <Typography>{t("Email")}:</Typography>
                      </Grid>
                      <Grid item md={10}>
                        <Box sx={UpdatationCSS}>
                          <TextField
                            fullWidth
                            sx={{
                              borderRadius: "8px",
                            }}
                            type="email"
                            name="email"
                            value={dataFromLogin?.email}
                            helperText={
                              touched.email ? errors.email : undefined
                            }
                            error={touched.email ? errors.email : undefined}
                            touched={touched.email}
                          />
                          {/* <UploadIcon onClick={() => { submitData(values.email, "email") }} sx={{ visibility: "hidden" }} /> */}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container paddingBottom="10px">
                      <Grid
                        item
                        md={2}
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <Typography>{t("Password")}:</Typography>
                      </Grid>
                      <Grid item md={10}>
                        <Box sx={UpdatationCSS}>
                          <TextField
                            fullWidth
                            sx={{
                              borderRadius: "8px",
                            }}
                            type={show ? "text" : "Password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange("password")}
                            helperText={
                              touched.password ? errors.password : undefined
                            }
                            error={
                              touched.password ? errors.password : undefined
                            }
                            touched={touched.password}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
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
                          <Box>
                            {/* <UploadIcon onClick={() => { submitData(values.Password, "password") }} /> */}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container paddingBottom="10px">
                      <Grid
                        item
                        md={2}
                        display="flex"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <Typography>{t("contact_details")}:</Typography>
                      </Grid>
                      <Grid item md={10}>
                        <Box sx={UpdatationCSS}>
                          <TextField
                            fullWidth
                            sx={{
                              borderRadius: "8px",
                            }}
                            type="number"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange("phone")}
                            helperText={
                              touched.phone ? errors.phone : undefined
                            }
                            error={touched.phone ? errors.phone : undefined}
                            touched={touched.phone}
                          />
                          {/* <UploadIcon onClick={() => { submitData(values.phone, "phone") }} /> */}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item md={2} sx={{ mt: 2 }}>
                        <Typography>{t("BMI")}:</Typography>
                      </Grid>
                      <Grid item md={10}>
                        {console.log("bmi:", dataFromLogin?.bmi)}
                        {/* {openBmi ?
                                                <Box sx={UpdatationCSS}>
                                                    {} 
                                                    <UploadIcon onClick={() => { submitData(values.bmi, "phone") }} />
                                            </Box>  */}

                        {openBmi ? (
                          <Box sx={UpdatationCSS}>
                            <TextField
                              fullWidth
                              sx={{
                                borderRadius: "8px",
                              }}
                              type="text"
                              name="bmi"
                              value={dataFromLogin.bmi}
                            />
                            {/* <UploadIcon onClick={() => { submitData(values.bmi, "bmi") }} /> */}
                          </Box>
                        ) : (
                          <Box sx={{ alignItems: "center" }}>
                            <Box sx={UpdatationCSS}>
                              <TextField
                                fullWidth
                                sx={{
                                  borderRadius: "8px",
                                }}
                                placeholder={dataFromLogin.bmi}
                                type="text"
                                name="bmi"
                                value={dataFromLogin.bmi}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <UploadIcon
                                        sx={{ cursor: "pointer" }}
                                        onClick={handleEditBmi}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                    <Box
                      sx={{ pt: 3, display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        sx={{ width: "150px" }}
                        variant="contained"
                        type="Submit"
                        className="all_Buttons_in_Page"
                      >
                        {t("Submit")}:
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        </Box>
        <BmiCalculator sendBmi={openBmi} sendBmi1={setBmi} />
      </Container>
      <AlertComponent
        text="Data Update"
        option2="Ok"
        show={showAlert}
        setShow={setShowshowAlert}
      />
    </Box>
  );
}
export default Settings;
