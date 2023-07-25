import "./card.css";
import "../../MajorCSS/majorCss.css";
import React, { useEffect, useState } from "react";
import {
  base_url,
  cloudinaryUploadImage_url,
  getLayoutAPIEndpoint,
  getUserAPIEndpoint,
  getFoodAPIEndpoint,
} from "../../../config";
import { Typography, Box, Button, Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import dummyImage from "../../../assests/FoodBg.jpeg";
import { useTranslation, initReactI18next } from "react-i18next";

function Card({ calendarView }) {


  const [foodShow, setFoodShow] = useState([]);
  const nav = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getFood();
  }, []);

  const getFood = async () => {
    const food = await fetch(`${base_url}${getFoodAPIEndpoint}`)
      .then((res) => res.json())
      .then((data) => {
        data.reverse();
        setFoodShow(data);
      });
  };
  function sendFoodData(element) {
    nav("/dishPage", { state: { element } });
  }

 
  return (
    <>
      <Grid container spacing={2} sx={{ alignItems: "center", p: 2 }}>
        {foodShow.map((item, index) => {
          return (
            <>
              <Grid item xs={12} sm={4} md={calendarView ? 4 : 12}>
                <Paper key={index}
                  elevation={1}
                  sx={{
                    mt: 2,
                    // borderRadius: 5,
                    borderTopLeftRadius: "30px",
                    borderBottomRightRadius: "30px",
                    minHeight:calendarView ?'375px':'100%',
                  }}
                >
                  <Grid container sx={{ alignItems: "center", p: 2 }}>
                    <Grid item xs={12} sm={12} md={calendarView ? 12 : 4}>
                      {item.img ?
                        <img
                          src={item.img ? item.img : dummyImage}
                          alt="Image"
                          id="bpimage"
                          height="200px"
                          width={calendarView ? "100%" : "250px"}
                          style={{
                            borderTopLeftRadius: "30px",
                            borderBottomRightRadius: "30px"
                          }}
                        />
                        :
                        <span>Loading</span>
                      }
                    </Grid>
                    <Grid item={12} sm={6} md={calendarView ? 12 : 7} 
                    sx={{minHeight: '120px',paddingBottom:'10px'}}
                    >
                      <Typography variant="h4" className="Typography_Heading">
                        {item.title}
                      </Typography>

                      <Typography
                      className="card_text"

                      >
                        {item.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={calendarView ? 12 : 1}>
                      <Button
                        variant="contained"
                        className="all_Buttons_in_Page"
                        onClick={() => {
                          sendFoodData(item, index);
                        }}
                      >
                        {t("view_recipe")}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </>)
        })}
      </Grid>


    </>
  );
}

export default Card;
