import { Avatar, Badge, Box, Button, Chip, Divider, Grid, IconButton, Popover, Typography } from "@mui/material"; //MUI
import { initializeApp } from "firebase/app";
import React, { useEffect, useState } from "react";
import "./Header.css";
//Image/ Icons imports
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Black from "../../../assests/rec.jpg";

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationAddRoundedIcon from '@mui/icons-material/NotificationAddRounded';

import {
  getDatabase
} from "firebase/database";
import PopoverNotification from "../../../pages/Popover/Popover.jsx";
//Firebase
import { getNotificationData } from "../../../Services/firebase";

//firebase Data
const firebaseConfig = {
  databaseURL: "https://meal-planner-390411-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Header({ longHeader = false  }) {
  //State Management
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [DataFromFireBase, setDataFromFireBase] = useState();
  const [notification, setNotification] = useState(false);
  const [notiCount, setNotiCount] = useState(0);
  const [HEADER_ITEMS, SetHEADER_ITEMS] = useState([]);

  const [productDetailsFromFirebase, setProductDetailsFromFirebase] =
    useState();
    const [notifyEl, setNotifyEl] = useState(null);
    const getLogin = JSON.parse(localStorage.getItem("items"));
  //useEffect

  useEffect(() => {
        setUserRole(getLogin.role);
        setIsAdmin(getLogin.role == "admin" ? true : false);
        setIsLogin(getLogin.role == "user" ? true : false);

        SetHEADER_ITEMS(
          getLogin.role === "admin"
            ? ADMIN_HEADER_ITEMS
            : getLogin.role === "user"
            ? USER_HEADER_ITEMS
            : GUEST_HEADER_ITEMS
        );
    fetchNotifications()
  }, []);

  const fetchNotifications = async()=>{
 
    const data = await getNotificationData();
     
    if (data) {
    
      let finalDataFromFireBase = Object.entries(data).map((el) => el);
   
      let finalData1 = finalDataFromFireBase?.filter(
        (e, i) => e[1].is_read == false
      );

      if (finalDataFromFireBase.length !== 0) {
        setNotification(true);
          
      } 
      setNotiCount(finalData1?.length);

      setDataFromFireBase(finalDataFromFireBase);
    }
  }

  /// Functional Operations


  //  FireBase Intialaization
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  // Component start

  // Translation
  const { t } = useTranslation();
  //Navigation
  const nav = useNavigate();

  const ADMIN_HEADER_ITEMS = [
    {
      name: "users",
      path: "/users",
    },
    {
      name: "products",
      path: "/products",
    },
    {
      name: "layout",
      path: "/adminLayout",
    },
    // {
    //   name: "logout",
    //   path: "/",
    //   local: () => {
    //     localStorage.clear();
    //   },
    // },
  ];
  //  "/addrecipe/:id ";
  const USER_HEADER_ITEMS = [
    {
      name: "home",
      path: "/home ",
    },
    {
      name: "all_recipe",
      path: "/recipeSuggestionPage",
    },
    {
      name: "groceries",
      path: "/groceries",
    },
    // {
    //   name: "logout",
    //   path: "/",
    //   local:()=>{
    //     localStorage.clear();
    //   }
    // },
  ];

  const GUEST_HEADER_ITEMS = [
    {
      name: "all_recipe",
      path: "/recipeSuggestionPage",
    },
  ];

  //Funnctional Body Start

  const handleInfo = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const sendMeal = () => {
    nav("/mealplanner");
  };
  //Funnctional Body End

  return (
    <>
      <Box
        className={longHeader ? "imageBox" : ""}
        sx={
          longHeader
            ? {
                backgroundImage: `url(${Black})`,
              }
            : {
                backgroundColor: "#4F46E5",
              }
        }
      >
        <Box>
          <Grid
            container
            sx={{
              p: longHeader ? 2 : 2,
              px: !longHeader ? 5 : 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={12} sm={6} md={6}>
              <Box>
                <Typography
                  className="myRecipe"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    nav("/home");
                  }}
                >
                  MyRecipe
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className="cardGrid">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {HEADER_ITEMS?.map((v, i) => (
                  <Box key={i}>
                    <Typography
                      className="menu_Navbar"
                      onClick={() => {
                        if (v?.name === "logout") {
                          v?.local();
                        }
                        nav(v?.path);
                      }}
                    >
                      {t(v?.name)}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ position: "relative" }}>
                  <Box>
                    <Badge
                      badgeContent={notiCount}
                      color="error"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <NotificationsActiveIcon
                        sx={{ cursor: "pointer", color: "#FFFFFF" }}
                        onClick={handleInfo}
                      />
                    </Badge>
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    onClick={(e) => {
                      setNotifyEl(e.currentTarget);
                    }}
                  >
                    <Avatar
                      sx={{ width: 30, height: 30, ml: 1 }}
                      src={getLogin?.ProfileImage}
                    />
                  </IconButton>
                  <Popover
                    id={Boolean(notifyEl)}
                    open={Boolean(notifyEl) ? "simpe-notify" : undefined}
                    anchorEl={notifyEl}
                    onClose={() => {
                      setNotifyEl(null);
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <List disablePadding>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <Box
                          // display="flex"
                          // justifyContent="space-evenly"
                          // alignItems="center"
                          >
                            <Typography>{getLogin?.name}</Typography>
                            <Typography
                              // ml={1}
                              textTransform="capitalize"
                            >
                              ({getLogin?.role})
                            </Typography>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Settings"
                            onClick={() => {
                              nav("/settings");
                            }}
                          />
                        </ListItemButton>
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary="Logout"
                            onClick={() => {
                              localStorage.clear();
                              nav("/");
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Popover>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {longHeader && (
          <Box className={isLogin ? "LoginHeading" : "UnLogged"}>
            <Box>
              <Box>
                <Typography className="internW">
                  {isAdmin ? t("Welcome_admin") : t("Welcome_to_myrecipe")}
                </Typography>
              </Box>
              {isLogin ? (
                <Box className="navHeader">
                  <Button className="navButton" onClick={sendMeal}>
                    <Typography className="internH" sx={{ fontSize: "16px" }}>
                      {t("meal_planner")}
                    </Typography>
                  </Button>
                </Box>
              ) : null}
            </Box>
          </Box>
        )}
      </Box>
      <Popover
        id={Boolean(anchorEl)}
        open={Boolean(anchorEl) ? "simple-popover" : false}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <PopoverNotification
          DataFromFireBase={DataFromFireBase}
          database={database}
          notification={notification}
          productDetailsFromFirebase={productDetailsFromFirebase}
          setAnchorEl={setAnchorEl}
          fetchNotifications={fetchNotifications}
        />
      </Popover>
    </>
  );
}
