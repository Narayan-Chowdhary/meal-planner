import { React, useEffect, useState } from 'react'
import {
  base_url,
  getFoodAPIEndpoint,
  getMealAPIEndpoint,
} from "../../../config";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Box, Typography, Grid, } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import moment from "moment";
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';



function Mealdialog(props) {
    let localdata = localStorage.getItem('items')
    localdata = JSON.parse(localdata)

    const showDialog = props.data
    const show2 = props.data2
    const enddate = props.end
    const startdate = props.start
    const mark = props.mark1
    let count = 0
    let str = ""
    let uid;

    if (mark) {

        for (let i = 0; i < mark?.title.length - 1; i++) {

            if (mark?.title[i] === "-") {
                count = 1


            }
            if (count == 1) {
                str = str + mark.title[i + 1]

            }
        }
    
    }





    const [data, setData] = useState()

    const findData = async () => {
        const res = await fetch(`${base_url}${getMealAPIEndpoint}`)
        const final = await res.json()
       
        setData(final)
    }



    const postData = async (values) => {
        
        uid = localdata?.id
        const food = values.title
        const data = { ...values, "time": moment().toDate().getTime() }

        const combine = data.meal + "-" + data.title

        data.title = combine
        data.food = food

        if (data.meal == "Lunch") {

            data.color = "green"
        } else if (data.meal == "Dinner") {

            data.color = "red"
        } else if (data.meal == "Breakfast") {

            data.color = "blue"

        }
      

        const res = await fetch(
          ` ${base_url}${getMealAPIEndpoint}?userid=${uid}`
        );

        let final = await res.json()
        if(final.length!==0){
        
            const mealid = final[0]?.id
       
            const total_data = final[0].meals



            total_data.push(data)





            await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
              method: "PATCH",
              mode: "cors",
              body: JSON.stringify({ meals: total_data }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            });

            // await fetch("http://localhost:8000/meals", {
            //     method: 'POST',
            //     body: JSON.stringify(data),
            //     headers: {
            //         "Content-Type": "application/json ; charset=utf-8"
            //     }
            // })




            showDialog(false)
        }else{


            // {
            //     "id": 1,
            //         "userid": "42984ea9-bb4c-4df7-a7d5-1d3577b231b1",
            //             "meals": [
            //                 {
            //                     "meal": "Lunch",
            //                     "title": "Lunch-aalu",
            //                     "recipe": "adatr",
            //                     "start": "2023-07-08",
            //                     "end": "2023-07-09",
            //                     "time": 1688618094062,
            //                     "food": "aalu",
            //                     "color": "green"
            //                 }
            //             ]
            // }
            let mealarr=[]
         
            // const userIdformeals =localdata.id
            // const userNameformeals = localdata.name
            mealarr.push(data)
        
             await fetch(`${base_url}${getMealAPIEndpoint}`, {
                method: 'POST',
                body: JSON.stringify({"userid":localdata.id,"username":localdata.name,"meals":mealarr}),
                headers: {
                    "Content-Type": "application/json ; charset=utf-8"
                }
            })
            
        }
       
        showDialog(false)

    }

    const updateData = async (mid, values) => {

        const old = mid[0]
        // const old = mid
        // const food = values.title
        const combine = values.meal + "-" + values.title
      
        old.title = combine
        old.food = values.title
        old.recipe = values.recipe

        uid = localdata?.id
      
        const res = await fetch(
          ` ${base_url}${getMealAPIEndpoint}?userid=${uid}`
        );
        let finaldata = await res.json()
  
        const mealid = finaldata[0]?.id
        finaldata = finaldata[0]?.meals
     
  
        
        const updateData= finaldata.filter((e) => {
            if (e.start == old.start && e.meal == old.meal){
              
              }else{
                return e
              }
        })
   
        updateData.push(old)




        await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify({ meals: updateData }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
    

        //  old[0].food=values.title
        //  mid[0].combine = values.meal + "-" + values.title
        // // old[0].recipe=values.recipe
    
        // await fetch(`http://localhost:8000/meals/${id1}`,
        //     {
        //         method: 'PATCH',
        //         mode: 'cors',
        //         body: JSON.stringify({ title: combine, food: food, recipe: values.recipe }),
        //         headers: {
        //             'Content-type': 'application/json; charset=UTF-8',
        //         },
        //     }

        // )

        showDialog(false)

    }








    const sendData = async (values) => {


        uid = localdata?.id
     
        const res = await fetch(
          `${base_url}${getMealAPIEndpoint}?userid=${uid}`
        );
        let finaldata = await res.json()
        if(finaldata.length!==0){
            finaldata = finaldata[0]?.meals
       
            const final = await finaldata.filter((ele) => {

             
                return ele.start == moment(values.start).format('YYYY-MM-DD')
            })
        

            if (final.length > 0) {
       
                const dishdata = final.filter((ele) => { return ele.meal == values.meal })
                if (dishdata.length > 0) {
   
                    return updateData(dishdata, values)
                }


            }
            postData(values)

        }else{
            postData(values)
        }
      


    }
    useEffect(() => {
        findData()


    }, [])


    const EventSchema = Yup.object().shape({
        meal: Yup.string()
            .required('Required'),
        title: Yup.string().required('Required'),
        recipe: Yup.string().required('Required'),
    });
    return (
        <Dialog open={show2} onClose={() => {

            showDialog(false);
        }} >
            <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Box></Box>
                <Box sx={{ paddingRight: "5px", paddingTop: "5px" }}>
                    <CloseIcon onClick={() => { showDialog(false) }} />

                </Box>
            </Box>
            <DialogTitle>
                <Box>
                    <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }} >
                        Plan Your Meal
                    </Typography>

                </Box>
                <Box>
                    <Formik
                        initialValues={mark ? {
                            meal: mark.meal,
                            title: str,
                            recipe: mark.recipe,


                        } : {
                            meal: '',
                            title: "",
                            recipe: "",
                            start: moment(startdate).format('YYYY-MM-DD'),
                            end: moment(enddate).format('YYYY-MM-DD')

                        }
                        }
                        validateOnChange={false}
                        validateOnBlur={false}
                        validationSchema={EventSchema}
                        onSubmit={async (values) => {
                            sendData(values)


                        }}
                    >
                        {({
                            values,
                            errors,
                            handleChange,


                        }) => (
                            <Form>

                                <Box sx={{ height: "600px", width: "500px", margin: "20px" }}>

                                    <Box >
                                        <Typography variant="h6" sx={{ ml: 2, mr: 2, mt: 1, mb: 1, fontWeight: "bold" }} >
                                            Select your Meal
                                        </Typography>

                                        <FormControl sx={{ ml: 1, mb: 1, minWidth: "97%" }}>
                                            {/* <InputLabel id="demo-simple-select-label">{"Meal"}</InputLabel> */}
                                            <Select

                                                value={values.meal}

                                                error={errors.meal}
                                                onChange={handleChange("meal")}

                                            >
                                                <MenuItem value="Breakfast" sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                        Breakfast
                                                        <Box sx={{ ml: 1, backgroundColor: "#93c5fd", height: "12px", width: "12px", borderRadius: "50%" }}></Box>
                                                    </Box>

                                                </MenuItem>
                                                <MenuItem value="Lunch" sx={{ display: "flex", justifyContent: "space-between" }} >
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}> Lunch

                                                        <Box sx={{ ml: 1, backgroundColor: "#86efac", height: "12px", width: "12px", borderRadius: "50%" }}></Box>
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="Dinner" sx={{ display: "flex", justifyContent: "space-between" }} >
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>Dinner
                                                        <Box sx={{ ml: 1, backgroundColor: "#bef264", height: "12px", width: "12px", borderRadius: "50%" }}></Box>
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                            <FormHelperText>{errors.meal}</FormHelperText>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                        <Typography variant="h6" sx={{ ml: 2, mr: 2, mt: 1, fontWeight: "bold" }} >
                                            Dish
                                        </Typography>

                                        <FormControl fullWidth sx={{ ml: 1, mr: 1, mt: 1 }}>

                                            <TextField
                                                type="text"
                                                name="title"
                                                error={errors.title}


                                                value={values.title}
                                                onChange={handleChange("title")}
                                                helperText={errors.title}

                                            />
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                        <Typography variant="h6" sx={{ ml: 2, mr: 2, mt: 1, fontWeight: "bold" }} >
                                            Recipe
                                        </Typography>

                                        <FormControl fullWidth sx={{ ml: 1, mr: 1, mt: 1 }}>
                                            <InputLabel htmlFor="outlined-adornment-amount" ></InputLabel>
                                            <TextField

                                                type="text"
                                                multiline
                                                rows={10}
                                                name="recipe"
                                                error={errors.recipe}
                                                value={values.recipe}
                                                onChange={handleChange("recipe")}
                                                helperText={errors.recipe}

                                            />
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "center", margin: "30px" }}>
                                        <Button variant='contained' type='submit' sx={{ p: 2 }}   >Add Your meal</Button>



                                    </Box>



                                </Box>

                            </Form>)

                        }
                    </Formik>
                </Box>

            </DialogTitle>





        </Dialog>
    )
}

export default Mealdialog



// ///    let toggle = 0
// const res = await fetch(" http://localhost:8000/meals")
// const final = await res.json()

// const found = final.filter(a => { return a.end == gstart })

// found.find(b => {
//     if (b.meal == values.meal) {

//         toggle = 1
//     }
// })
// if (toggle == 0) {
//     const food = values.title
//     const data = { ...values, "time": moment().format('YYYY-MM-DD') }

//     const combine = data.meal + "-" + data.title

//     data.title = combine
//     data.food = food

//     if (data.meal == "Lunch") {

//         data.color = "green"
//     } else if (data.meal == "Dinner") {

//         data.color = "red"
//     } else if (data.meal == "Breakfast") {

//         data.color = "blue"

//     }

//     await fetch("http://localhost:8000/meals", {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             "Content-Type": "application/json ; charset=utf-8"
//         }
//     })
//         .then()


//     freestate("")
//     showDialog(false)



// } else {
//     const res = await fetch(" http://localhost:8000/meals")
//     const final = await res.json()

//     const found = final.filter(a => { return a.end == gstart })

//     found.find(b => {
//         if (b.meal == values.meal) {

//             const update = async (id) => {
//                 const food = values.title
//                 const data = { ...values, "time": moment().format('YYYY-MM-DD') }

//                 const combine = data.meal + "-" + data.title

//                 data.title = combine
//                 data.food = food

//                 if (data.meal == "Lunch") {

//                     data.color = "green"
//                 } else if (data.meal == "Dinner") {

//                     data.color = "red"
//                 } else if (data.meal == "Breakfast") {

//                     data.color = "blue"

//                 }
//                 await fetch(`http://localhost:8000/meals/${id}`,
//                     {
//                         method: 'PATCH',
//                         mode: 'cors',
//                         body: JSON.stringify({ title: combine, food: food }),
//                         headers: {
//                             'Content-type': 'application/json; charset=UTF-8',
//                         },
//                     }
//                 )
//             }
//             update(b.id)
//         }
//     })
//  
//     freestate("")
//     showDialog(false)


// }