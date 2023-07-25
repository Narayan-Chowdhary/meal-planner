import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import Papa from "papaparse";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import image from "../../assests/meal.jpg";

function AddRecipeCSV() {
  const nav = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [ufData, setUFData] = useState(null);
  let [previewData, setPreviewData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Perform file upload logic here
    console.log("Uploaded file:", file);
    setUFData(file);
    handleCSVUpload(file);
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function handleCSVUpload(data) {
    // Handle the parsed CSV data
    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // console.log(results.data);

        parsingDataAndPreparingResult(results.data);
      },
    });
  }

  const parsingDataAndPreparingResult = async (data) => {
    //Set in the DB.json in Food Key
    // console.log(data[0], "data to be posted");
    for (let i = 0; i < data.length; i++) {
      const finalfood = data[i];
      let Ing = finalfood.Ingredient.replace(/(\r\n|\n|\r)/gm, "").trim();
      let changeding = JSON.parse(Ing);

      finalfood.Ingredient = changeding;

      let Step = finalfood.Steps.replace(/(\r\n|\n|\r)/gm, "").trim();
      let changedstep = JSON.parse(Step);
      finalfood.Steps = changedstep;

      let Key = finalfood.keyword.replace(/(\r\n|\n|\r)/gm, "").trim();
      let changekey = JSON.parse(Key);

      finalfood.keyword = changekey;

      console.log(finalfood);

      const postfood = await fetch("http://localhost:8000/Food", {
        method: "POST",
        body: JSON.stringify(finalfood),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });
      const response = await postfood.json();
      console.log(response, "posted");
      previewData.push(response);
      setPreviewData([...previewData]);
    }
  };

  return (
    <Box
      sx={{
        // backgroundColor:"#bae6fd",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
        p:2
      }}
    >
      <Container sx={{ backgroundColor: "white" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              border: "1px dashed #000",
              height: 150,
              width: 500,
              borderRadius: 5,
              mt: 5,
            }}
          >
            <Box
              p={1}
              m={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <input
                type="file"
                id="upload-input"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                accept=".csv, .xlsx"
              />
              <label htmlFor="upload-input">
                <Typography
                  align="center"
                  variant="h5"
                  component="span"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Upload
                  <Typography>{ufData?.name}</Typography>
                </Typography>
              </label>
            </Box>
            {ufData ? (
              <Box display="flex">
                <Typography ml={5}>Name: {ufData?.name}</Typography>
                <Typography ml={5}>Size: {ufData?.size} kb</Typography>
                <Typography ml={5}>
                  Total Records: {previewData?.length}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
        {console.log(previewData)}
        {/* <Box mt={10} display={previewData.length == 0 && "none"}>
        {previewData?.map((v, i) => (
          <Paper elevation={5} sx={{ p: 1, m: 1 }}>
            <Typography>{v?.sno}</Typography>
            <Typography>
              <Typography fontWeight={800}>Title</Typography>
              {v?.title}
            </Typography>
            <Typography>
              <Typography fontWeight={800}>Description</Typography>
              {v?.description}
            </Typography>
            <Typography>
              <Typography fontWeight={800}>Meal Catogary</Typography>
              {v?.mealCatogary}
            </Typography>

            <Typography>
              <Typography fontWeight={800}>Steps</Typography>
              {Object.keys(JSON.parse(v?.Steps))?.map((n, i) => {
                return (
                  <Typography>
                    {i + 1}.{JSON.parse(v?.Steps)[i].step}
                  </Typography>
                );
              })}
            </Typography>
            <Typography>
              <Typography fontWeight={800}>Ingredient</Typography>
              {Object.keys(JSON.parse(v?.Ingredient))?.map((n, i) => {
                return (
                  <Typography>
                    {i + 1}.{JSON.parse(v?.Ingredient)[i].title}
                  </Typography>
                );
              })}
            </Typography>
          </Paper>
        ))}
      </Box> */}

        <Container maxWidth="xl" sx={{ backgroundColor: "white" }}>
          <Box sx={{ backgroundColor: "white", p: 2, mt: 10 }}>
            {previewData?.map((e, i) => {
              return (
                <Accordion
                  expanded={expanded === i}
                  onChange={handleChange(i)}
                  key={i}
                  sx={{ my: 2 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon onClick={() => {}} />}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        {e.img ? (
                          <img
                            src={e.img}
                            alt="Image"
                            id="bpimage"
                            height="100px"
                            width="100px"
                          />
                        ) : (
                          <span>Loading</span>
                        )}
                      </Box>
                      <Box sx={{ mt: "29px", ml: "50px" }}>
                        <Typography variant="h6" className="Typography_Heading">
                          {e.title}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="h6">{e.mealCatogary}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="h6">
                            Calories-{e.calories ? e.calories : "0"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Box>
                          <Typography variant="h6">Description</Typography>
                        </Box>
                        <Box>
                          <Typography>{e.description}</Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Box>
                          <Typography variant="h6">Ingredients</Typography>
                        </Box>
                        <Box>
                          <Box>
                            {e.Ingredient.map((data, index) => {
                              return <Box>{data.title}</Box>;
                            })}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Box>
                          <Typography variant="h6"> Steps</Typography>
                        </Box>
                        <Box>
                          {e?.Steps.map((ele, i) => {
                            return (
                              <Box key={i}>
                                <Typography>
                                  {i + 1}.{ele.step}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Box>
                          <Typography variant="h6">Keywords-</Typography>
                        </Box>
                        <Box sx={{ ml: 2, mt: "4px" }}>
                          {e?.keyword.map((data) => {
                            return <Typography>{data}</Typography>;
                          })}
                        </Box>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Container>
      </Container>
    </Box>
  );
}

export default AddRecipeCSV;
