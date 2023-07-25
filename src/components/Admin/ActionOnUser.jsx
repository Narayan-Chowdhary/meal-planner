import './ActionOnUser.css'
import React, { useState, useEffect } from 'react'

//config
import {
  base_url,
  getUserAPIEndpoint,
  cloudinaryUploadImage_url,
} from "../../config";

import { Box, Typography, Button, Grid, Container, TextField, IconButton, Input } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation, initReactI18next } from "react-i18next";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AlertComponent from '../ui/Alert/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { InputAdornment } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '@mui/material/Avatar';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



export default function AddUserData(props) {

  const { t } = useTranslation()

  const lableStyling = {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "30px",
    fontFamily: "Inter",
    paddingLeft: "10px",
    color: "black",
  }



  const openAdd = props.open
  const setOpenAdd = props.setOpen
  const updations = props.updations
  const setUpdation = props.setUpdation
  const getData = props.sendData
  const userDataApi = props.userDataApi
  const nav = useNavigate()


  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


  const AddUserData = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Name is required'),

    email: Yup.string()
      .email("Invalid email address format")
      .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid Email Address")
      .required("Email is required"),


    phone: Yup.string()
      .matches(phoneRegExp, "Invalid contact number")
      .max(10, "max lenght should be 10 digit")
      .min(10, "min lenght should be 10 digit")
      .required("Contact number is required"),

    password: Yup.string()
      .min(8, "Password must be 8 characters at minimum")
      .max(20, "Password must be less than 20 characters")
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol')
      .required("Password is required"),


  })



  const [show, setShow] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [openExists, setOpenExists] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showAlert, setShowAlert] = useState(false)
  const [showAlert1, setShowAlert1] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = useState([]);
  const [newImage, setNewImage] = useState()
  const [openCircle, setCircleOpen] = React.useState(false);
 
  const handleCloseCircle = () => {
    setCircleOpen(false);
  };
  const handleOpen = () => {
    setCircleOpen(true);
  };
  const handleClickShowPassword = () => {

    setShow((show) => !show);
    setShowPassword(!showPassword)

  };
  const handleExistsClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenExists(false);
  }


  const handleClose = () => {
    setOpenAdd(false)
  }

  useEffect(() => {
    getUser();

  }, [])
  // let img;
  
  const getUser = () => {
    fetch(`${base_url}${getUserAPIEndpoint}`)
      .then((res) => res.json())
      .then((udata) => {
        setUserData(udata);
      });

  }

  const ImageUpload = async (e) => {
    const formData = new FormData()
    formData.append("file", e.target.files[0])
    formData.append("upload_preset", "mealPlanner")

    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json()
    let FinalImageKey = getImage.url
    setNewImage(FinalImageKey)
    setCircleOpen(false);
  }






  let a = 0;
  const submitData = async (values) => {

    if (updations == false) {


      userData.find(user => {
        if (user.email === values.email) {
          setShowAlert(true)
          a = 1;
        }
      })
      if (a == 0) {
        const postData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          ProfileImage: newImage,
          role: "user"
        }

        const fireBase = {
          name: values.name,
          email: values.email,
          role: "user",
          is_read: false,
          ProfileImage: newImage,
        };

        

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
        });

        setOpenAdd(false)
        userDataApi()

      }

    }

    if (updations == true) {

    
      await fetch(`${base_url}${getUserAPIEndpoint}${getData?.id}`,
        {
          method: 'PATCH',
          mode: 'cors',
          body: JSON.stringify(values),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
     )
    
      setShowAlert1(true)
      setOpenAdd(false)
      userDataApi()

    }
  }






  const dataChanged = async (e) => {
    const formData = new FormData()
    formData.append("file", e.target.files[0])
    formData.append("upload_preset", "mealPlanner")
    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json()
    let FinalImageKey = getImage.url


    await fetch(`${base_url}${getUserAPIEndpoint}${getData.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ ProfileImage: FinalImageKey }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    setCircleOpen(false);
  }


  return (
    <Box>
      <Dialog onClose={handleClose} open={openAdd} fullWidth>
        <Box sx={{ color: "white", p: 1 }}>
          <DialogTitle className="UserBackground">
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <CloseIcon
                onClick={handleClose}
                sx={{ color: "black", cursor: "pointer" }}
              />
            </Box>
            <Typography variant="h3" color="black" align="center">
              {updations ? "Update Details" : `${t("Add User")}`}
            </Typography>
            <Box class="updatedPageCss">
              <Formik
                initialValues={
                  updations
                    ? {
                        name: getData.name,
                        phone: getData.phone,
                        email: getData.email,
                        password: getData.password,
                      }
                    : {
                        name: "",
                        id: "",
                        phone: "",
                        email: "",
                        password: "",
                      }
                }
                validationSchema={AddUserData}
                validateOnChange={true}
                validateOnBlur={false}
                onSubmit={(values) => {
                  submitData(values);
                }}
              >
                {({ errors, values, handleChange, handleBlur, touched }) => (
                  <Form>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("Name")}
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="text"
                        name="name"
                        placeholder={` ${t("Name")}`}
                        value={values.name}
                        onChange={handleChange("name")}
                        helperText={touched.name ? errors.name : undefined}
                        error={touched.name ? errors.name : undefined}
                        touched={touched.name}
                      />
                    </Box>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("Email")}
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="email"
                        name="email"
                        placeholder={` ${t("Email")}`}
                        value={values.email}
                        onChange={handleChange("email")}
                        helperText={touched.email ? errors.email : undefined}
                        error={touched.email ? errors.email : undefined}
                        touched={touched.email}
                      />
                    </Box>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("Contact")}
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="number"
                        name="phone"
                        placeholder={` ${t("Contact")}`}
                        value={values.phone}
                        onChange={handleChange("phone")}
                        helperText={touched.phone ? errors.phone : undefined}
                        error={touched.phone ? errors.phone : undefined}
                        touched={touched.phone}
                      />
                    </Box>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("Password")}
                      </Typography>

                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type={show ? "text" : "Password"}
                        name="password"
                        placeholder={` ${t("Password")}`}
                        value={values.password}
                        onChange={handleChange("password")}
                        helperText={
                          touched.password ? errors.password : undefined
                        }
                        error={touched.password ? errors.password : undefined}
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
                    </Box>

                    <Box position="relative" sx={{ pt: 2 }}>
                      <Backdrop
                        sx={{
                          color: "#fff",
                          zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={openCircle}
                        onClick={handleCloseCircle}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop>

                      <Avatar
                        alt="T"
                        src={getData?.ProfileImage ? getData?.ProfileImage : ""}
                        sx={{ height: 100, width: 100 }}
                      />

                      <label htmlFor="upload-photo">
                        <input
                          style={{ display: "none", position: "relative" }}
                          id="upload-photo"
                          name="upload-photo"
                          type="file"
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "65px",
                            left: "65px",
                          }}
                        >
                          {/* <EditIcon sx={{ height: 50 }} onClick={openDialogBox} /> */}

                          <Button component="label">
                            <EditIcon
                              sx={{
                                border: "1px solid #1976d2",
                                borderRadius: "50%",
                              }}
                            />
                            <input
                              hidden
                              type="file"
                              onChange={(e) => {
                                // setFile(URL.createObjectURL(e.target.files[0]))
                                {
                                  updations ? dataChanged(e) : ImageUpload(e);
                                }
                                handleOpen();
                              }}
                            />
                          </Button>
                        </Box>
                        <br />
                        <br />
                      </label>
                    </Box>

                    <Box>
                      <Button
                        variant="contained"
                        type="Submit"
                        className="all_Buttons_in_Page"
                        fullWidth
                        sx={{
                          backgroundColor: "#4F46E5",
                          mt: 3,
                          height: "60px",
                          borderRadius: "8px",
                          textTransform: "capitalize",
                        }}
                      >
                        {" "}
                        {updations ? "Edit Details" : `${t("Add User")}`}{" "}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </DialogTitle>
        </Box>
      </Dialog>

      <AlertComponent
        text={
          showAlert
            ? "User Already exist"
            : showAlert1
            ? "Details Updated"
            : "User Added"
        }
        option2="Ok"
        show={showAlert}
        setShow={setShowAlert}
      />
    </Box>
  );
}

