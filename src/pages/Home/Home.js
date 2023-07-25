import "./Home.css";
import React, { useEffect, useState } from "react";
import { Typography, Grid, Button, Container, Box, Divider } from "@mui/material";
import Card from "../../components/ui/Card/Card";
import Header from "../../components/ui/Header/Header";
import { useNavigate } from "react-router";
import Footer from '../Footer/Footer'
import { useTranslation, initReactI18next } from "react-i18next";
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CardDetailsAdmin from "../../components/Admin/cardDetailsAdmin/CardDetailsAdmin";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";



export default function Home(props) {
  const { t } = useTranslation()
  const nav = useNavigate();



//props management 
 const showBot = props.showBot // props from app.js
 const toggleBot = props.toggleBot

  // setTimeout(() => {
  //   toggleBot(true);
  // }, 6000);


  // state managment
  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const [HEADER_ITEMS, SetHEADER_ITEMS] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [calendarView, setCalendarView] = useState(true)

  useEffect(() => {
    const getLogin = JSON.parse(localStorage.getItem("items"));
    setUserRole(getLogin.role);
    setIsAdmin(getLogin.role === "admin" ? true : false);
    setIsLogin(getLogin.role === "user" ? true : false);

    // SetHEADER_ITEMS(
    //   getLogin.role === "admin"
    //     ? ADMIN_HEADER_ITEMS
    //     : getLogin.role === "user"
    //     ? USER_HEADER_ITEMS
    //     : GUEST_HEADER_ITEMS
    // );

  }, []);








  return (
    <>
      <Header longHeader />

      <Box className="home_BackGround_Color">
        <Container maxWidth="xl">
          <Box
            sx={{
              padding: "0px 48px",
              justifyContent: "space-between",
            }}
          >
            {isLogin ? (
              <Box>
                <Box>
                  <Grid
                    container
                    columnSpacing={{ xs: 5 }}
                    sx={{ alignItems: "center" }}
                  >
                    <Grid item xs={7} sm={3} md={3}>
                      <Typography
                        variant="h4"
                        sx={{ py: 3, pl: 4, color: "#4F46E5" }}
                      >
                        {t("suggested_recipe")}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sm={9} md={8}>
                      <hr
                        style={{
                          border: "2px solid #4F46E5",
                          borderRadius: " 5px",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Grid container columnSpacing={{ xs: 5 }}>
                  <Grid item xs={3} sm={9} md={10}>
                    <Button
                      sx={{ ml: 6, }}
                      variant="contained"
                      className="all_Buttons_in_Page"
                      onClick={() => nav("/recipevt")}
                    >
                      {t("explore")}
                    </Button>
                  </Grid>
                  <Grid item xs={3} sm={3} md={2}>
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
                        // sx={{ mr: 2 }}
                        variant="contained"
                        className={
                          calendarView ? "btn-secondary" : "all_Buttons_in_Page"
                        }
                        onClick={() => setCalendarView(false)}
                      >
                        <TableRowsIcon />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ px: "30px" }}>
                  <Card calendarView={calendarView} />
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: "30px", minHeight: "400px" }} >
                <CardDetailsAdmin />
              </Box>
            )}
          </Box>
        </Container>
        <ScrollToTop scrollToTop={true} scrollToBottom={true} />
        <Footer />
      </Box>
    </>
  );
}
