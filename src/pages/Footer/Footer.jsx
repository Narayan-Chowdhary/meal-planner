import {React, useEffect,useState} from 'react'
import { Box, Container, Grid, Typography } from "@mui/material";
function Footer() {

 const [pageStyles, setpageStyles] = useState(null);
useEffect(()=>{fetchStyles();},[])

 const fetchStyles = async () => {
   const response = await fetch("http://localhost:8000/layout?module=Footer");
   let styles = await response.json();
   setpageStyles(styles[0]?.styles);
 };
    return (
      <Box
        sx={{
          width: "100%",
          height: "auto",
          backgroundColor: `${pageStyles?.bgColor} !important`,
          // marginTop: '40px',
          paddingTop: "1rem",
          paddingBottom: "1rem",
          // bottom:0,
          // position:"absolute"
        }}
      >
        <Container maxWidth="lg">
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: `${pageStyles?.TextColor} !important`,
                }}
                variant="h5"
              >
                My Recipe
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography   sx={{
                  color: `${pageStyles?.TextColor} !important`,
                }} variant="subtitle1">
                {` +188574643 | LinkedIn | Facebook `}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
}

export default Footer
