import React, { useEffect, useState } from "react";
import moment from "moment";
import { Box, Container, IconButton, Paper, Typography } from "@mui/material";
import { base_url, getMealAPIEndpoint } from "../../config";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

function Allmeals() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = React.useState(false);

  const [dateDataofuser, setDatedata] = useState([]);
  const [changeborder, setChangeborder] = useState("");

  const fetchData = async () => {
    const res = await fetch(`${base_url}${getMealAPIEndpoint}`);
    const final = await res.json();
    final.map((e) => {
      let arr = e.meals;
      let nonrepeat = arr.filter(
        (value, i, arr) =>
          arr.findIndex((value2) => value2.start == value.start) === i
      );
      e.meals = nonrepeat;
      e.meals.reverse();
    });
    setData(final);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handelDate = async (ele, e) => {
    setChangeborder(ele.start);
    const res = await fetch(
      `${base_url}${getMealAPIEndpoint}?userid=${e.userid}`
    );

    let final = await res.json();

    const allmealsofusers = final[0].meals;

    const dateData = allmealsofusers.filter((e) => {
      return e.start == ele.start;
    });
    setDatedata(dateData);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setDatedata([]);
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ backgroundColor: "white", p: 2 }}>
          <Typography className="font_Headline_Welcome" sx={{ color: "black" }}>
            All User Meals
          </Typography>

          {data?.map((e, i) => {
            return (
              <Accordion
                expanded={expanded === i}
                onChange={handleChange(i)}
                key={i}
                sx={{ my: 2 }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      onClick={() => {
                        setDatedata([]);
                      }}
                    />
                  }
                >
                  <Typography variant="h6" className="Typography_Heading">
                    {i + 1}.{e.username}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>
                        <IconButton
                          onClick={() => {
                            const element =
                              document.getElementById("calender-div");
                            element.scrollBy({
                              left: -100,
                              top: 0,
                            });
                          }}
                        >
                          <ArrowBackIosNewOutlinedIcon />
                        </IconButton>
                      </Typography>
                      <Typography>
                        <IconButton
                          onClick={() => {
                            const element =
                              document.getElementById("calender-div");
                            element.scrollBy({
                              left: 100,
                              top: 0,
                            });
                          }}
                        >
                          <ArrowForwardIosOutlinedIcon />
                        </IconButton>
                      </Typography>
                    </Box>

                    <Box
                      id="calender-div"
                      sx={{
                        display: "flex",
                        overflow: "auto",
                        justifyContent: "start",
                        p: 2,
                        m: 1,
                      }}
                    >
                      {e?.meals.length !== 0 ? (
                        e?.meals.map((ele) => (
                          <>
                            <Paper
                              elevation={5}
                              sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 3,
                                border:
                                  ele.start == changeborder
                                    ? "1px solid orange"
                                    : "1px solid blue",
                                minWidth: "85px",
                                mb: "5px",
                                mr: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => handelDate(ele, e)}
                            >
                              <Typography
                                sx={{ color: "red" }}
                                // className='all_Descriptions'
                              >
                                {moment(ele.start).format("dddd")}
                              </Typography>

                              <Box>
                                <Typography
                                  variant="h3"
                                  sx={{ color: "black" }}
                                >
                                  {moment(ele.start).format("DD")}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "black" }}
                                >
                                  {moment(ele.start).format("MMMM")}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{ color: "black" }}
                                >
                                  {moment(ele.start).format("YYYY")}
                                </Typography>
                              </Box>
                            </Paper>
                          </>
                        ))
                      ) : (
                        <Container sx={{ mb: 3, textAlign: "Center" }}>
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{ color: "black", fontWeight: "bold" }}
                              className="all_Descriptions"
                            >
                              No meals found of this user
                            </Typography>
                          </Box>
                        </Container>
                      )}
                    </Box>

                    {dateDataofuser.length > 0 && (
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            my: 2,
                            py: 2,
                            display: "flex",
                          }}
                        >
                          {dateDataofuser.map((ele, i) => {
                            return (
                              <>
                                {/* <Grid
                                      container
                                    //   sx={{ justifyContent: "center" }}
                                    > */}
                                {/* <Grid items md={7} lg={6}> */}
                                <Box sx={{ mr: 3 }}>
                                  <Paper
                                    elevation={5}
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      width: "200px",
                                    }}
                                  >
                                    <Typography
                                      variant="h5"
                                      sx={{
                                        color: ele.color,
                                        width: "100px",
                                      }}
                                      className="all_Descriptions"
                                    >
                                      {ele.meal}
                                    </Typography>

                                    <Typography
                                      sx={{ color: "black" }}
                                      className="all_Descriptions"
                                    >
                                      {ele.food}
                                    </Typography>
                                  </Paper>
                                </Box>
                                {/* </Grid>
                                      <Grid items md={4} lg={6}> */}

                                {/* </Grid> */}
                                {/* </Grid> */}
                                {/* <Box
                                    sx={{
                                      display: "flex",

                                      ml: 30,
                                      background: "red",
                                    }}
                                  ></Box> */}
                              </>
                            );
                          })}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
export default Allmeals;
