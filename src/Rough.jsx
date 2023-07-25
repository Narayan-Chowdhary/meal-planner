// import logo from './logo.svg';
// import { useState } from "react";
// import './App.css';

// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import i18next from 'i18next';
// import { useTranslation, initReactI18next } from "react-i18next";

// function Rough() {
//     const { t } = useTranslation()
//     const languages = [
//         {
//             code: 'es',
//             name: 'Espanol',
//             country_code: 'es',
//         },
//         {
//             code: 'en',
//             name: 'English',
//             country_code: 'gb',
//         },

//     ]


//     const handleChange = (event) => {
//         const val = event.target.value
//         console.log(val)
//         i18next.changeLanguage(val)


//     };
//     return (
//         <div className="App">
//             <Box sx={{ minWidth: 120, mt: 4 }}>
//                 <FormControl >

//                     <Select
//                         labelId="demo-simple-select-label"
//                         id="demo-simple-select"


//                         onChange={handleChange}
//                     >
//                         {
//                             languages.map((e, i) => {
//                                 return <MenuItem key={i} value={e.code}>{e.name}</MenuItem>
//                             })
//                         }



//                     </Select>
//                 </FormControl>


//                 <h2>{t('Welcome to React')}</h2>
//             </Box>

//         </div>
//     );
// }

// export default Rough;
// import React, { useState, useEffect } from 'react'


// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import AlertComponent from '../ui/Alert/Alert';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import Divider from '@mui/material/Divider';
// import ListItemText from '@mui/material/ListItemText';
// import Pagination from '@mui/material/Pagination';
// import { Box, Button, Grid, Container, TextField, IconButton, Input, Paper } from '@mui/material'

// import image from "../../../src/assests/meal.jpg"


// function Allmeals() {
//     const [data, setData] = useState([])


//     // let [initalpage,setInitalpage]=useState(0)
//     // let [finalpage, setFinalpage ] = useState(5)



//     const fetchData = async () => {

//         const res = await fetch("http://localhost:8000/meals")
//         const final = await res.json()
//         console.log(final)
//         setData(final)
//     }

//     useEffect(() => { fetchData() }, [])

//     // const handleChange=(e,value)=>{


//     //     for (let i = 1; i < value; i++) {
//     //         initalpage = initalpage + 5
//     //         finalpage = finalpage + 5
//     //     }
//     //     // setInitalpage(initalpage)
//     //     // setFinalpage(finalpage)
//     //     console.log("adadasd",initalpage,finalpage)
//     // }


//     return (
//         <Box sx={{
//             // backgroundColor:"#bae6fd",
//             backgroundImage: `url(${image})`,
//             backgroundSize: "cover", backgroundPosition: "center", height: "100%", width: "100%", py: 2
//         }}>
//             <Container maxWidth="xl" >
//                 <Paper sx={{ backgroundColor: "white", p: 2 }}>
//                     <Typography className='font_Headline_Welcome' sx={{ color: "black" }}>All User Meals</Typography>

//                     {data?.map((e, i) => {

//                         return (
//                             <Accordion key={i} sx={{ my: 2 }}>
//                                 <AccordionSummary
//                                     expandIcon={<ExpandMoreIcon />}

//                                 >

//                                     <Typography variant='h6' className='Typography_Heading'>{i + 1}.{e.username}</Typography>
//                                 </AccordionSummary>
//                                 <AccordionDetails>



//                                     <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

//                                         {e?.meals.length !== 0 ? e?.meals.map((ele, i) => {
//                                             return <><Box>

//                                             </Box>
//                                                 <ListItem alignItems="flex-start" sx={{ my: 2 }}>

//                                                     <ListItemText
//                                                         primary={

//                                                             <React.Fragment>
//                                                                 <Typography
//                                                                     variant='h5'
//                                                                     sx={{ color: ele.color, }} className='all_Descriptions'
//                                                                 >
//                                                                     {i + 1}.{ele.meal}
//                                                                 </Typography>

//                                                             </React.Fragment>



//                                                         }
//                                                         secondary={
//                                                             <React.Fragment>
//                                                                 <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//                                                                     <Typography
//                                                                         sx={{ color: "black" }} className='all_Descriptions'
//                                                                     >
//                                                                         {ele.food}
//                                                                     </Typography>
//                                                                     <Typography
//                                                                         sx={{ color: "black" }} className='all_Descriptions'
//                                                                     >
//                                                                         {ele.start}
//                                                                     </Typography>
//                                                                 </Box>


//                                                             </React.Fragment>
//                                                         }
//                                                     />

//                                                 </ListItem>
//                                                 <Divider sx={{ color: "blue" }} />

//                                             </>
//                                         }) : <Box>
//                                             <Box>
//                                                 <Typography variant='h4' className='headingtext' sx={{
//                                                     fontSize: "25px",
//                                                     fontWeight: "600",
//                                                     fontFamily: "Inter",
//                                                     textAlign: "center"
//                                                 }}>
//                                                     Oops!  No Meals Found
//                                                 </Typography>
//                                             </Box>

//                                         </Box>}

//                                         {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px", p: 1 }}>
//                                             <Pagination count={3}
//                                                 onChange={handleChange} /></Box> */}
//                                     </List>


//                                 </AccordionDetails>
//                             </Accordion>
//                         )
//                     })}
//                 </Paper>
//             </Container>
//         </Box>
//     )
// }

// export default Allmeals
