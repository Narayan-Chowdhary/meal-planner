

import React from 'react';
import {
  base_url,
  getUserAPIEndpoint,
  getMealAPIEndpoint,
  getLayoutAPIEndpoint,
} from "../../config";
import './Navbar.css';
import { Box, Typography, Grid, Button, } from '@mui/material';
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react';
import { Popover } from '@mui/material';
import { useTranslation, initReactI18next } from "react-i18next";

import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';



export default function Navbar() {
  const { t } = useTranslation()
  const nav = useNavigate()

  const [dataFromLogin, setDataFromLogin] = useState([]);
  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
const [pageStyles, setpageStyles] = useState(null);

  useEffect(() => {
    const getLogin = JSON.parse(localStorage.getItem('items'));
    if (getLogin) {
      setDataFromLogin(getLogin)
      setIsLogin(getLogin.role == "user");
    }
      fetchStyles();
  }, [])


 const fetchStyles = async () => {
   const response = await fetch(
    `${base_url}${getLayoutAPIEndpoint}?module=Navheader`
   );
   let styles = await response.json();
   setpageStyles(styles[0]?.styles);
 };

 useEffect(() => {
 
 }, []);


  useEffect(() => {
    const getAdmin = JSON.parse(localStorage.getItem('items'));
    if (getAdmin) {
      setIsAdmin(getAdmin.role == "admin");
    }
  }, [])






const handleInfo = (event) => {
  setAnchorEl(event.currentTarget);


}

const [anchorEl, setAnchorEl] = React.useState(null);



const handleClose = () => {
  setAnchorEl(null);
};

const open = Boolean(anchorEl);
const id = open ? 'simple-popover' : undefined;


return (
  <>
    <Box
      sx={{
        background: `${pageStyles?.bgColor} !important`,
      }}
    >
      <Grid container sx={{ pt: 1, pb: 2, px: 4 }}>
        <Grid item xs={12} sm={7} md={9}>
          <Typography
            className="myRecipe"
            sx={{
              cursor: "pointer",
              top: "20px",
              color: `${pageStyles?.TextColor} !important`,
            }}
            onClick={() => nav("/home")}
          >
            MyRecipe
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={3}>
          {isAdmin ? (
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "end",
                padding: "13px",
                position: "relative",
                top: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    mr: "20px",
                    cursor: "pointer",
                  }}
                >
                  <Typography
                    className="menu_Navbar"
                    onClick={() => nav("/users")}
                    sx={{
                      color: `${pageStyles?.TextColor} !important`,
                    }}
                  >
                    {t("users")}
                    {/* Users */}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    color: "white",
                    mr: "20px",
                    cursor: "pointer",
                    color: `${pageStyles?.TextColor} !important`,
                  }}
                >
                  <Typography
                    className="menu_Navbar"
                    onClick={() => nav("/products")}
                    sx={{
                      color: `${pageStyles?.TextColor} !important`,
                    }}
                  >
                    {t("products")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex" }}>
                  <img
                    src={dataFromLogin.ProfileImage}
                    width={"50px"}
                    height={"50px"}
                    style={{ borderRadius: "50px", cursor: "pointer" }}
                  />
                  <Box
                    sx={{
                      mt: 4,

                      color: "#FFF",

                      cursor: "pointer",
                    }}
                  >
                    <ArrowDropDownCircleIcon
                      fontSize="small"
                      sx={{ ml: -2 }}
                      onClick={handleInfo}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              {isLogin ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",

                    mr: "20px",
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      color: "white",
                      mr: "20px",
                      mt: 1,
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      className="menu_Navbar"
                      onClick={() => nav("/addrecipe/:id")}
                      sx={{
                        color: `${pageStyles?.TextColor} !important`,
                      }}
                    >
                      {t("add_recipe")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      mr: "20px",
                      mt: 1,
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      className="menu_Navbar"
                      onClick={() => {
                        nav("/recipeSuggestionPage");
                      }}
                      sx={{
                        color: `${pageStyles?.TextColor} !important`,
                      }}
                    >
                      {t("all_recipe")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      mr: "20px",
                      mt: 1,
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      className="menu_Navbar"
                      onClick={() => {
                        nav("/settings");
                      }}
                      sx={{
                        color: `${pageStyles?.TextColor} !important`,
                      }}
                    >
                      {t("settings")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <img
                      src={dataFromLogin.ProfileImage}
                      width={"50px"}
                      height={"50px"}
                      style={{ borderRadius: "50px", cursor: "pointer" }}
                    />
                    <Box
                      sx={{
                        mt: 4,

                        color: "#FFF",

                        cursor: "pointer",
                      }}
                    >
                      <ArrowDropDownCircleIcon
                        fontSize="small"
                        sx={{ ml: -2 }}
                        onClick={handleInfo}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      onClick={handleInfo}
                      sx={{
                        color: "#FFF",
                        marginTop: "25px",
                        fontSize: "20px",
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", mt: 2, ml: 30 }}>
                  <Box
                    sx={{
                      color: "white",
                      mr: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      className="menu_Navbar"
                      onClick={() => {
                        nav("/");
                      }}
                      sx={{
                        cursor: "pointer",
                        color: `${pageStyles?.TextColor} !important`,
                      }}
                    >
                      {t("sign_in")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "white",
                      mr: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      className="menu_Navbar"
                      onClick={() => {
                        nav("/signup");
                      }}
                      sx={{
                        cursor: "pointer",
                        color: `${pageStyles?.TextColor} !important`,
                      }}
                    >
                      {t("sign_up")}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 1 }}>{dataFromLogin.name}</Typography>
        <Typography sx={{ p: 1 }}>{dataFromLogin.email}</Typography>
        <Button
          onClick={() => {
            nav("/");
            localStorage.clear();
          }}
        >
          {t("logout")}
        </Button>
      </Popover>
    </Box>
  </>
);
}
