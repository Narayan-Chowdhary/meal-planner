import React, { useState, useEffect } from "react";
import {
  base_url,
  getFoodAPIEndpoint,
} from "../../config";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Divider,
  Link,
  List,
  IconButton,
} from "@mui/material";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";
import Chart from "../../assests/cahrt.png"; 
import FoodImage from "../../assests/food-img.jpg";
import BmiCalculator from "../ui/BMI/BmiCalculator";
import "./DishPage.css";
import { orange, grey, blue } from "@mui/material/colors";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveIcon from "@mui/icons-material/Remove";
import FiberManualRecordSharpIcon from "@mui/icons-material/FiberManualRecordSharp";
import Popover from "@mui/material/Popover";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";

function DishPage() {
  let location = useLocation();
  let dataImportedFromFood = location.state.element;

  const boxStyling = {
    pt: 2,
    display: "flex",
    justifyContent: "space-around",
    gap: 10,
  };

  const IconStyling = {
    cursor: "pointer"
  }

  const [counter, setCounter] = useState(1);
  const [openBmi, setOpenBmi] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [like, setLike] = useState();
  const [disLike, setDisLike] = useState();

  const [dataFromLogin, setDataFromLogin] = useState([]);
  const [isLogin, setIsLogin] = useState(false)



  useEffect(() => {
    ldApi()
  }, [])

  const ldApi = async () => {
    let res = await fetch(
      `${base_url}${getFoodAPIEndpoint}${dataImportedFromFood.id}`
    );
    let data = await res.json()
    setLike(data.like)
    setDisLike(data.dislike)

  }

  const setDislikes = async () => {
    let add = 0
    let minus = 1
    setLike(0)
    setDisLike(1)
    await fetch(`${base_url}${getFoodAPIEndpoint}${dataImportedFromFood.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ like: add, dislike: minus }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

  }
  const setlikes = async () => {
    let add = 1
    let minus = 0
    setLike(1)
    setDisLike(0)
    await fetch(`${base_url}${getFoodAPIEndpoint}${dataImportedFromFood.id}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ like: add, dislike: minus }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

  }
  console.log("likes ", like, "dislikes", disLike)



  useEffect(() => {
    const getLogin = JSON.parse(localStorage.getItem('items'));
    if (getLogin) {
      setDataFromLogin(getLogin)
      setIsLogin(getLogin.role == "user");
    }
  }, [])



  const handleClick = () => {
    setOpenBmi(true);
  };

  const handleAdd = () => {
    setCounter(counter + 1);
  };
  const handleMin = () => {
    if (counter == 1) {
    } else {
      setCounter(counter - 1);
    }
  };

  const handleShare = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Box
        className="Main_Div"
        sx={{ backgroundColor: "#f1f5f9", position: "relative", pb:10 }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={dataImportedFromFood.img}
              alt=""
              width={"100%"}
              height={"500px"}
              style={
                {
                  // borderRadius:20
                }
              }
            />
          </Box>


          {isLogin ? <Box
            sx={{
              position: "absolute",
              bottom: "350px",
              right: "10px",
              display: "flex",
              justifyContent: "end",
              marginRight: "20px",
            }}
          >
            <Link
              className="Bmi_Box"
              onClick={handleClick}
              sx={{
                textDecoration: "none",
                color: "#FFF",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Check BMI
            </Link>
          </Box>
            : null}
          <Container minWidth="ld" maxWidth="lg">
            <Box sx={boxStyling}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {like !== 0 ? <ThumbUpIcon sx={{ cursor: "pointer", color: orange[800] }}onClick={setlikes} />
                  : <ThumbUpOffAltIcon sx={{ cursor: "pointer", color: orange[800] }} onClick={setlikes} />}

                
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {disLike !== 0 ? <ThumbDownIcon sx={{ cursor: "pointer", color: orange[800] }} onClick={setDislikes} /> :
                  <ThumbDownAltOutlinedIcon ThumbDownIcon sx={{ cursor: "pointer", color: orange[800] }} onClick={setDislikes} />
                }

                
              </Box>
              <Box>
                <ShareOutlinedIcon
                  sx={{ cursor: "pointer", color: orange[800] }}
                  aria-describedby={id}
                  variant="contained"
                  onClick={handleShare}
                />
                <Typography></Typography>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "bottom",
                  }}
                >
                  <Box sx={{ display: "flex", margin: "8px" }}>
                    <Box sx={{ margin: "10px" }}>
                      {" "}
                      <FacebookShareButton
                        quote={`This page is About ${dataImportedFromFood.title}`}
                        hashtag="#Recipe"
                        url={`${dataImportedFromFood.img}\n
                              ${dataImportedFromFood?.Steps.map((elements, index) => { return `\n${index}:- ${elements.step}` })}\n
                              ${dataImportedFromFood?.Ingredient.map((elements, index) => { return `\n${index}:-${elements.title}` })}`}
                      >
                        <FacebookIcon size="50px" round={true} />
                      </FacebookShareButton>
                    </Box>

                    <Box sx={{ margin: "10px" }}>
                      <WhatsappShareButton
                        title={`sharing recipe of ${dataImportedFromFood.title}`}
                        url={`${dataImportedFromFood.img}\n
                                                ${dataImportedFromFood?.Steps.map(
                          (elements, index) => {
                            return `\n${index}:- ${elements.step}`;
                          }
                        )}
                                                 ${dataImportedFromFood?.Ingredient.map(
                          (elements, index) => {
                            return `\n${index}:-${elements.title}`;
                          }
                        )}`}
                      >
                        <WhatsappIcon size="50px" round={true} />
                      </WhatsappShareButton>
                    </Box>
                  </Box>
                </Popover>
              </Box>
              <Box>
                <MoreHorizOutlinedIcon sx={{ cursor: "pointer", color: orange[800] }} />
                <Typography></Typography>
              </Box>
            </Box>

            <Box className="element">
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                <Grid item xs={2}>
                  <img
                    src={Chart}
                    alt=""
                    srcset=""
                    height="200px"
                    width="200px"
                  />
                </Grid>
                <Grid item xs={4} sx={{ pt: 10 }}>


                  <Typography variant="h4" className="Typography_Heading">
                    {dataImportedFromFood.calories * counter} calories{" "}
                  </Typography>

                  <Typography variant="subtitle1" className="all_Descriptions">
                    {7 * counter}g Carbs, {41 * counter}g Fat, {45 * counter}g
                    Protein{" "}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ pt: 10 }}>
                  <Grid
                    container
                    columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Grid item xs={6} >
                      <Typography variant="h4" className="Typography_Heading" sx={{pt:1}}>Amount to eat </Typography>
                    </Grid>

                    <Grid item xs={6} display="flex" alignItems={"center"} >
                      <IconButton>

                        <RemoveIcon
                          className='Icons_in-Page'
                          onClick={handleMin}
                        />
                      </IconButton>
                      <Typography variant="h4">{counter}</Typography>

                      <IconButton>
                        <AddRoundedIcon
                          className='Icons_in-Page'
                          onClick={handleAdd}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ my: 5 }} >
              <Typography variant="h4" className="Typography_Heading" sx={{pl:5}} >
                Description
              </Typography>
              <Typography className="all_Descriptions" sx={{ pl: 5 }}>
                {dataImportedFromFood.description}
              </Typography>
            </Box>
            <Box>
              {
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                  <Grid item xs={5}>
                    <Typography variant="h4" className="Typography_Heading" >Ingredient</Typography>
                    {dataImportedFromFood.Ingredient?.map((elements, index) => {
                      return (
                        <List key={index}>
                          <ListItem disablePadding>
                            <ListItemButton>
                              <FiberManualRecordSharpIcon 
                                sx={{ color: grey[500], }}
                           
                              />
                              <Typography variant="h4" className="all_Descriptions" >     {elements.title}</Typography>
                              <ListItemText primary="" />
                            </ListItemButton>
                          </ListItem>
                          <Divider />
                        </List>
                      );
                    })}
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h4" className="Typography_Heading"  >Steps</Typography>
                    {dataImportedFromFood.Steps?.map((elements, index) => {
                      return (
                        <List key={index}>

                          <ListItem disablePadding>
                            <ListItemButton>
                              <FiberManualRecordSharpIcon 
                                sx={{ color: grey[500], }}
                              
                              />

                              <Typography variant="h4" className="all_Descriptions" >    {elements.step} </Typography>
                              <ListItemText primary="" />
                            </ListItemButton>
                          </ListItem>

                          <Divider />
                        </List>
                      );
                    })}
                  </Grid>
                </Grid>
              }
            </Box>
          </Container>
        </Box>

      </Box>
      <BmiCalculator sendBmi={openBmi} sendBmi1={setOpenBmi} />
    </>
  );
}

export default DishPage;
