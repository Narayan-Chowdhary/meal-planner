import "./ActionOnUser.css";
import { useState, useEffect } from "react";

//config
import { base_url, getUserAPIEndpoint, cloudinaryUploadImage_url, firebaseDatabaseURL } from "../../config";

import { Box, Button, Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import AlertComponent from "../ui/Alert/Alert";
import FormDialog from "../common/FormDialog";
import ImageUploadField from "../common/ImageUploadField";

const FORM_ID = "admin-user-form";

export default function AddUserData(props) {
  const { t } = useTranslation();

  const openAdd = props.open;
  const setOpenAdd = props.setOpen;
  const updations = props.updations;
  const getData = props.sendData;
  const userDataApi = props.userDataApi;

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const AddUserSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(20, "Too Long!").required("Name is required"),

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
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol")
      .required("Password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);
  const [newImage, setNewImage] = useState();
  const [previewImage, setPreviewImage] = useState(null); // edit-mode preview only
  const [openCircle, setCircleOpen] = useState(false);

  const handleClickShowPassword = () => setShowPassword((s) => !s);

  const handleClose = () => {
    setOpenAdd(false);
    setPreviewImage(null);
    setNewImage(undefined); // don't carry the last upload into the next user
  };

  const getUser = () => {
    fetch(`${base_url}${getUserAPIEndpoint}`)
      .then((res) => res.json())
      .then((udata) => {
        setUserData(udata);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mealPlanner");
    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json();
    return getImage.url;
  };

  // Add mode: upload and keep the URL for the POST payload.
  const ImageUpload = async (file) => {
    try {
      const FinalImageKey = await uploadToCloudinary(file);
      setNewImage(FinalImageKey);
    } finally {
      setCircleOpen(false);
    }
  };

  // Edit mode: upload and PATCH the user's ProfileImage straight away.
  const dataChanged = async (file) => {
    try {
      const FinalImageKey = await uploadToCloudinary(file);
      await fetch(`${base_url}${getUserAPIEndpoint}${getData.id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ ProfileImage: FinalImageKey }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      setPreviewImage(FinalImageKey);
    } finally {
      setCircleOpen(false);
    }
  };

  const submitData = async (values) => {
    if (updations == false) {
      const exists = userData.some((user) => user.email === values.email);
      if (exists) {
        setShowAlert(true);
      } else {
        const postData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          ProfileImage: newImage,
          role: "user",
        };

        const fireBase = {
          name: values.name,
          email: values.email,
          role: "user",
          is_read: false,
          ProfileImage: newImage,
        };

        await fetch(`${firebaseDatabaseURL}mealplanner.json`, {
          method: "POST",
          body: JSON.stringify(fireBase),
          headers: {
            "Content-Type": "application/json ; charset=utf-8",
          },
        });

        await fetch(`${base_url}${getUserAPIEndpoint}`, {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json ; charset=utf-8",
          },
        });

        handleClose();
        userDataApi();
      }
    }

    if (updations == true) {
      await fetch(`${base_url}${getUserAPIEndpoint}${getData?.id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      setShowAlert1(true);
      handleClose();
      setPreviewImage(null);
      userDataApi();
    }
  };

  const fieldProps = (name, touched, errors) => ({
    name,
    error: Boolean(touched[name] && errors[name]),
    helperText: touched[name] ? errors[name] : undefined,
  });

  return (
    <Box>
      <FormDialog
        open={openAdd}
        onClose={handleClose}
        title={updations ? t("edit_user", "Edit user") : t("add_user", "Add user")}
        subtitle={updations ? "Update this member's details." : "Create a new member account."}
        icon={updations ? <ManageAccountsRoundedIcon /> : <PersonAddAlt1RoundedIcon />}
        actions={
          <>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" form={FORM_ID} disabled={openCircle}>
              {updations ? "Save changes" : t("add_user", "Add user")}
            </Button>
          </>
        }
      >
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
          validationSchema={AddUserSchema}
          validateOnChange={true}
          validateOnBlur={false}
          onSubmit={(values) => {
            submitData(values);
          }}
        >
          {({ errors, values, handleChange, touched }) => (
            <Form id={FORM_ID} noValidate>
              <Box sx={{ mb: 3 }}>
                <ImageUploadField
                  variant="avatar"
                  label="Profile photo"
                  value={updations ? previewImage ?? getData?.ProfileImage : newImage}
                  uploading={openCircle}
                  onFileSelect={(file) => {
                    setCircleOpen(true);
                    if (updations) dataChanged(file);
                    else ImageUpload(file);
                  }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("Name")}
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange("name")}
                    {...fieldProps("name", touched, errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("Email")}
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange("email")}
                    {...fieldProps("email", touched, errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("Contact", "Contact")}
                    type="number"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={handleChange("phone")}
                    {...fieldProps("phone", touched, errors)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("Password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange("password")}
                    {...fieldProps("password", touched, errors)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={handleClickShowPassword}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </FormDialog>

      <AlertComponent
        text={showAlert ? "User Already exist" : showAlert1 ? "Details Updated" : "User Added"}
        option2="Ok"
        show={showAlert}
        setShow={setShowAlert}
      />
    </Box>
  );
}
