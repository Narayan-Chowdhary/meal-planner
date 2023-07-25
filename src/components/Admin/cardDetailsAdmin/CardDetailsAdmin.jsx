import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Popover, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

//services
import { fetchUsersData, fetchProductsData } from "../../../Services/APIEngine";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "10px",
}));

//////
function CardDetailsAdmin() {
  const nav = useNavigate();

  //state managment
  const [userDetailsDisplay, setUserDetailsDisplay] = useState();
  const [productDetailsDisplay, setProductDetailsDisplay] = useState();

  /// useEffect
  useEffect(() => {
    userDetailsApi();
    productDetailsApi();
  }, []);

  // Api call
  const userDetailsApi = async () => {
    let userResponse = await fetchUsersData();
    let userDetails = userResponse?.filter((e) => {
      return e.role === "user";
    });
    setUserDetailsDisplay(userDetails.length);
  };

  const productDetailsApi = async () => {
    let productsResponse = await fetchProductsData();
    setProductDetailsDisplay(productsResponse.length);
  };

  const Items_Display = [
    {
      name: "Users",
      path: "/users",
      total: userDetailsDisplay,
    },
    {
      name: "Products",
      path: "/products",
      total: productDetailsDisplay,
    },
    {
      name: "Food",
      path: null,
      total: null,
    },
  ];

  return (
    <>

        <Grid container spacing={3}>
          {Items_Display?.map((e,i) => (
            <Grid item xs={4} key={i}>
              <Paper
                sx={{
                  cursor: e?.path !== null && "pointer" ,
                  borderRadius: "20px",
                  border: "1px solid orange",
                  mt: 8,
                  alignItems: "center",
                //   ":hover": {
                //     transform: "scale(1.1)",
                //     transform: "scale(1.1)",
                //     transform: "scale(1.1)",
                //   },
                }}
                elevation={10}
                onClick={() => nav(e?.path)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                  }}
                >
                  <Typography variant="h5">{e?.name}</Typography>
                  <Typography variant="h6">
                    {e?.total ? e?.total : "no details"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

    </>
  );
}

export default CardDetailsAdmin;
