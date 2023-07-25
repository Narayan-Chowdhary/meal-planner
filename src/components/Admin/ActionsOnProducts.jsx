import "./ActionOnProducts.css";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
//config
import {
  base_url,
  getUserAPIEndpoint,getProductAPIEndpoint,
  cloudinaryUploadImage_url,
} from "../../config";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  TextField,
  IconButton,
  Input,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation, initReactI18next } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";

import moment from "moment";
import AlertComponent from "../ui/Alert/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { v4 as uuidv4 } from "uuid";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import vegIcon from "../../assests/veg-icon.png";
import NonvegIcon from "../../assests/non-veg-icon.png";
import VeganIcon from "../../assests/green-leaf-icon.png";





export default function ActionsOnProducts(props) {
  const { t } = useTranslation();

  const lableStyling = {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "30px",
    fontFamily: "Inter",
    paddingLeft: "10px",
    color: "black",
  };

  
  const openAdd = props.open;
  const setOpenAdd = props.setOpen;
  const updations = props.updations;
  const setUpdation = props.setUpdation;
  const getProducts = props.sendData;
  const productDataApi = props.productDataApi;
  const nav = useNavigate();



  // const total_quantityRegExp =
  //   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const ActionsOnProducts = Yup.object().shape({
    title: Yup.string()
      .min(3, "Too Short!")
      .max(20, "Too Long!")
      .required("title is required"),

    description: Yup.string()
      .min(5, "Too Short!")
      .max(100, "Too Long!")
      .required("description is required"),

    total_quantity: Yup.string()
      // .matches(totalquantityRegExp, "Invalid Price number")
      .max(10000, "max lenght should be 5 digit")
      .min(1, "min lenght should be 1 digit")
      .required("Quantity is required"),

    price: Yup.string()
      .max(8, "price must be 8 characters at maximum")
      .matches(/[0-9]/, "price requires a number")
      .required("price is required"),



  });

  const [show, setShow] = useState(false);
  const [showprice, setShowprice] = useState(false);
  const [openExists, setOpenExists] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);

  const [newImage, setNewImage] = useState('');
  const [openCircle, setCircleOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());









  const handleCloseCircle = () => {
    setCircleOpen(false);
  };
  const handleOpen = () => {
    setCircleOpen(true);
  };
  // const handleClickShowprice = () => {
  //   setShow((show) => !show);
  //   setShowprice(!showprice);
  // };
  // const handleExistsClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setOpenExists(false);
  // };

  const handleClose = () => {
    setOpenAdd(false);
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  // let img;

  const getAllProducts = () => {
    fetch(`${base_url}${getProductAPIEndpoint}`)
      .then((res) => res.json())
      .then((udata) => {
        setProductsData(udata);
      });
  };

  const ImageUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "mealPlanner");

    const responseImg = await fetch(
      `${cloudinaryUploadImage_url}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const getImage = await responseImg.json();
    let FinalImageKey = getImage.url;
    console.log("sdf", FinalImageKey)
    setNewImage(FinalImageKey);
    setCircleOpen(false);
    getAllProducts();
  
  };

  let id = uuidv4();

  let a = 0;
  const submitData = async (values) => {
    if (updations == false) {

      const newProducsAdding = {
        title: values.title,
        id,
        description: values.description,
        total_quantity: values.total_quantity,
        price: values.price,
        image: newImage,
        currency: values.currency,
        created_date: moment().toDate().getTime(),
        expiry_date: expiryDate,
        category: values.category,
      };
     
  const fireBase = {
    title: values.title,
    id,
    description: values.description,
    total_quantity: values.total_quantity,
    price: values.price,
    image: newImage,
    currency: values.currency,
    created_date: moment().toDate().getTime(),
    expiry_date: expiryDate,
    category: values.category,
  };
/// post data on firebase
  await fetch(
    "https://meal-planner-390411-default-rtdb.firebaseio.com/products.json",
    {
      method: "POST",
      body: JSON.stringify(fireBase),
      headers: {
        "Content-Type": "application/json ; charset=utf-8",
      },
    }
  );

// post data on json server
      await fetch(`${base_url}${getProductAPIEndpoint}`, {
        method: "POST",
        body: JSON.stringify(newProducsAdding),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });
      setOpenAdd(false);
      productDataApi();
    
    }
    if (updations == true) {
      await fetch(`${base_url}${getProductAPIEndpoint}${getProducts?.id}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });


      setShowAlert1(true);
      setOpenAdd(false);
      productDataApi();
      
    }
  };

  const dataChanged = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "mealPlanner");
    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "POST",
      body: formData,
    });
    const getImage = await responseImg.json();
    let FinalImageKey = getImage.url;
    
    await fetch(`${base_url}${getProductAPIEndpoint}${getProducts.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ image: FinalImageKey }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    setCircleOpen(false);
    getAllProducts();
  };

  return (
    <Box>
      <Dialog onClose={handleClose} open={openAdd} fullWidth>
        <Box sx={{ color: "white", p: 1 }}>
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <CloseIcon
                onClick={handleClose}
                sx={{ color: "black", cursor: "pointer" }}
              />
            </Box>
            <Typography variant="h3" color="black" align="center">
              {updations ? "Update Details" : `${t("Add New Product")}`}
            </Typography>
            <Box class="updatedPageCss">
              <Formik
                initialValues={
                  updations
                    ? {
                        title: getProducts.title,
                        total_quantity: getProducts.total_quantity,
                        description: getProducts.description,
                        currency: getProducts.currency,
                        price: getProducts.price,
                        created: getProducts.created_date,
                        expiry: getProducts.expiry_date,
                        category: getProducts.category,
                        image: getProducts.image,
                      }
                    : {
                        title: "",
                        id: "",
                        total_quantity: "",
                        description: "",
                        currency: "INR",
                        price: "",
                        created: moment().format("DD/MM/YYYY"),
                        category: "Veg",
                      }
                }
                validationSchema={ActionsOnProducts}
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
                        {t("title")}
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="text"
                        title="title"
                        value={values.title}
                        placeholder="Product Title"
                        onChange={handleChange("title")}
                        helperText={touched.title ? errors.title : undefined}
                        error={touched.title ? errors.title : undefined}
                        touched={touched.title}
                      />
                    </Box>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("description")}
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="description"
                        title="description"
                        placeholder="description"
                        value={values.description}
                        onChange={handleChange("description")}
                        helperText={
                          touched.description ? errors.description : undefined
                        }
                        error={
                          touched.description ? errors.description : undefined
                        }
                        touched={touched.description}
                      />
                    </Box>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("total_quantity")}
                      </Typography>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="number"
                        title="total_quantity"
                        placeholder="Total Quantity"
                        value={values.total_quantity}
                        onChange={handleChange("total_quantity")}
                        helperText={
                          touched.total_quantity
                            ? errors.total_quantity
                            : undefined
                        }
                        error={
                          touched.total_quantity
                            ? errors.total_quantity
                            : undefined
                        }
                        touched={touched.total_quantity}
                      />
                    </Box>
                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("price")}
                      </Typography>

                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="number"
                        title="price"
                        placeholder="Product price"
                        value={values.price}
                        onChange={handleChange("price")}
                        helperText={touched.price ? errors.price : undefined}
                        error={touched.price ? errors.price : undefined}
                        touched={touched.price}
                      />
                    </Box>

                    <Box>
                      <Typography className="all_Lable_In_Components">
                        {t("expiry")}
                      </Typography>

                      <TextField
                        fullWidth
                        id="date"
                        type="date"
                        onChange={(date) => setExpiryDate(date.target.value)}
                        defaultValue={expiryDate}
                        value={values.date}
                        helperText={touched.date ? errors.date : undefined}
                        error={touched.date ? errors.date : undefined}
                        touched={touched.date}
                      />
                      {/*
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "8px",
                        }}
                        type="text"
                        title="expiry"
                        value={values.expiry}
                        onChange={handleChange("expiry")}
                        placeholder="Product expiry date"
                        helperText={touched.expiry ? errors.expiry : undefined}
                        error={touched.expiry ? errors.expiry : undefined}
                        touched={touched.expiry}
                      /> */}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography className="all_Lable_In_Components">
                        {t("Currency")}
                      </Typography>
                      <FormControl sx={{ minWidth: "100%" }}>
                        <Select
                          placeholder="currency"
                          value={values.currency}
                          error={errors.currency}
                          onChange={handleChange("currency")}
                          inputProps={{
                            sx: {
                              ml: 1,
                              height: "12px",
                            },
                          }}
                        >
                          <MenuItem
                            value="INR"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "24px",
                              }}
                            >
                              {t("INR")}
                            </Box>
                          </MenuItem>
                          <MenuItem
                            value="DOLLAR"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "24px",
                              }}
                            >
                              {t("DOLLAR")}
                            </Box>
                          </MenuItem>
                        </Select>

                        <FormHelperText>{errors.currency}</FormHelperText>
                      </FormControl>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography className="all_Lable_In_Components">
                        {t("Category")}
                      </Typography>
                      <FormControl sx={{ minWidth: "100%" }}>
                        <Select
                          value={values.category}
                          error={errors.category}
                          onChange={handleChange("category")}
                          inputProps={{
                            sx: {
                              ml: 1,
                              height: "12px",
                            },
                          }}
                        >
                          <MenuItem
                            value="Veg"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "24px",
                              }}
                            >
                              {t("veg")}

                              <Typography sx={{ mt: 1 }}>
                                <img src={vegIcon} alt="" height="30px" />
                              </Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem
                            value="Nonveg"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "24px",
                              }}
                            >
                              {t("non_veg")}

                              <Typography sx={{ mt: 1 }}>
                                {" "}
                                <img
                                  src={NonvegIcon}
                                  alt=""
                                  height="30px"
                                  weight="30"
                                />
                              </Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem
                            value="Vegan"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                height: "24px",
                              }}
                            >
                              {t("vegan")}
                              <Typography sx={{ mt: 1 }}>
                                {" "}
                                <img
                                  src={VeganIcon}
                                  alt=""
                                  height="30px"
                                  weight="30"
                                />
                              </Typography>
                            </Box>
                          </MenuItem>
                        </Select>

                        <FormHelperText>{errors.category}</FormHelperText>
                      </FormControl>
                    </Box>
                    {/* <Box>
                      <input
                        type="file"
                        onChange={(e) => {
                          {
                            updations ? dataChanged(e) : ImageUpload(e);
                          }
                          handleOpen();
                        }}
                      />
                    </Box> */}
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
                      {console.log("image", getProducts?.image)}
                      <Avatar
                        alt="T"
                        src={getProducts?.image ? getProducts?.image : ""}
                        sx={{ height: 100, width: 100 }}
                      />

                      <label htmlFor="upload-photo">
                        <input
                          style={{ display: "none", position: "relative" }}
                          id="upload-photo"
                          title="upload-photo"
                          type="file"
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "65px",
                            left: "65px",
                            // backgroundColor: "white",
                            // borderRadius: "100px",
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
                        {updations
                          ? "Edit Details"
                          : `${t("Add Products")}`}{" "}
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
