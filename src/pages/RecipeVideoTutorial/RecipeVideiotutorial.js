// import { React, useEffect, useState } from "react";
// import Header from "../../components/ui/Header/Header";
// import {
//   Box,
//   Typography,
//   Chip,
//   Divider,
//   Grid,
//   Container,
//   Stack,
//   Menu,
//   MenuItem,
//   Button,
//   Dialog,
//   Paper,
//   Select,
//   dialogClasses,
//   FormControl,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Card from "../../components/ui/Card/Card";
// import "./RecipeVideoTutorial.css";
// import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
// import Notification from "../Notification/Notification";
// import InputLabel from "@mui/material/InputLabel";
// // import Header from '../Header/Header'

// function RecipeVideiotutorial() {
//   const nav = useNavigate();

//   const [foodData, setFoodData] = useState([]);
//   const [meals, setMeals] = useState([]);
//   const [flags, setFlags] = useState([]);
//   const [youlink, setYoulink] = useState("");
//   const [error, setError] = useState(false);
//   const [show, setShow] = useState(false);
//   const [country, setCountry] = useState("");
//   const getData = async () => {
//     const food = await fetch(
//       "https://www.themealdb.com/api/json/v1/1/random.php"
//     );
//     const res = await food.json();
//     setFoodData(res.meals);
//     console.log(res.meals);

//     const flag = await fetch(" https://restcountries.com/v3.1/all");
//     const response = await flag.json();
//     // console.log("data",response)
//     response?.map((e) => {
//       flags.push(e.flags);
//     });
//     flags.map((e, i) => {
//       e.country = response[i]?.demonyms?.eng.f;
//     });
//     //  const   data= response.filter((e)=>{
//     //         if(e.name.common=="Vietnam"){
//     //             console.log(e.demonyms.eng.f)
//     //             return e
//     //         }
//     //     })
//     // console.log("ada",data)

//     console.log(flags);
//   };
//   let count = 0;
//   let ste = "";
//   const playVideo = (e) => {
//     console.log("sentlink", e);
//     //window.open(e, '_blank');
//     // setYoulink(e)
//     for (let i = 0; i < e.length - 1; i++) {
//       if (e[i] === "=") {
//         count = 1;
//       }
//       if (count == 1) {
//         console.log(e[i + 1]);
//         ste += e[i + 1];
//         //setYoulink(e[i+1])
//       }
//     }
//     setYoulink(ste);
//     setShow(true);
//     // setTimeout(() => {
//     //     setShow(true)
//     // }, 3000)
//   };

//   const findbyCountry = async (con) => {
//     console.log("ada");
//     const county = con.target.value;
//     setCountry(county);
//     const country = await fetch(
//       `https://www.themealdb.com/api/json/v1/1/filter.php?a=${county}`
//     );
//     const response = await country.json();
//     console.log(response);
//     setMeals(response.meals);
//     if (response.meals == null) {
//       setError(true);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <>
//       <Header />

//       <Box
//         className="RecipePage-Container"
//         sx={{ backgroundColor: "#cbd5e1", height: "100%" }}
//       >
//         <Box className="recipePage-Second-Container">
//           <Container maxWidth="xl">
//             <Stack spacing={3}>
//               <Box>
//                 <Grid container sx={{ color: "#4F46E5", fontFamily: "Inter" }}>
//                   <Grid item xs={6} sm={5} md={3}>
//                     <Typography
//                       variant="h3"
//                       secondary
//                       sx={{ marginTop: "20px" }}
//                     >
//                       {" "}
//                       Recipe Videos
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={6} sm={7} md={9} sx={{ pt: 3 }}>
//                     <hr
//                       style={{
//                         border: "2px solid #4F46E5",
//                         borderRadius: " 5px",
//                         marginTop: "20px",
//                       }}
//                     />
//                   </Grid>
//                 </Grid>
//               </Box>
//               <Stack spacing={3}>
//                 <Box sx={{ my: 2 }}>
//                   <Grid container columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
//                     <Grid item xs={1} sm={1} lg={1}>
//                       <Typography variant="h5" secondary sx={{ marginTop: 1 }}>
//                         Country:
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={11} sm={11} lg={11}>
//                       <Box sx={{ display: "flex", overflow: "auto" }}>
//                         <FormControl sx={{ width: "50%" }}>
//                           {/* <InputLabel id="demo-multiple-name-label" disabled={true}>Select Your Country</InputLabel> */}
//                           {console.log(flags[0], "1124")}
//                           <Select
//                             onChange={findbyCountry}
                          
//                             defaultValue={flags[0]}
//                           >
//                             {flags.slice(30, 200).map((ele, i) => {
//                               return (
//                                 <MenuItem value={ele.country} key={i}>
//                                   <Box
//                                     sx={{ display: "flex", flexWrap: "wrap" }}
//                                   >
//                                     <Box sx={{ marginRight: "10px" }}>
//                                       <img
//                                         src={ele.png}
//                                         alt="Image"
//                                         id="bpimage"
//                                         height={"50px"}
//                                         width={"50px"}
//                                         style={{
//                                           marginR: "5px",
//                                         }}
//                                       />
//                                     </Box>
//                                     <Typography>
//                                       {i + 1}. {ele.country}
//                                     </Typography>
//                                   </Box>
//                                 </MenuItem>
//                               );
//                             })}
//                           </Select>
//                         </FormControl>

//                         {/* {flags.slice(30, 200).map((ele, index) => {
//                                                     return (

//                                                         <Box sx={{ mx: 1 }} key={index} onClick={() => findbyCountry(ele.country)} >

//                                                             <img src={ele.png} alt="Image" id="bpimage" height={'40px'} width={'40px'} />

//                                                         </Box>
//                                                     )
//                                                 })} */}
//                                             </Box>
//                                         </Grid>

//                                     </Grid>
//                                 </Box>


//                                 {foodData?.map((item, index) => {
//                                     return <Box key={index} className="RecipeSuggetionBg">

//                                         <Box sx={{ display: "flex", justifyContent: "start", position: "relative" }}>
//                                             <video width="500" height="400" poster={item.strMealThumb} controls  >
//                                                 <source src={item.strSource
//                                                 } type="video/mp4" />

//                                             </video>
//                                             <Box sx={{ position: "absolute", top: "38%", left: "220px" }}>
//                                                 <PlayCircleFilledWhiteIcon fontSize='large' color='secondary' onClick={() => playVideo(item.strYoutube
//                                                 )} sx={{ fontSize: "60px" }} />
//                                             </Box>

//                                             {/* <img src={item.strMealThumb} alt="Image" id="bpimage" height={'400px'} width={'400px'} /> */}
//                                             <Box >
//                                                 <Container sx={{ paddingBottom: "20px" }}>
//                                                     <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }} >
//                                                         <Box className="cardMainText">
//                                                             <Typography variant='h7' className='internFont' sx={{ fontWeight: "600", fontSize: "40px" }}>
//                                                                 {item.strMeal}
//                                                             </Typography></Box>

//                                                         <Box sx={{ marginBottom: "2%" }}>
//                                                             <Typography variant='h7' className='internFont' sx={{ fontWeight: "400", fontSize: "24px" }}>
//                                                                 Region: {item.strArea}
//                                                             </Typography>

//                 {foodData?.map((item, index) => {
//                   return (
//                     <Box key={index} className="background_For_RecipeSuggetion">
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "start",
//                           position: "relative",
//                         }}
//                       >
//                         <video
//                           width="500"
//                           height="400"
//                           poster={item.strMealThumb}
//                           controls
//                         >
//                           <source src={item.strSource} type="video/mp4" />
//                         </video>
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             top: "38%",
//                             left: "220px",
//                           }}
//                         >
//                           <PlayCircleFilledWhiteIcon
//                             fontSize="large"
//                             color="secondary"
//                             onClick={() => playVideo(item.strYoutube)}
//                             sx={{ fontSize: "60px" }}
//                           />
//                         </Box>

//                         {/* <img src={item.strMealThumb} alt="Image" id="bpimage" height={'400px'} width={'400px'} /> */}
//                         <Box>
//                           <Container sx={{ paddingBottom: "20px" }}>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 gap: "15px",
//                               }}
//                             >
//                               <Box className="cardMainText">
//                                 <Typography
//                                   variant="h7"
//                                   className="internFont"
//                                   sx={{ fontWeight: "600", fontSize: "40px" }}
//                                 >
//                                   {item.strMeal}
//                                 </Typography>
//                               </Box>

//                               <Box sx={{ marginBottom: "2%" }}>
//                                 <Typography
//                                   variant="h7"
//                                   className="internFont"
//                                   sx={{ fontWeight: "400", fontSize: "24px" }}
//                                 >
//                                   Region: {item.strArea}
//                                 </Typography>
//                               </Box>
//                               <Box sx={{ marginBottom: "2%" }}>
//                                 <Typography
//                                   variant="h7"
//                                   className="internFont"
//                                   sx={{ fontWeight: "400", fontSize: "24px" }}
//                                 >
//                                   Category: {item.strCategory}
//                                 </Typography>
//                               </Box>
//                               {/* <Box sx={{ marginBottom: "2%" }}>
//                                                             <Typography variant='h7' className='internFont' sx={{ fontWeight: "400", fontSize: "24px" }}>
//                                                                 Ingredients:  {item.strIngredient1}

//                                                             </Typography>
//                                                         </Box> */}
//                               <Box sx={{ marginBottom: "2%" }}>
//                                 <Button
//                                   variant="contained"
//                                   className="cardButton"
//                                   sx={{ padding: "10px 20px" }}
//                                   onClick={() => {
//                                     nav("/recipeSuggestionPage");
//                                   }}
//                                 >
//                                   Other Recipe
//                                 </Button>
//                               </Box>
//                             </Box>
//                           </Container>
//                         </Box>
//                       </Box>
//                     </Box>
//                   );
//                 })}
//               </Stack>
//             </Stack>

//             <Container sx={{ mt: 3 }}>
//               {meals == null || meals?.length == 0 ? (
//                 ""
//               ) : (
//                 <Typography
//                   variant="h3"
//                   secondary
//                   sx={{ mb: 1, color: "#4F46E5" }}
//                 >
//                   Famous {country} Dishes
//                 </Typography>
//               )}

//               <Grid container>
//                 <Grid item xs={12} sm={12} lg={12}>
//                   <Box sx={{ display: "flex", flexWrap: "wrap" }}>
//                     {meals?.map((e, i) => {
//                       return (
//                         <Paper
//                           key={i}
//                           sx={{
//                             backgroundColor: "white",
//                             m: 1,
//                             p: 1,
//                             width: "250px",
//                           }}
//                         >
//                           <Box>
//                             <img
//                               src={e.strMealThumb}
//                               alt="Image"
//                               style={{
//                                 maxWidth: " 100%",
//                                 height: "auto",
//                               }}
//                             />
//                           </Box>
//                           <Box sx={{ padding: 2, textAlign: "center" }}>
//                             <Typography
//                               variant="h7"
//                               sx={{ fontWeight: "400", fontSize: "24px" }}
//                             >
//                               {e.strMeal}
//                             </Typography>
//                           </Box>
//                         </Paper>
//                       );
//                     })}
//                   </Box>
//                 </Grid>
//               </Grid>

//               <Grid></Grid>
//             </Container>
//           </Container>
//         </Box>
//         <Dialog
//           open={show}
//           maxWidth="xl"
//           onClose={() => {
//             setShow(false);
//           }}
//         >
//           <iframe
//             width="1212"
//             height="682"
//             src={`https://www.youtube.com/embed/${youlink}`}
//             title='Croatian Food Recipe - How to make this simple Croatian Walnut Roll "Gužvara"'
//             frameborder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowfullscreen
//           ></iframe>
//         </Dialog>
//       </Box>

//       <Notification
//         text="No meals found"
//         status="error"
//         isActive={error}
//         setActive={setError}
//       />
//     </>
//   );
// }

// export default RecipeVideiotutorial;

import { React, useEffect, useState } from "react";
import Header from "../../components/ui/Header/Header";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Container,
  Stack,
  Menu,
  MenuItem,
  Button,
  Dialog,
  Paper,
  Select,
  dialogClasses,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card/Card";
import "./RecipeVideoTutorial.css";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import Notification from "../Notification/Notification";
import InputLabel from "@mui/material/InputLabel";
// import Header from '../Header/Header'

function RecipeVideiotutorial() {
  const nav = useNavigate();

  const [foodData, setFoodData] = useState([]);
  const [meals, setMeals] = useState([]);
  const [flags, setFlags] = useState([]);
  const [youlink, setYoulink] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const getData = async () => {
    const food = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const res = await food.json();
    setFoodData(res.meals);
    console.log(res.meals);

    const flag = await fetch(" https://restcountries.com/v3.1/all");
    const response = await flag.json();
    // console.log("data",response)
    response?.map((e) => {
      flags.push(e.flags);
    });
    flags.map((e, i) => {
      e.country = response[i]?.demonyms?.eng.f;
    });
    //  const   data= response.filter((e)=>{
    //         if(e.name.common=="Vietnam"){
    //             console.log(e.demonyms.eng.f)
    //             return e
    //         }
    //     })
    // console.log("ada",data)

    console.log(flags);
  };
  let count = 0;
  let ste = "";
  const playVideo = (e) => {
    console.log("sentlink", e);
    //window.open(e, '_blank');
    // setYoulink(e)
    for (let i = 0; i < e.length - 1; i++) {
      if (e[i] === "=") {
        count = 1;
      }
      if (count == 1) {
        console.log(e[i + 1]);
        ste += e[i + 1];
        //setYoulink(e[i+1])
      }
    }
    setYoulink(ste);
    setShow(true);
    // setTimeout(() => {
    //     setShow(true)
    // }, 3000)
  };

  const findbyCountry = async (con) => {
    console.log("ada");
    const county = con.target.value;
    setCountry(county);
    const country = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${county}`
    );
    const response = await country.json();
    console.log(response);
    setMeals(response.meals);
    if (response.meals == null) {
      setError(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header longHeader />

      <Box
        className="RecipePage-Container"
        sx={{ backgroundColor: "#cbd5e1", height: "100%" }}
      >
        <Box className="recipePage-Second-Container">
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Box>
                <Grid container sx={{ color: "#4F46E5", fontFamily: "Inter" }}>
                  <Grid item xs={6} sm={5} md={3}>
                    <Typography
                      variant="h3"
                      secondary
                      sx={{ marginTop: "20px" }}
                    >
                      {" "}
                      Recipe Videos
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={7} md={9} sx={{ pt: 3 }}>
                    <hr
                      style={{
                        border: "2px solid #4F46E5",
                        borderRadius: " 5px",
                        marginTop: "20px",
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Stack spacing={3}>
                <Box sx={{ my: 2 }}>
                  <Grid container columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                    <Grid item xs={1} sm={1} lg={1}>
                      <Typography variant="h5" secondary sx={{ marginTop: 1 }}>
                        Country:
                      </Typography>
                    </Grid>
                    <Grid item xs={11} sm={11} lg={11}>
                      <Box sx={{ display: "flex", overflow: "auto" }}>
                        <FormControl sx={{ width: "50%" }}>
                          {/* <InputLabel id="demo-multiple-name-label">Select Your Country</InputLabel> */}

                          <Select onChange={findbyCountry}>
                            {flags.slice(30, 200).map((ele, i) => {
                              return (
                                <MenuItem value={ele.country} key={i}>
                                  <Box
                                    sx={{ display: "flex", flexWrap: "wrap" }}
                                  >
                                    <Box sx={{ marginRight: "10px" }}>
                                      <img
                                        src={ele.png}
                                        alt="Image"
                                        id="bpimage"
                                        height={"50px"}
                                        width={"50px"}
                                        style={{
                                          marginR: "5px",
                                        }}
                                      />
                                    </Box>
                                    <Typography>
                                      {i + 1}. {ele.country}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>

                        {/* {flags.slice(30, 200).map((ele, index) => {
                                                    return (

                                                        <Box sx={{ mx: 1 }} key={index} onClick={() => findbyCountry(ele.country)} >

                                                            <img src={ele.png} alt="Image" id="bpimage" height={'40px'} width={'40px'} />

                                                        </Box>
                                                    )
                                                })} */}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {foodData?.map((item, index) => {
                  return (
                    <Box key={index} className="RecipeSuggetionBg">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          position: "relative",
                        }}
                      >
                        <video
                          width="500"
                          height="400"
                          poster={item.strMealThumb}
                          controls
                        >
                          <source src={item.strSource} type="video/mp4" />
                        </video>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "38%",
                            left: "220px",
                          }}
                        >
                          <PlayCircleFilledWhiteIcon
                            fontSize="large"
                            color="secondary"
                            onClick={() => playVideo(item.strYoutube)}
                            sx={{ fontSize: "60px" }}
                          />
                        </Box>

                        {/* <img src={item.strMealThumb} alt="Image" id="bpimage" height={'400px'} width={'400px'} /> */}
                        <Box>
                          <Container sx={{ paddingBottom: "20px" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                              }}
                            >
                              <Box className="cardMainText">
                                <Typography
                                  variant="h7"
                                  className="internFont"
                                  sx={{ fontWeight: "600", fontSize: "40px" }}
                                >
                                  {item.strMeal}
                                </Typography>
                              </Box>

                              <Box sx={{ marginBottom: "2%" }}>
                                <Typography
                                  variant="h7"
                                  className="internFont"
                                  sx={{ fontWeight: "400", fontSize: "24px" }}
                                >
                                  Region: {item.strArea}
                                </Typography>
                              </Box>
                              <Box sx={{ marginBottom: "2%" }}>
                                <Typography
                                  variant="h7"
                                  className="internFont"
                                  sx={{ fontWeight: "400", fontSize: "24px" }}
                                >
                                  Category: {item.strCategory}
                                </Typography>
                              </Box>
                              {/* <Box sx={{ marginBottom: "2%" }}>
                                                            <Typography variant='h7' className='internFont' sx={{ fontWeight: "400", fontSize: "24px" }}>
                                                                Ingredients:  {item.strIngredient1}

                                                            </Typography>
                                                        </Box> */}
                              <Box sx={{ marginBottom: "2%" }}>
                                <Button
                                  variant="contained"
                                  className="cardButton"
                                  sx={{ padding: "10px 20px" }}
                                  onClick={() => {
                                    nav("/recipeSuggestionPage");
                                  }}
                                >
                                  Other Recipe
                                </Button>
                              </Box>
                            </Box>
                          </Container>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Stack>

            <Container sx={{ mt: 3 }}>
              {meals == null || meals?.length == 0 ? (
                ""
              ) : (
                <Typography
                  variant="h3"
                  secondary
                  sx={{ mb: 1, color: "#4F46E5" }}
                >
                  Famous {country} Dishes
                </Typography>
              )}

              <Grid container>
                <Grid item xs={12} sm={12} lg={12}>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {meals?.map((e, i) => {
                      return (
                        <Paper
                          key={i}
                          sx={{
                            backgroundColor: "white",
                            m: 1,
                            p: 1,
                            width: "250px",
                          }}
                        >
                          <Box>
                            <img
                              src={e.strMealThumb}
                              alt="Image"
                              style={{
                                maxWidth: " 100%",
                                height: "auto",
                              }}
                            />
                          </Box>
                          <Box sx={{ padding: 2, textAlign: "center" }}>
                            <Typography
                              variant="h7"
                              sx={{ fontWeight: "400", fontSize: "24px" }}
                            >
                              {e.strMeal}
                            </Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>

              <Grid></Grid>
            </Container>
          </Container>
        </Box>
        <Dialog
          open={show}
          maxWidth="xl"
          onClose={() => {
            setShow(false);
          }}
        >
          <iframe
            width="1212"
            height="682"
            src={`https://www.youtube.com/embed/${youlink}`}
            title='Croatian Food Recipe - How to make this simple Croatian Walnut Roll "Gužvara"'
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </Dialog>
      </Box>

      <Notification
        text="No meals found"
        status="error"
        isActive={error}
        setActive={setError}
      />
    </>
  );
}

export default RecipeVideiotutorial;
