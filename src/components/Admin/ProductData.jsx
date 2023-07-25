import React, { useState, useEffect } from "react";
//config
import {
  base_url,
  getLayoutAPIEndpoint,

  getProductAPIEndpoint,
} from "../../config";


//
import {
  Box,
  Typography,
  TextField,
  Container,
  Button,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  InputLabel,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DummyImage from "../../assests/dummyimage.webp";
import AddproductData from "./ActionsOnProducts";
import AlertComponent from "../ui/Alert/Alert";
import Notification from "../../pages/Notification/Notification";
import { useTranslation, initReactI18next } from "react-i18next";
import vegIcon from "../../assests/veg-icon.png";
import NonvegIcon from "../../assests/non-veg-icon.png";
import VeganIcon from "../../assests/green-leaf-icon.png";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

function ProductData() {
  const { t } = useTranslation();

  const nav = useNavigate();


  ////state managment
  const [productData, setProductsData] = useState();
  const [openAdd, setOpenAdd] = useState(false);
  const [updations, setUpdation] = useState();
  const [sendData, setSendData] = useState();
  const [id, setId] = useState(0);
  const [openalert, setOpenAlert] = useState(false);
  const [pageStyles, setpageStyles] = useState("");


  //useEffect
  useEffect(() => {
    productDataApi();
    fetchStyles()
  }, []);


  // function component 
    const fetchStyles = async () => {
      const response = await fetch(
        `${base_url}${getLayoutAPIEndpoint}?module=AllButtons`
      );
      let styles = await response.json();
      console.log("color button", styles);
      setpageStyles(styles[0]?.styles);
    };

  const productDataApi = async () => {
    let responseproductData = await fetch(
      `${base_url}${getProductAPIEndpoint}`
    );
    let responseproductDataJson = await responseproductData.json();
    responseproductDataJson.reverse();
    setProductsData(responseproductDataJson);
  };

  const handleAddProducts = () => {
    setOpenAdd(true);
    setUpdation(false);
  };
  const handleEditProduct = (row) => {
    setOpenAdd(true);
    setUpdation(true);
    setSendData(row);
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`${base_url}${getProductAPIEndpoint}${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    productDataApi();
  };

  const handleCategory = async (event) => {
    let responseproductData = await fetch(
      `${base_url}${getProductAPIEndpoint}`
    );
    let responseproductDataJson = await responseproductData.json();
    responseproductDataJson.reverse();
    let filteredCategories = responseproductDataJson?.filter(
      (category, index) => category.category == event.target.value
    );

    setProductsData(filteredCategories);
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#FFFFFF", py: 5, flex: "1" }}>
        <Container maxWidth="xxl">
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="contained"
              className="all_Buttons_in_Page"
              sx={{
                padding: "10px 20px",
                mb: 3,
                background: `${pageStyles?.bgColor} !important`,
              }}
              onClick={handleAddProducts}
            >
              {t("add_product")}
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#4b5563" }}>
                <TableRow>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("image")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("title")}

                      <FormControl sx={{ minWidth: "40%" }}>
                        <InputLabel id="demo-simple-select-label">
                          select
                        </InputLabel>
                        <Select
                          onChange={handleCategory}
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
                                width: "20%%",
                                height: "24px",
                              }}
                            >
                              {t("Veg")}
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
                              {t("NonVeg")}
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("description")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("total_quantity")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("price")}
                    </Typography>
                  </TableCell>

                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("created_date")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("expiry_date")}
                    </Typography>
                  </TableCell>

                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("Changes")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: "#e5e7eb",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row?.image ? <Avatar src={row?.image} /> : <Avatar />}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        {row.title}
                        <Avatar
                          src={row.category == "Veg" ? vegIcon : NonvegIcon}
                          sx={{
                            width: 25,
                            height: 25,
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                            backgroundOrigin: "border-box",
                          }}
                          max
                          // variant="square"
                        />
                        {/* <img
                          src={row.category == "Veg" ? vegIcon : NonvegIcon}
                          height="20px"
                        /> */}
                      </Box>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.description}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.total_quantity}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.currency == "INR" ? <CurrencyRupeeIcon /> : null}{" "}
                      {row.price}
                    </TableCell>
                    {/* <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.currency}
                    </TableCell> */}
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {moment(row.created_date).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {moment(row.expiry_date).format("DD-MM-YYYY")}
                    </TableCell>
                    {/* <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    ></TableCell> */}
                    <TableCell component="th" scope="row">
                      <DeleteIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setOpenAlert(true);
                          setId(row.id);
                        }}
                      />
                      <ModeEditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          handleEditProduct(row);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <AddproductData
          open={openAdd}
          setOpen={setOpenAdd}
          updations={updations}
          setUpdation={setUpdation}
          sendData={sendData}
          productDataApi={productDataApi}
        />
        <AlertComponent
          text="Are sure you want to delete?"
          option1="Yes"
          option2="No"
          show={openalert}
          setShow={setOpenAlert}
          handeldelete={handleDeleteProduct}
          dataid={id}
        />
        {/* <Notification
          isActive={isActive}
          setActive={setActive}
          text={snacktext}
        /> */}
      </Box>
    </>
  );
}

export default ProductData;
