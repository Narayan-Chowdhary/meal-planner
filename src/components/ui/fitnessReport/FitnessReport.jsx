import {
  base_url,
  getUserAPIEndpoint,
  getMealAPIEndpoint,
} from "../../../config";
import { React, useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Container,
  Card,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

///chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";





//// component start

function FitnessReport() {
  /// state managment\

  const [userDetails, setUserDetails] = useState([]);
  const [userMealDetails, setUserMealDetails] = useState();
  const [allMeals, setAllMeals] = useState();

  // useEffect

  useEffect(() => {
    getUserDataApi();
  }, []);

  //user details
  let getUserDetails = JSON.parse(localStorage.getItem("items"));

  // functional component
  const getUserDataApi = async () => {
    let responseMealApi = await fetch(`${base_url}${getMealAPIEndpoint}`);
    let responseMealJson = await responseMealApi.json();

    let userDetails = responseMealJson?.filter((e) => {
      return e.userid == getUserDetails.id;
    });
    let mealConsumptionDetails = userDetails?.map((meal) => meal.meals);
    setUserMealDetails(mealConsumptionDetails);
    setAllMeals(mealConsumptionDetails.length);
  };

  ///chart working

  const labels = ["Calories", "Fat", "carbs", "protien"];

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Meal detail chart",
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "meal data",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 200 })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          py: 3,
        }}
      >
        <Paper sx={{ px: 3, py: 1, height: "65vh", width: "60vw" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h4">User Details</Typography>
          </Box>
          <Divider />

          <Stack spacing={1}>
            <Grid container>
              <Grid items xs={4}>
                Name:
                <Typography variant="button">{getUserDetails.name}</Typography>
              </Grid>
              <Grid items xs={4}>
                Phone:
                <Typography variant="button">{getUserDetails.phone}</Typography>
              </Grid>
              <Grid items xs={4}>
                Date: {Date()}
              </Grid>
            </Grid>
            <Grid container>
              <Grid items xs={4}>
                Email:
                <Typography variant="button">{getUserDetails.email}</Typography>
              </Grid>
            </Grid>
          </Stack>
          <Divider />
          <Stack spacing={8}>
            <Grid container>
              <Grid item>Total meal: {allMeals}</Grid>
              <Grid container>
                <Grid item>
                  <Bar options={options} data={data} />
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default FitnessReport;
