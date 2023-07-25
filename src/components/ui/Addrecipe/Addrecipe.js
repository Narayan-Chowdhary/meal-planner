import {
  base_url,
  cloudinaryUploadImage_url,
  getFoodAPIEndpoint,

} from "../../../config";


import { useNavigate } from "react-router-dom"
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography, Grid, Container, Paper, } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Formik, Form, FieldArray, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import vegIcon from '../../../assests/veg-icon.png'
import NonvegIcon from '../../../assests/non-veg-icon.png'
import VeganIcon from '../../../assests/green-leaf-icon.png'
import image from "../../../assests/meal.jpg"
import { useTranslation, initReactI18next } from "react-i18next";
import TagsInput from '../Chip/TagInput';
import { useParams } from 'react-router';
import './Addrecipe.css';
import Backdrop from '@mui/material/Backdrop';
import AlertComponent from "../Alert/Alert";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import Notification from "../../../pages/Notification/Notification";


function Addrecipe() {

  const { id } = useParams();

  const { t } = useTranslation()




  const nav = useNavigate();
  const [show,setActive]=useState(false)
  const [circular, setCircular] = useState(false)
  const [datafound, setFoundData] = useState(true)
  const [data, setData] = useState()
  const [imgdata, setImage] = useState()
  const [keywords, setkeywords] = useState([])
  const [keywordData, setKeywordData] = useState([])
  const [showAlert, setShowAlert] = useState(false)






  const sendimg = async (element) => {
    setCircular(true)
    console.log("img")


    // let reader = new FileReader();

    // reader.readAsArrayBuffer(element.target.files[0]);

    // reader.onload = function () {
    //   const data = reader.result
    //   var uint8View = new Uint8Array(data);
    //   console.log(uint8View)
    //   setImage(uint8View)
    // };

    // reader.onerror = function () {
    //   console.log(reader.error);
    // };


    element.preventDefault();
    const formData = new FormData()
    formData.append("file", element.target.files[0])
    formData.append("upload_preset", "mealPlanner")

    const responseImg = await fetch(`${cloudinaryUploadImage_url}`, {
      method: "post",
      body: formData,
    });
    const getImage = await responseImg.json()
    let FinalImageKey = await getImage.url
    if (FinalImageKey) {
      setCircular(false)
    }
    console.log(FinalImageKey)
    setActive(true)
    setImage(FinalImageKey)
  }

  const EventSchema = Yup.object().shape({


    title: Yup.string().min(4, 'too short')
      .max(20, "Title too long")
      .required('Cannot be empty'),
    description: Yup.string()
      .required('Cannot be empty')
      .max(250, "maximum limit reached"),

    calories: Yup.string()
      .max(3, "Maximum limit reached")
      .required('Cannot be empty'),
    Steps: Yup
      .array()
      .of(
        Yup.object().shape({
          step: Yup.string().required("Cannot be empty"),

        })
      )
      .required(1, "Step is required"),

    Ingredient: Yup
      .array()
      .of(
        Yup.object().shape({
          title: Yup.string().required("Cannot be empty"),

        })
      )
      .required("Ingredient is required"),



    mealCatogary: Yup.string().required('Cannot be empty'),


  });

  function handleSelecetedTags(items) {

    setkeywords(items)
  }

  const sendData = async (values) => {
    let obj2 = { ...values }
    if (!obj2.calories) {
      obj2.calories = obj2.calories + "/" + obj2.caloriesdes

    }
    console.log("keywords", keywords)
    obj2.keyword = keywords
    if (keywordData) {
      console.log("hello.....................", keywordData)
      obj2.keyword = keywordData

      console.log("object", obj2)
    }
    obj2.id = uuidv4()

    for (let i = 0; i < obj2.Ingredient.length; i++) {

      obj2.Ingredient[i].order = i + 1
    }
    for (let i = 0; i < obj2.Steps.length; i++) {

      obj2.Steps[i].order = i + 1
    }

    obj2.img = imgdata
    console.log("Imagedata", imgdata)

    obj2.like = 0
    obj2.dislike = 0



    console.log(obj2)


    if (id !== ":id") {
      console.log("PATCH")
      setTimeout(async () => {
        await fetch(`${base_url}${getFoodAPIEndpoint}${id}`, {
          method: "PATCH",
          mode: "cors",
          body: JSON.stringify(obj2),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }).then(() => {
          nav("/recipeSuggestionPage");
        });
      }, 2000)
      setShowAlert(true)




    } else {
      console.log("POST")
      setTimeout(async () => {
        await fetch(`${base_url}${getFoodAPIEndpoint}`, {
          method: 'POST',
          body: JSON.stringify(obj2),
          headers: {
            "Content-Type": "application/json ; charset=utf-8"
          }
        }).then(() => { nav("/recipeSuggestionPage") })
      }, 2000)
      setShowAlert(true)

    }

  }


  const findFood = async (id) => {
    const res = await fetch(`${base_url}${getFoodAPIEndpoint}${id}`)
    const final = await res.json()

    setData(final)
    setFoundData(false)
  }

  useEffect(() => {
    if (id !== ":id") {
      findFood(id)


    } else {
      setData({})
      setFoundData(true)
    }
  }, [id])
  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  return (
    <Box
      sx={{
        // backgroundColor:"#bae6fd",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {console.log(datafound, "datafound")}
      <Container sx={{ p: 2 }}>
        <Box sx={{ p: 5, borderRadius: 8, background: "#FFFFFF" }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                paddingTop: "10px",
              }}
            >
              {datafound ? t("add_your_recipe") : "Update Your Recipe"}
            </Typography>
            {datafound && (
              <Typography
                align="right"
                fontSize={12}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => {
                  nav("/add-recipe-csv");
                }}
              >
                (Upload via csv)
              </Typography>
            )}
          </Box>
            <Box>
              <Formik
                initialValues={
                  datafound
                    ? {
                      id: "",
                      img: "",
                      title: "",
                      description: "",
                      calories: "",
                      Steps: [{ step: "" }],
                      mealCatogary: "",
                      Ingredient: [{ title: "" }],
                      caloriesdes: "",
                      keyword: "",
                    }
                    : {
                      id: data.id,
                      img: "",
                      title: data.title,
                      description: data.description,
                      calories: data.calories,
                      Steps: data.Steps ? data.Steps : [{ step: "" }],
                      mealCatogary: data.mealCatogary,
                      Ingredient: data.Ingredient
                        ? data.Ingredient
                        : [{ title: "" }],
                      caloriesdes: data.caloriesdes ? data.caloriesdes : "100",
                      keyword: data.keyword,
                    }
              }
              validateOnChange={false}
              validateOnBlur={false}
              validationSchema={EventSchema}
              onSubmit={async (values) => {
                sendData(values);
              }}
              enableReinitialize
            >
              {({ values, errors, handleChange, setFieldValue }) => (
                <Form onKeyDown={onKeyDown}>
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", ml: "19px", mb: 1 }}
                      >
                        {t("title")}
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
                        <TextField
                          type="text"
                          name="title"
                          error={errors.title}
                          value={values.title}
                          onChange={handleChange("title")}
                          helperText={errors.title}
                          InputProps={{
                            sx: {
                              paddingLeft: "10px",
                              fontFamily: "Inter !important",
                            },
                          }}
                        />
                      </FormControl>
                    </Box>

                    

                    <Box sx={{ mb: 2, overflow: "auto"}}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", ml: "19px", mb: 1 }}
                        >
                          {t("description")}
                        </Typography>

                        <FormControl fullWidth>
                          <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
                          <TextField
                            variant="outlined"
                            type="text"
                            name="description"
                            error={errors.description}
                            value={values.description}
                            onChange={handleChange("description")}
                            helperText={errors.description}
                            InputProps={{
                              sx: {
                                paddingLeft: "10px",
                                fontFamily: "Inter !important",
                              },
                            }}
                          />
                        </FormControl>
                      </Box>
                      <Box sx={{ mb: 2}}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", ml: "19px", mb: 1 }}
                        >
                          {t("ingredients")}
                        </Typography>

                        <FieldArray
                          sx={{ flexGrow: 1 }}
                          name="Ingredient"
                          render={(arrayHelpers) => {
                            return (
                              <Box sx={{maxHeight: "85px",overflow: "auto"}}>
                                {values.Ingredient?.map((e, i) => {
                                  return (
                                    <Box
                                      key={i}
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Box sx={{ flexGrow: 1 }}>
                                        <FormControl fullWidth>
                                          <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
                                          <TextField
                                            value={values.Ingredient?.[i]?.title}
                                            variant="standard"
                                            type="text"
                                            name={`Ingredient[${i}].title`}
                                            error={
                                              !!errors.Ingredient?.[i]?.title
                                            }
                                            helperText={
                                              errors.Ingredient?.[i]?.title
                                            }
                                            InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  {i + 1}.
                                                </InputAdornment>
                                              ),
                                            }}
                                            onChange={handleChange(
                                              `Ingredient[${i}].title`
                                            )}
                                          />
                                        </FormControl>
                                      </Box>
                                      <Box sx={{ display: "flex" }}>
                                        {i == 0 ? (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              marginLeft: "10px",
                                            }}
                                          >
                                            <AddIcon
                                              onClick={() => {
                                                arrayHelpers.insert(
                                                  values.Ingredient.length,
                                                  {
                                                    title: "",
                                                  }
                                                );
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          ""
                                        )}

                                        <Box sx={{}}>
                                          {i > 0 ? (
                                            <DeleteIcon
                                              onClick={() => {
                                                arrayHelpers.remove(i);
                                              }}
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </Box>
                                      </Box>
                                      {/* <Box>
                                      {i == 0 ? (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginLeft: "10px",
                                          }}
                                        >
                                          <Button
                                            variant="contained"
                                            className="cardButton"
                                            sx={{ padding: "10px 20px" }}
                                            onClick={() => {

                                              arrayHelpers.insert(
                                                values.Ingredient.length,
                                                {
                                                  title: "",
                                                }
                                              );
                                            }}

                                          >

                                            Add
                                          </Button>
                                        
                                        </Box>
                                      ) : (
                                        ""
                                      )}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "center",
                                      
                                        }}
                                      >
                                        {i > 0 ? (
                                          <Button
                                            variant="contained"
                                            className="cardButton"
                                            sx={{ padding: "10px 20px" }}
                                            onClick={() => {

                                              arrayHelpers.remove(i)
                                            }}

                                          >

                                            Remove
                                          </Button>

                                        ) : (
                                          ""
                                        )}
                                      </Box>
                                    </Box> */}
                                    </Box>
                                  );
                                })}
                              </Box>
                            );
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2,  }}>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ mr: 3, fontWeight: "bold", ml: "19px", mb: 1 }}
                          >
                            {t("steps")}
                          </Typography>
                        </Box>

                        <Box sx={{maxHeight: "85px",overflow: "auto"}}>
                          <FieldArray
                            name="Steps"
                            render={(arrayHelpers) => {
                              return (
                                <Box>
                                  {values.Steps?.map((e, i) => {
                                    return (
                                      <Box
                                        key={i}
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <Box sx={{ flexGrow: 1 }}>
                                          <FormControl fullWidth>
                                            <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
                                            <TextField
                                              value={values.Steps?.[i]?.step}
                                              variant="standard"
                                              type="text"
                                              name={`Steps[${i}].step`}
                                              error={!!errors.Steps?.[i]?.step}
                                              helperText={errors.Steps?.[i]?.step}
                                              InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">
                                                    {i + 1}.
                                                  </InputAdornment>
                                                ),
                                              }}
                                              onChange={handleChange(
                                                `Steps[${i}].step`
                                              )}
                                            />
                                          </FormControl>
                                        </Box>

                                        <Box sx={{ display: "flex" }}>
                                          {i == 0 ? (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginLeft: "10px",
                                              }}
                                            >
                                              <AddIcon
                                                onClick={() => {
                                                  arrayHelpers.insert(
                                                    values.Steps.length,
                                                    {
                                                      step: "",
                                                    }
                                                  );
                                                }}
                                              />
                                            </Box>
                                          ) : (
                                            ""
                                          )}
                                          {/* <Box sx={{ marginLeft: "10px" }}></Box> */}
                                          <Box>
                                            {i > 0 ? (
                                              <DeleteIcon
                                                onClick={() => {
                                                  arrayHelpers.remove(i);
                                                }}
                                              />
                                            ) : (
                                              ""
                                            )}
                                          </Box>
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              );
                            }}
                          />

                          {/* <ErrorMessage name="Steps" component="div" /> */}
                        </Box>
                      </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", ml: "19px" }}
                        >
                          {t("keywords")}
                        </Typography>
                        <Tooltip title="Press space to add keywords">
                          <IconButton sx={{ color: "black" }}>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <FormControl fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
                        <TagsInput
                          selectedTags={handleSelecetedTags}
                          fullWidth
                          variant="outlined"
                          placeholder={
                            data?.keyword ? "Update keywords" : "Add keyword"
                          }
                          data={data?.keyword}
                          fun={setKeywordData}
                        />
                      </FormControl>
                    </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", ml: "19px", mb: 1 }}
                        >
                          {t("meal_category")}
                        </Typography>

                        <FormControl sx={{ minWidth: "100%" }}>
                          <Select
                            value={values.mealCatogary?values.mealCatogary:'Veg'}
                            error={errors.mealCatogary}
                            onChange={handleChange("mealCatogary")}
                            inputProps={{
                              sx: {
                                ml: 1,
                                height: "12px",
                              },
                            }}
                          >
                            <MenuItem
                              value="Veg"
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  height: "24px",
                                }}
                              >
                                {t("veg")}

                                <Typography sx={{ mt: 1 }}>
                                  <img src={vegIcon} alt="" height="30px" />
                                </Typography>
                              </Box>
                            </MenuItem>
                            <MenuItem
                              value="Nonveg"
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  height: "24px",
                                }}
                              >
                                {t("non_veg")}

                                <Typography sx={{ mt: 1 }}>
                                  {" "}
                                  <img
                                    src={NonvegIcon}
                                    alt=""
                                    height="30px"
                                    weight="30"
                                  />
                                </Typography>
                              </Box>
                            </MenuItem>
                            <MenuItem
                              value="Vegan"
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  height: "24px",
                                }}
                              >
                                {t("vegan")}
                                <Typography sx={{ mt: 1 }}>
                                  {" "}
                                  <img
                                    src={VeganIcon}
                                    alt=""
                                    height="30px"
                                    weight="30"
                                  />
                                </Typography>
                              </Box>
                            </MenuItem>
                          </Select>

                          <FormHelperText>{errors.mealCatogary}</FormHelperText>
                        </FormControl>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", ml: "19px", mb: 1, mt: 1 }}
                        >
                          {" "}
                          {t("calories")}
                        </Typography>
                        <Box sx={{ ml: 4, mt: 1 }}>
                          <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>

                            <TextField
                              variant="outlined"
                              type="number"
                              name="calories"
                              error={errors.calories}
                              value={values.calories}
                              onChange={handleChange("calories")}
                              helperText={errors.calories}
                            />
                          </FormControl>

                          {datafound ? (
                            <FormControl sx={{ ml: 4 }}>
                              <TextField
                                variant="outlined"
                                type="number"
                                label="perkg-pergm"
                                name="caloriesdes"
                                error={errors.caloriesdes}
                                value={values.caloriesdes}
                                onChange={handleChange("caloriesdes")}
                                helperText={errors.caloriesdes}
                              />

                              <FormHelperText>
                                {errors.caloriesdes}
                              </FormHelperText>
                            </FormControl>
                          ) : (
                            ""
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", ml: 1, mb: 1 }}
                        >
                          {t("upload_image")}
                        </Typography>
                        <Box sx={{ ml: 4, mt: 1 }}>
                          <label
                            for="files"
                            className="all_Buttons_in_Page"
                            style={{
                              padding: "12px 20px",
                              color: "white",
                              marginTop: "8px",
                            }}
                          >
                            <input
                              type="file"
                              id="files"
                              onChange={sendimg}
                              style={{ display: "none" }}
                            />

                            {t("upload_image")}
                          </label>
                        </Box>

                        <Box sx={{ display: "flex", mt: 3, ml: 2 }}>
                          <Backdrop
                            sx={{
                              color: "#fff",
                              zIndex: (theme) => theme.zIndex.drawer + 1,
                            }}
                            open={circular}
                          >
                            <CircularProgress color="inherit" />
                          </Backdrop>
                        </Box>
                      </Box>

                    </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          className="all_Buttons_in_Page"
                          sx={{ padding: "10px 20px",width:'200px' }}
                          type="submit"
                        >
                          {t("add_recipe")}
                        </Button>
                      </Box>
                      </Box>
                  </Form>
                )}
              </Formik>
            </Box>
        </Box>
      </Container>

      <AlertComponent
        text="Recipe Updated"
        option2="Ok"
        show={showAlert}
        setShow={setShowAlert}
      />
      <Notification
        text={"image uploaded"}
        isActive={show}
        setActive={setActive}
      />
    </Box>
  );


}

export default Addrecipe
