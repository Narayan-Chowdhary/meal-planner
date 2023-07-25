import {
  base_url,
  getFoodAPIEndpoint,
  getMealAPIEndpoint,
  getIngredientAPIEndpoint,
} from "../../../config";
import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Button,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
/// icon
import CreateIcon from "@mui/icons-material/Create";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import TableRowsIcon from "@mui/icons-material/TableRows";
import dummyImage from "../../../assests/FoodBg.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import VeganIcon from "../../../assests/green-leaf-icon.png";
import NonvegIcon from "../../../assests/non-veg-icon.png";
import vegIcon from "../../../assests/veg-icon.png";

///components
import AlertComponent from "../Alert/Alert";
import Footer from "../../../pages/Footer/Footer";
import Header from "../Header/Header";
import "./RecipeSuggestionPage.css";
//Sevices
import { fetchRecipeData } from "../../../Services/APIEngine";

function RecipeSuggestionPage() {
  const NavigationToPage = useNavigate();
  const { t } = useTranslation();

  //States
  const [Food, setFood] = useState();
  const [foodShow, setFoodShow] = useState([]);
  const [Ingredient, setIngredient] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [chipColor, setChipColor] = useState(null);
  const [selectedFoodCategory, setselectedFoodCategory] = useState("all");
  const [calendarView, setCalendarView] = useState(true);
  const [id, setId] = useState(0);
  const [openalert, setOpenAlert] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [collectIdToDelete, setCollectIdToDelete] = useState([]);

  //Default Data
  const foodCategory = [
    { FIndex: 0, name: "all", key: "all" },
    { FIndex: 1, name: "veg", key: "Veg" },
    { FIndex: 2, name: "non_veg", key: "Nonveg" },
    { FIndex: 3, name: "vegan", key: "Vegan" },
  ];

  //Use Effect
  useEffect(() => {
    const getRole = JSON.parse(localStorage.getItem("items"));
    if (getRole) {
      setIsLogin(getRole.role == "user");
    }

    FetchfoodData();
  }, []);

  const FetchfoodData = async () => {
    let responseFood = await fetchRecipeData();
    responseFood.reverse();
    responseFood.map((e) => {
      e.keyword = e.keyword.map((ele) => {
        return (ele = ele.charAt(0).toUpperCase() + ele.substr(1));
      });
    });
    setFood(responseFood);
    setFoodShow(responseFood);
    let responseIngredient = await fetch(
      `${base_url}${getIngredientAPIEndpoint}`
    );
    let responseIngred = await responseIngredient.json();
    setIngredient(responseIngred);

    // setChipColor(!chipColor);
  };

  const handleDelete = async (item) => {
    await fetch(`${base_url}${getFoodAPIEndpoint}${item}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    setCollectIdToDelete([]);
    FetchfoodData();
  };

  //Fumction Body Start
  function sendFoodData(element) {
    NavigationToPage("/dishPage", { state: { element } });
  }

  const handleFilter = (fc) => {
    let foodShowVeg = Food?.filter((e) => {
      return e.mealCatogary == fc;
    });
    setFoodShow(foodShowVeg);
  };

  const handleAny = () => {
    setFoodShow(Food);
    setChipColor(null);
  };

  const handleCheckIngredient = (ele) => {
    setChipColor(ele.ingrid);
    let foodShowIngrid = Food?.filter((e, i) => {
      return e.keyword.includes(ele.ingrid);
    });
    setFoodShow(foodShowIngrid);
  };

  const handleCheckBox = (event, id) => {
    if (event.target.checked) {
      setCollectIdToDelete([...collectIdToDelete, id]);
    } else {
      setCollectIdToDelete(
        collectIdToDelete?.filter((element) => element !== id)
      );
    }
  };
console.log("sararay", collectIdToDelete);
  const handleCheckDeletion = () => {
    if (deleteAll) {
      setDeleteAll(!deleteAll);
      setOpenAlert(true);
    } else {
      setDeleteAll(!deleteAll);
    }
  };
  return (
    <>
      <Header longHeader />

      <Box className="home_BackGround_Color">
        <Container maxWidth="xl" sx={{ pb: 1 }} className="container_ClassBox">
          <Stack spacing={3}>
            <Box>
              <Grid container sx={{ color: "#4F46E5", fontFamily: "Inter" }}>
                <Grid item xs={6} sm={5} md={2}>
                  <Typography variant="h3" sx={{ marginTop: "20px" }}>
                    {" "}
                    {t("recipe")}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={7} md={10} sx={{ pt: 3 }}>
                  <Divider
                    sx={{
                      border: "2px solid #4F46E5",
                      borderRadius: " 5px",
                      marginTop: "20px",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: foodShow?.length !== 0 ? "flex" : "none",
                  justifyContent: "start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <Typography>{t("meal_category")}</Typography>
                {foodCategory?.map((fc, ic) => (
                  <Box key={ic}>
                    <Chip
                      className={
                        selectedFoodCategory === fc?.key ? "chipBackground" : ""
                      }
                   
                      key={fc?.FIndex}
                      label={t(fc?.name)}
                      onClick={() => {
                        setselectedFoodCategory(fc?.key);
                        if (fc?.key === "all") {
                          handleAny();
                        } else {
                          handleFilter(fc?.key);
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: foodShow?.length !== 0 ? "flex" : "none",
                  justifyContent: "start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <Typography>{t("meal_ingredients")}</Typography>{" "}
                <Box>
                  <Chip
                    className={!chipColor ? "chipBackground" : ""}
                    label={t?.("All")}
                    onClick={handleAny}
                  />
                </Box>
                {foodShow?.length != 0 &&
                  Ingredient?.map((ele, index) => {
                    return (
                      <Box key={index}>
                        <Chip
                          className={
                            ele.ingrid === chipColor ? "chipBackground" : ""
                          }
                          sx={{
                            color: ele.ingrid === chipColor ? "white" : "",
                          }}
                          label={t(ele.ingrid)}
                          onClick={() => {
                            handleCheckIngredient(ele);
                          }}
                        />
                      </Box>
                    );
                  })}
              </Box>

              <Grid container columnSpacing={{ xs: 5 }}>
                <Grid item xs={3} sm={9} md={9}>
                  <Button
                    variant="contained"
                    className="all_Buttons_in_Page"
                    onClick={() => {
                      NavigationToPage("/addrecipe/:id");
                    }}
                  >
                    {t("add_recipe")}
                  </Button>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                  <Box>
                    <Button
                      sx={{ mr: 2 }}
                      variant="contained"
                      className={
                        calendarView ? "all_Buttons_in_Page" : "btn-secondary"
                      }
                      onClick={() => setCalendarView(true)}
                    >
                      <CalendarViewMonthIcon />
                    </Button>
                    <Button
                      sx={{ mr: 2 }}
                      variant="contained"
                      className={
                        calendarView ? "btn-secondary" : "all_Buttons_in_Page"
                      }
                      onClick={() => setCalendarView(false)}
                    >
                      {" "}
                      <TableRowsIcon />
                    </Button>
                    <Button
                      // sx={{ mr: 2 }}
                      variant="contained"
                      className={
                        calendarView ? "btn-secondary" : "all_Buttons_in_Page"
                      }
                      onClick={handleCheckDeletion}
                    >
                      {deleteAll ? (
                        <DeleteIcon />
                      ) : (
                        <CheckBoxOutlineBlankIcon />
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  maxHeight: "100vh",
                  overflow: "auto",
                }}
              >
                <Grid container spacing={2} sx={{ alignItems: "center", p: 2 }}>
                  {foodShow.map((item, index) => {
                    return (
                      <>
                        <Grid item xs={12} sm={4} md={calendarView ? 4 : 12}>
                          <Paper
                            key={index}
                            elevation={1}
                            sx={{
                              mt: 2,
                              // borderRadius: 5,
                              borderTopLeftRadius: "30px",
                              borderBottomRightRadius: "30px",
                            }}
                          >



                            <Grid container sx={{ alignItems: "center", p: 2 }}>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={calendarView ? 12 : 3}
                              >
                                <Box sx={{ position: 'relative' }}>
                                  {item.img ? (
                                    <img
                                      src={item.img ? item.img : dummyImage}
                                      alt="Image"
                                      id="bpimage"
                                      height="200px"
                                      width={calendarView ? "100%" : "100%"}
                                      style={{
                                        borderTopLeftRadius: "30px",
                                        borderBottomRightRadius: "30px",
                                      }}
                                    />
                                  ) : (
                                    <span>Loading</span>
                                  )}

                                  {deleteAll ? (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        right: "-10px",
                                        top: "-10px",
                                        background: '#fff',
                                      }}
                                    >
                                      <Checkbox
                                        onClick={(event) => {
                                          handleCheckBox(event, item.id);
                                        }}
                                      />
                                    </Box>
                                  ) : null}
                                </Box>

                              </Grid>
                              <Grid xs={12} sm={12} md={calendarView ? 12 : 4} sx={{ minHeight: '120px', padding: '10px 0px', paddingLeft: calendarView ? '0px' : '20px' }}>
                                <Box >

                                  <Grid
                                    container
                                    display="flex"
                                    justifyContent={"right"}
                                    alignItems="center"
                                  >
                                    <Grid item lg={calendarView ? 6 : 12}
                                      md={calendarView ? 6 : 12}s order={calendarView ?1:2}>
                                      {" "}
                                      <Typography
                                        variant="h4"
                                        className="Typography_Heading"
                                      >
                                        {item.title}
                                      </Typography>
                                    </Grid>
                                    <Grid order={calendarView ?2:1}
                                      item
                                      // lg={6}
                                      lg={calendarView ? 6 : 12}
                                      md={calendarView ? 6 : 12}
                                      display="flex"
                                      justifyContent={calendarView ?"right":'start'}
                                    >
                                      <Typography>
                                        {" "}
                                        <img
                                          src={
                                            item.mealCatogary === "Nonveg"
                                              ? NonvegIcon
                                              : item.mealCatogary === "Veg"
                                              ? vegIcon
                                              : item.mealCatogary === "Vegan"
                                              ? VeganIcon
                                              : null
                                          }
                                          alt=""
                                          height="25px"
                                          width="25px"
                                        />
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>

                                <Typography
                                  // sx={{
                                  //   // position: "relative",
                                  //   // top: "5px",
                                  //   whiteSpace: " nowrap",
                                  //   // width: "s350px",
                                  //   overflow: " hidden",
                                  //   textOverflow: "ellipsis",
                                  //   // paddingRight: "45px",
                                  //   // lineHeight: "25px",
                                  //   fontFamily: "Inter",
                                  //   // fontSize: "18px",
                                  //   textTransform: "capitalize",
                                  //   // minHeight: "50px",
                                  // }}
                                  className="card_text"
                                >
                                  {item.description}
                                </Typography>
                              </Grid>
                              <Grid xs={12} sm={12} md={calendarView ? 12 : 4}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "right",
                                    justifyContent: calendarView ? "space-between" : "right",
                                  }}
                                >
                                  <Box>
                                    <Button style={{fontSize:'20px',textDecoration: 'none'}} variant="h5" onClick={() => sendFoodData(item, index)}>More</Button>
                                    {/* <VisibilityIcon
                                      className="Icons_in-Page"
                                      onClick={() => sendFoodData(item, index)}
                                    /> */}
                                  </Box>

                                  {isLogin ? (
                                    <Box sx={{ display: "flex" ,}}>
                                      <Box>
                                        <CreateIcon
                                          className="Icons_in-card"
                                          onClick={() => {
                                            NavigationToPage(
                                              `/addrecipe/${item.id}`
                                            );
                                          }}
                                          style={{paddingRight:'5px'}}
                                        />
                                      </Box>
                                      <Box>
                                        <DeleteIcon
                                          className="Icons_in-card"
                                          onClick={() => {
                                            setOpenAlert(true);
                                            setId(item.id);
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  ) : null}
                                </Box>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              </Box>
            </Stack>
          </Stack>
        </Container>
        <AlertComponent
          text="Are sure you want to delete?"
          option1="Yes"
          option2="No"
          show={openalert}
          setShow={setOpenAlert}
          handeldelete={handleDelete}
          dataid={id}
          collectIdToDelete={collectIdToDelete}
        />
      </Box>
      <Footer />
    </>
  );
}

export default RecipeSuggestionPage;
