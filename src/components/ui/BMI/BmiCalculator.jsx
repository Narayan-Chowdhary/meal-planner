import React, { useEffect, useState } from 'react';
import {
  base_url,
  cloudinaryUploadImage_url,
  getLayoutAPIEndpoint,
  getUserAPIEndpoint,
} from "../../../config";

import './BmiCalculator.css'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Typography, Button, Box, TextField, Autocomplete } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux'



function BmiCalculator(props) {


    const openBmi = props.sendBmi
    const setOpenBmi = props.sendBmi1
    // const getBmi = useSelector((state) => state.storeBmi)
    // const dispatch = useDispatch()

    const [bmi, setBmi] = useState()
    const [showbmi, setShowBmi] = useState(false)
    const [items, setItems] = useState();

    const BmiSchema = Yup.object().shape({
        height: Yup.string()
            .required('Height Required'),

        weight: Yup.string()
        .required('Weight Required'),

    });



    useEffect(() => {

        const items = JSON.parse(localStorage.getItem('items'));
        if (items) {
            setItems(items);
        }
    }, []);



    const dataChange = async () => {
        localStorage.clear();

        let dataOfLogin = await fetch(
          `${base_url}${getUserAPIEndpoint}${items.id}`
        );
        let resOfLogin = await dataOfLogin.json()     
        localStorage.setItem('items', JSON.stringify(resOfLogin))
        setItems(resOfLogin)
    }




    const handleCancel = () => {
        setOpenBmi(false)
        setBmi('')
        setShowBmi(false)
    }




    const bmiData = async (res) => {
        console.log("bmi data", bmi)
        await fetch(`${base_url}${getUserAPIEndpoint}${items.id}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify({ bmi: res }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        dataChange()
    }




    return (
        <>


            <Dialog onClose={handleCancel} open={openBmi}   >

                <Box sx={{ color: "white" }}>

                    <DialogTitle className="bmiBackground">
                        <Box sx={{ display: "flex", justifyContent: "end" }}>
                            <CloseIcon onClick={handleCancel} />
                        </Box>
                        <Typography variant="h3" sx={{ fontFamily: "Cabin Sketch", textAlign: "center" }}> BMI Calculator</Typography>
                        <Box >
                            <Formik
                                initialValues={{
                                    height: '',
                                    weight: "",
                                }}
                                validationSchema={BmiSchema}
                                validateOnChange={false}
                                onSubmit={ (values) => {
                                    let height1 = values.height;
                                    let weight1 = values.weight;
                                    let bmiRes = weight1 / (height1 * height1)
                                    let res = Math.round(bmiRes)
                                    setShowBmi(true)
                                    console.log(res,"res")
                                    setBmi(res)
                                    bmiData(res) 
                                   
                                    
                                    


                                }}
                            // onSubmit={(values) => { dispatch(calculate()) }}

                            >
                                {({
                                    values,
                                    errors,
                                    handleChange,


                                }) => (
                                    <Form>

                                        <Box sx={{ height: "35vh", width: "20vw", pt: 5 }}>
                                            <Box sx={{ textAlign: "center" }}>
                                                <Box sx={{ mb: 3 }} >


                                                    <FormControl>
                                                        <Box className="input_Box_Bmi">
                                                            <Typography variant="h5"> Height</Typography>
                                                            <TextField
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        color: 'white',

                                                                    },
                                                                }}
                                                                InputProps={{
                                                                    style: {
                                                                        color: "white",
                                                                        background: "transparent"
                                                                    }
                                                                }}
                                                                label="in Meters"
                                                                name="height"
                                                                type="number"
                                                                width={10}
                                                                value={values.height}
                                                                error={errors.height}
                                                                helperText={errors.height}
                                                                onChange={handleChange("height")}
                                                            />
                                                        </Box>
                                                    </FormControl>
                                                </Box>

                                                <Box >


                                                    <FormControl>
                                                        <Box className="input_Box_Bmi">
                                                            <Typography variant="h5"> Weight</Typography>
                                                            <TextField
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        color: 'white',

                                                                    },
                                                                }}
                                                                InputProps={{
                                                                    style: {
                                                                        color: "white"
                                                                    }
                                                                }}
                                                                label="in Kg"
                                                                name="weight"
                                                                type="number"
                                                                width={10}
                                                                value={values.weight}
                                                                error={errors.weight}
                                                                helperText={errors.weight}                                                        

                                                                onChange={handleChange("weight")}
                                                            />
                                                        </Box>
                                                    </FormControl>
                                                </Box>

                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "center", gap: "30px", pt: 5 }}>
                                                <Button variant='contained' className="all_Buttons_in_Page" type='submit' sx={{ px: 3, py: 1 }}   >Calculate</Button>
                                            </Box>


                                            {showbmi ?
                                                <Box sx={{ pt: 2 }}>
                                                    <Typography >{`your new Bmi is    ${bmi}`}
                                                    </Typography>
                                                </Box>
                                                : <Box sx={{ pt: 2 }}>
                                                    <Typography >{items.bmi ? `Previously calculated bmi  ${items.bmi}` : `your new Bmi is:-   ${bmi}`}
                                                    </Typography>
                                                </Box>}
                                        </Box>

                                    </Form>)

                                }
                            </Formik>

                        </Box>

                    </DialogTitle>




                </Box>
            </Dialog>
        </>
    )
}

export default BmiCalculator
















