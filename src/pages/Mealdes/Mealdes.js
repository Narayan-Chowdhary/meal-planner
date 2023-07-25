import { React, useEffect, useState } from 'react'
import {
  base_url,
  getMealAPIEndpoint,
  
  getUserAPIEndpoint,
} from "../../config";
import { CSVLink, CSVDownload } from "react-csv";

import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, Container } from '@mui/material/';
import AlertComponent from "../../components/ui/Alert/Alert"
import { Box, Typography, Grid, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";
import image from "../../assests/meal.jpg"

import Checkbox from '@mui/material/Checkbox';

import CardContent from '@mui/material/CardContent';
import "./Mealdes.css"
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';


function Mealdes() {
    const navdata = useLocation()
    const userData = navdata?.state?.row


    let localdata = localStorage.getItem('items')
    localdata = JSON.parse(localdata)
   
    const nav = useNavigate()
    const [userid, setUserId] = useState("")
    const [alertsub, setAlertSubmit] = useState(false)
    const [openalert, setOpenAlert] = useState(false)
    const [id, setId] = useState()
    const [data, setData] = useState()
    const [pagelength, setPageLength] = useState()
    const [todays, setTodays] = useState()
    const [atedish, setAte] = useState(true)
    const [toggle, setToggle] = useState(true)
    const [exportCsvData, setExportCsvData] = useState([])


    let uid
    const fetchData = async () => {

        if (userData) {
            setUserId(userData.id)
            uid = userData.id
        } else {
        
            uid = localdata?.id

            setUserId(localdata?.id)


        }
 
        const today = moment().toDate().getTime()
        const res = await fetch(
          `${base_url}${getMealAPIEndpoint}?userid=${uid}`
        );
        let final = await res.json()
        final = final[0]?.meals
        
         setExportCsvData(final)

        const result = final?.sort((a, b) => {
            return new Date(a.start) - new Date(b.start)

        })
       
        const filtered = result?.filter((e) => { return new Date(e.start) >= new Date(moment(today).format('YYYY-MM-DD')) })
     

        getRequiredData(filtered)

        setTodays(moment(today).format('YYYY-MM-DD'))
        return filtered
    }



    const getRequiredData = async (final) => {
        const res = await fetch(`${base_url}${getMealAPIEndpoint}`)
        const data = await res.json()
     
        if (data.length != final?.length) {
            const result = {};
            for (let i = 0; i < final?.length; i++) {
                if (!result[final[i]?.start]) {
                    result[final[i]?.start] = [final[i]]
                } else {
                    result[final[i]?.start].push(final[i])
                }
            }
            const ele = Object.values(result)
         
            setData(ele.slice(0, 8))

            setPageLength(Math.ceil(ele.length / 7))
        } else {
            const result = {};
            for (let i = 0; i < final.length; i++) {
                if (!result[final[i].start]) {
                    result[final[i].start] = [final[i]]
                } else {
                    result[final[i].start].push(final[i])
                }
            }
            const ele = Object.values(result)
          
            setData(ele)

        }

    }






    const handeldelete = async (i) => {
      
      
        const res = await fetch(
          `${base_url}${getMealAPIEndpoint}?userid=${userid}`
        );

        let final = await res.json()
      
        const mealid = final[0]?.id
     

     
        // const result = final[0].meals.filter((e) => {
        //     return e.id !== i
        // })

        const result = final[0].meals.filter((e) => {
            if (e.start == i.start && e.meal == i.meal) {

            } else {
                return e
            }
        })


        await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify({ meals: result }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        fetchData()


    }

    const handleChange = async (event, value) => {
        // const res = await fetch(" http://localhost:8000/meals")
        // const final = await res.json()
        const final = await fetchData()
        let initalpage = 0
        let finalpage = 7
        for (let i = 1; i < value; i++) {
            initalpage = initalpage + 7
            finalpage = finalpage + 7
        }

     

        const getRequiredData1 = (final) => {
            const result = {};
            for (let i = 0; i < final.length; i++) {
                if (!result[final[i].start]) {
                    result[final[i].start] = [final[i]]
                } else {
                    result[final[i].start].push(final[i])
                }
            }
            return Object.values(result)
        }

        const ele = getRequiredData1(final)
        const pagi = ele.slice(initalpage, finalpage)
     
        setData(pagi)
    };

    const change = () => {
        setToggle(!toggle)
        fetchData()
    }



    const oldPlans = async () => {
        setToggle(!toggle)
        const today = moment().toDate().getTime()
    
        const res = await fetch(
          `${base_url}${getMealAPIEndpoint}?userid=${userid}`
        );
        let final = await res.json()

        final = final[0]?.meals


        const result = final?.sort((a, b) => {
            return new Date(a.start) - new Date(b.start)

        })
     
        const filtered = result


        filtered?.map((e) => {
            if (new Date(e.start) < new Date(moment(today).format('YYYY-MM-DD'))) {
                e.iatethis = true
            }
        })
       


        getRequiredData(filtered)
        // setData(ele.slice(0, 8))


        setTodays(moment(today).format('YYYY-MM-DD'))

    }


    useEffect(() => {

;


        fetchData()

    }, [])


    const ate = async (data, index) => {
        setAte(!atedish)
       
        const res = await fetch(
          `${base_url}${getMealAPIEndpoint}?userid=${userid}`
        );

        let final = await res.json()
        const mealid = final[0].id
       
        final = final[0].meals
       
        const result = final.filter((e) => {
            return e.id == data.id
        })

        result[0].iatethis = "atedish"
       


        // await fetch(`http://localhost:8000/meals/${data.id}`,
        await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify({ meals: final }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        fetchData()
     
    }
 
    // const handleExport =()=>{
  
    // }
    return (
      <>
        <Box>
          <Box
            sx={{
              backgroundImage: `url(${image})`,
              py: 2,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
              minHeight: "800px",
            }}
          >
            <Container maxWidth={"xl"} sx={{ backgroundColor: "white" }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: 3,
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h4"
                  className="headingtext"
                  sx={{
                    fontSize: "32px",
                    fontWeight: "600",
                    fontFamily: "Inter",
                  }}
                >
                  {userData ? `${userData.name}'s Meals` : "PLAN YOUR MEAL"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "30px",
                  paddingLeft: "10px",
                }}
              >
                <Box>
               { exportCsvData?.length ? <CSVLink data={exportCsvData}>
                    <Button
                      variant="contained"
                      className="all_Buttons_in_Page"
                     
                    >
                      {" "}
                      Export{" "}
                    </Button>
                  </CSVLink>  : null
                }
                </Box>
                <Box>
                  {toggle ? (
                    <Button
                      variant="contained"
                      className="all_Buttons_in_Page"
                      onClick={() => {
                        oldPlans();
                      }}
                      sx={{ padding: "10px 20px" }}
                    >
                      View All Plans
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className="all_Buttons_in_Page"
                      onClick={() => {
                        change();
                      }}
                      sx={{ padding: "10px 20px" }}
                    >
                      Today's Plans{" "}
                    </Button>
                  )}
                </Box>
              </Box>
              <Box>
                {data?.length ? (
                  data?.map((item, index) => {
                    return (
                      <Container key={index} maxWidth="xxl">
                        <Box sx={{ backgroundColor: "white", my: 3 }}>
                          <Box
                            sx={{
                              padding: "0px 2px 2px 2px",
                              border: "1px solid blue",
                              borderRadius: "5px ",
                            }}
                          >
                            <Box sx={{ backgroundColor: "#F5F5F5", py: 3 }}>
                              <Typography
                                variant="h7"
                                className="text"
                                sx={{
                                  fontWeight: "600",
                                  fontSize: "24px",
                                  ml: 1,
                                }}
                              >
                                {moment(item[0]?.start).format(
                                  "dddd, MMMM Do YYYY"
                                )}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                marginBottom: "2%",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent:
                                  item.length == 3
                                    ? "space-between"
                                    : "flex-start",
                              }}
                            >
                              <Grid container spacing={2}>
                                {item.map((data, index) => {
                                  return (
                                    <Grid item xs={12} sm={6} md={4}>
                                      <Card
                                        key={index}
                                        className="mealcard"
                                        sx={{ width: "100%", mt: 2 }}
                                        elevation={2}
                                      >
                                        <CardContent>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <Typography
                                              variant="h5"
                                              gutterBottom
                                              sx={{
                                                fontFamily: "Inter",
                                                fontWeight: "800",
                                                color: data.color,
                                                textDecoration: data.iatethis
                                                  ? "line-through"
                                                  : "none",
                                              }}
                                            >
                                              {data.meal}
                                            </Typography>
                                            <FormGroup>
                                              {data.iatethis ? (
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      disabled={true}
                                                      checked={true}
                                                      onChange={() =>
                                                        ate(data, index)
                                                      }
                                                    />
                                                  }
                                                  label="I Ate This"
                                                />
                                              ) : (
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      onChange={() =>
                                                        ate(data, index)
                                                      }
                                                    />
                                                  }
                                                  label="I Ate This"
                                                />
                                              )}
                                            </FormGroup>
                                          </Box>

                                          <Typography
                                            variant="h5"
                                            component="div"
                                            sx={{
                                              textDecoration: data.iatethis
                                                ? "line-through"
                                                : "none",
                                            }}
                                          >
                                            {data.food}
                                          </Typography>
                                          <Typography
                                            sx={{ mb: 1.5 }}
                                            color="text.secondary"
                                          ></Typography>
                                          <Typography variant="body2">
                                            0 Calories
                                            <br />
                                          </Typography>
                                        </CardContent>
                                        <Box sx={{ padding: "8px" }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <Box sx={{ marginBottom: "2%" }}>
                                              <Button
                                                variant="contained"
                                                className="all_Buttons_in_Page"
                                                sx={{ padding: "10px 20px" }}
                                              >
                                                Explore Recipe{" "}
                                              </Button>
                                            </Box>

                                            <Box>
                                              <DeleteIcon
                                                sx={{ ml: 2, mt: 2 }}
                                                onClick={() => {
                                                  setOpenAlert(true);
                                                  setId(data);
                                                }}
                                              ></DeleteIcon>
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Box>
                          </Box>
                        </Box>
                      </Container>
                    );
                  })
                ) : (
                  <Box>
                    <Box>
                      <Typography
                        variant="h4"
                        className="headingtext"
                        sx={{
                          fontSize: "25px",
                          fontWeight: "600",
                          fontFamily: "Inter",
                          textAlign: "center",
                        }}
                      >
                        Oops! No Meals Found
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                    >
                      {localdata.role !== "admin" ? (
                        <Button
                          variant="contained"
                          className="all_Buttons_in_Page"
                          onClick={() => {
                            nav("/mealplanner");
                          }}
                          sx={{ padding: "10px 20px" }}
                        >
                          Plan Your Meals{" "}
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "30px",
                    p: 1,
                  }}
                >
                  <Pagination count={pagelength} onChange={handleChange} />
                </Box>
              </Box>
            </Container>
          </Box>
          <AlertComponent
            text="Are  you sure you  want to delete?"
            option1="Yes"
            option2="No"
            show={openalert}
            setShow={setOpenAlert}
            handeldelete={handeldelete}
            dataid={id}
          />
        </Box>
      </>
    );
}

export default Mealdes
