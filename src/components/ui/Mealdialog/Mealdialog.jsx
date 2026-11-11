import { useEffect, useState } from "react";
import { base_url, getMealAPIEndpoint } from "../../../config";
import { Box, Button, Grid, MenuItem, Stack, TextField } from "@mui/material";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormDialog from "../../common/FormDialog";

// Colours match the meal chips on the planner calendar (see pages/calender/calendar.css).
const MEAL_TYPES = [
  { value: "Breakfast", key: "breakfast", color: "#E0A100" },
  { value: "Lunch", key: "lunch", color: "#2F6B4F" },
  { value: "Dinner", key: "dinner", color: "#C2410C" },
];

const FORM_ID = "meal-plan-form";

function Mealdialog(props) {
  const { t } = useTranslation();
  let localdata = localStorage.getItem("items");
  localdata = JSON.parse(localdata);

  const showDialog = props.data;
  const show2 = props.data2;
  const enddate = props.end;
  const startdate = props.start;
  const mark = props.mark1;
  let count = 0;
  let str = "";

  // Stored titles look like "Lunch-Paneer tikka"; pull the dish name back out.
  if (mark) {
    for (let i = 0; i < mark?.title.length - 1; i++) {
      if (mark?.title[i] === "-") {
        count = 1;
      }
      if (count == 1) {
        str = str + mark.title[i + 1];
      }
    }
  }

  const [, setData] = useState();

  const findData = async () => {
    const res = await fetch(`${base_url}${getMealAPIEndpoint}`);
    const final = await res.json();

    setData(final);
  };

  const postData = async (values) => {
    const uid = localdata?.id;
    const food = values.title;
    const data = { ...values, time: moment().toDate().getTime() };

    const combine = data.meal + "-" + data.title;

    data.title = combine;
    data.food = food;

    if (data.meal == "Lunch") {
      data.color = "green";
    } else if (data.meal == "Dinner") {
      data.color = "red";
    } else if (data.meal == "Breakfast") {
      data.color = "blue";
    }

    const res = await fetch(` ${base_url}${getMealAPIEndpoint}?userid=${uid}`);

    let final = await res.json();
    if (final.length !== 0) {
      const mealid = final[0]?.id;

      const total_data = final[0].meals;

      total_data.push(data);

      await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify({ meals: total_data }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      showDialog(false);
    } else {
      let mealarr = [];
      mealarr.push(data);

      await fetch(`${base_url}${getMealAPIEndpoint}`, {
        method: "POST",
        body: JSON.stringify({ userid: localdata.id, username: localdata.name, meals: mealarr }),
        headers: {
          "Content-Type": "application/json ; charset=utf-8",
        },
      });
    }

    showDialog(false);
  };

  const updateData = async (mid, values) => {
    const old = mid[0];
    const combine = values.meal + "-" + values.title;

    old.title = combine;
    old.food = values.title;
    old.recipe = values.recipe;

    const uid = localdata?.id;

    const res = await fetch(` ${base_url}${getMealAPIEndpoint}?userid=${uid}`);
    let finaldata = await res.json();

    const mealid = finaldata[0]?.id;
    finaldata = finaldata[0]?.meals;

    const updateData = finaldata.filter((e) => {
      if (e.start == old.start && e.meal == old.meal) {
        return false;
      }
      return e;
    });

    updateData.push(old);

    await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ meals: updateData }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    showDialog(false);
  };

  const sendData = async (values) => {
    const uid = localdata?.id;

    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${uid}`);
    let finaldata = await res.json();
    if (finaldata.length !== 0) {
      finaldata = finaldata[0]?.meals;

      const final = await finaldata.filter((ele) => {
        return ele.start == moment(values.start).format("YYYY-MM-DD");
      });

      if (final.length > 0) {
        const dishdata = final.filter((ele) => {
          return ele.meal == values.meal;
        });
        if (dishdata.length > 0) {
          return updateData(dishdata, values);
        }
      }
      postData(values);
    } else {
      postData(values);
    }
  };

  useEffect(() => {
    findData();
  }, []);

  const EventSchema = Yup.object().shape({
    meal: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    recipe: Yup.string().required("Required"),
  });

  const selectedDate = mark ? mark.start : startdate;
  const subtitle = selectedDate
    ? moment(selectedDate).format("dddd, D MMMM YYYY")
    : t("plan_meal_subtitle", "Choose a meal type, dish and recipe");

  const close = () => {
    showDialog(false);
  };

  return (
    <FormDialog
      open={show2}
      onClose={close}
      title={t("plan_your_meal", "Plan your meal")}
      subtitle={subtitle}
      icon={<EventAvailableRoundedIcon />}
      actions={
        <>
          <Button onClick={close} color="inherit">
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} variant="contained" startIcon={<SaveRoundedIcon />}>
            {mark ? t("update_meal", "Update meal") : t("add_your_meal", "Add your meal")}
          </Button>
        </>
      }
    >
      <Formik
        initialValues={
          mark
            ? {
                meal: mark.meal,
                title: str,
                recipe: mark.recipe,
                // keep the event's own date so an edit is saved on that day, not today
                start: moment(mark.start).format("YYYY-MM-DD"),
                end: moment(mark.end ?? mark.start).format("YYYY-MM-DD"),
              }
            : {
                meal: "",
                title: "",
                recipe: "",
                start: moment(startdate).format("YYYY-MM-DD"),
                end: moment(enddate).format("YYYY-MM-DD"),
              }
        }
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={EventSchema}
        onSubmit={async (values) => {
          sendData(values);
        }}
      >
        {({ values, errors, handleChange }) => (
          <Form id={FORM_ID} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  select
                  label={t("meal_type", "Meal type")}
                  name="meal"
                  value={values.meal ?? ""}
                  onChange={handleChange("meal")}
                  error={Boolean(errors.meal)}
                  helperText={errors.meal}
                >
                  {MEAL_TYPES.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: m.color, flexShrink: 0 }} />
                        <span>{t(m.key, m.value)}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 7 }}>
                <TextField
                  type="text"
                  name="title"
                  label={t("dish", "Dish")}
                  placeholder={t("dish_placeholder", "e.g. Paneer tikka")}
                  value={values.title ?? ""}
                  onChange={handleChange("title")}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  type="text"
                  multiline
                  minRows={6}
                  maxRows={14}
                  name="recipe"
                  label={t("recipe", "Recipe")}
                  placeholder={t("recipe_placeholder", "Ingredients, steps or a link to the recipe")}
                  value={values.recipe ?? ""}
                  onChange={handleChange("recipe")}
                  error={Boolean(errors.recipe)}
                  helperText={errors.recipe}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </FormDialog>
  );
}

export default Mealdialog;
