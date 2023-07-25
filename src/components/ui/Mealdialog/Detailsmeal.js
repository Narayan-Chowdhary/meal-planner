// import React from 'react'

// function Detailsmeal() {
//   return (
//       <Dialog open={show2} >
//           <Box sx={{ display: "flex", justifyContent: "end" }}>
//               <Box></Box>
//               <Box >
//                   <CloseIcon onClick={() => showDialog(false)} />

//               </Box>
//           </Box>
//           <DialogTitle>
//               <Box>
//                   <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }} >
//                       Food planner
//                   </Typography>

//               </Box>
//               <Box>
//                   <Formik
//                       initialValues={{
//                           meal: '',
//                           title: "",
//                           start: startdate,
//                           end: enddate

//                       }}
//                       validationSchema={EventSchema}
//                       onSubmit={async (values) => {
//                           const data = { ...values, "time": moment().toDate().getTime() }
//                           console.log(data)

//                           await fetch("http://localhost:8000/meals", {
//                               method: 'POST',
//                               body: JSON.stringify(data),
//                               headers: {
//                                   "Content-Type": "application/json ; charset=utf-8"
//                               }
//                           })
//                               .then(res => res.json())



//                       }}
//                   >
//                       {({
//                           values,
//                           errors,
//                           handleChange,


//                       }) => (
//                           <Form>

//                               <Box sx={{ height: "300px", width: "400px", margin: "20px" }}>

//                                   <Box sx={{ display: "flex", flexWrap: "wrap" }}>
//                                       <Typography variant="h6" sx={{ ml: 2, mr: 2, mt: 1, fontWeight: "bold" }} >
//                                           Select your Meal
//                                       </Typography>

//                                       <FormControl sx={{ ml: 1, mr: 1, mb: 1, minWidth: 120 }}>
//                                           <InputLabel id="demo-simple-select-label">Meal</InputLabel>
//                                           <Select

//                                               value={values.meal}
//                                               label="meal"
//                                               onChange={handleChange("meal")}

//                                           >
//                                               <MenuItem value="Breakfast">Breakfast</MenuItem>
//                                               <MenuItem value="Lunch">Lunch</MenuItem>
//                                               <MenuItem value="Dinner">Dinner</MenuItem>
//                                           </Select>
//                                           <FormHelperText>{errors.meal}</FormHelperText>
//                                       </FormControl>
//                                   </Box>

//                                   <Box sx={{ display: "flex", flexWrap: "wrap" }}>
//                                       <Typography variant="h6" sx={{ ml: 2, mr: 2, mt: 1, fontWeight: "bold" }} >
//                                      Update 
//                                       </Typography>

//                                       <FormControl fullWidth sx={{ ml: 1, mr: 1, mt: 1 }}>
//                                           <InputLabel htmlFor="outlined-adornment-amount" ></InputLabel>
//                                           <TextField
//                                               type="text"
//                                               name="title"

//                                               value={values.title}
//                                               onChange={handleChange("title")}
//                                               helperText={errors.title}

//                                           />
//                                       </FormControl>
//                                   </Box>

//                                   <Box sx={{ display: "flex", justifyContent: "center", margin: "30px" }}>
//                                       <Button variant='contained' type='submit' sx={{ p: 2 }}   >Delete Your meal</Button>



//                                   </Box>



//                               </Box>

//                           </Form>)

//                       }
//                   </Formik>
//               </Box>

//           </DialogTitle>





//       </Dialog>
//   )
// }

// export default Detailsmeal
