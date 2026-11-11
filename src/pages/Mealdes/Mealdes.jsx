import { useEffect, useState } from "react";
import { base_url, getMealAPIEndpoint } from "../../config";
import { CSVLink } from "react-csv";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Avatar, Box, Button, Card, Checkbox, Chip, Container, FormControlLabel, Grid, IconButton, Pagination, Stack, Tooltip, Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import moment from "moment";
import AlertComponent from "../../components/ui/Alert/Alert";
import SectionHeading from "../../components/common/SectionHeading";
import FoodImage from "../../components/common/FoodImage";
import { Reveal, Stagger, StaggerItem } from "../../components/common/Motion";
import "./Mealdes.css";

// Meal-type chip colours, matching the planner calendar.
const MEAL_STYLE = {
  Breakfast: { bg: "#FDF3D7", fg: "#7A5600", key: "breakfast" },
  Lunch: { bg: "#E3F1E9", fg: "#1F4D38", key: "lunch" },
  Dinner: { bg: "#FDE6D8", fg: "#9A3412", key: "dinner" },
};

function Mealdes() {
  const navdata = useLocation();
  const userData = navdata?.state?.row;
  const { t } = useTranslation();

  let localdata = localStorage.getItem("items");
  localdata = JSON.parse(localdata);

  const nav = useNavigate();
  const [userid, setUserId] = useState("");
  const [openalert, setOpenAlert] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState();
  const [pagelength, setPageLength] = useState();
  const [todays, setTodays] = useState();
  const [atedish, setAte] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [exportCsvData, setExportCsvData] = useState([]);

  const fetchData = async () => {
    let uid;
    if (userData) {
      setUserId(userData.id);
      uid = userData.id;
    } else {
      uid = localdata?.id;
      setUserId(localdata?.id);
    }

    const today = moment().toDate().getTime();
    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${uid}`);
    let final = await res.json();
    final = final[0]?.meals;

    setExportCsvData(final);

    const result = final?.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });

    const filtered = result?.filter((e) => {
      return new Date(e.start) >= new Date(moment(today).format("YYYY-MM-DD"));
    });

    getRequiredData(filtered);

    setTodays(moment(today).format("YYYY-MM-DD"));
    return filtered;
  };

  const getRequiredData = async (final) => {
    const res = await fetch(`${base_url}${getMealAPIEndpoint}`);
    const data = await res.json();

    if (data.length != final?.length) {
      const result = {};
      for (let i = 0; i < final?.length; i++) {
        if (!result[final[i]?.start]) {
          result[final[i]?.start] = [final[i]];
        } else {
          result[final[i]?.start].push(final[i]);
        }
      }
      const ele = Object.values(result);

      setData(ele.slice(0, 8));

      setPageLength(Math.ceil(ele.length / 7));
    } else {
      const result = {};
      for (let i = 0; i < final.length; i++) {
        if (!result[final[i].start]) {
          result[final[i].start] = [final[i]];
        } else {
          result[final[i].start].push(final[i]);
        }
      }
      const ele = Object.values(result);

      setData(ele);
    }
  };

  const handeldelete = async (i) => {
    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${userid}`);

    let final = await res.json();

    const mealid = final[0]?.id;

    const result = final[0].meals.filter((e) => {
      if (e.start == i.start && e.meal == i.meal) {
        return false;
      }
      return e;
    });

    await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ meals: result }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    fetchData();
  };

  const handleChange = async (event, value) => {
    const final = await fetchData();
    let initalpage = 0;
    let finalpage = 7;
    for (let i = 1; i < value; i++) {
      initalpage = initalpage + 7;
      finalpage = finalpage + 7;
    }

    const getRequiredData1 = (final) => {
      const result = {};
      for (let i = 0; i < final.length; i++) {
        if (!result[final[i].start]) {
          result[final[i].start] = [final[i]];
        } else {
          result[final[i].start].push(final[i]);
        }
      }
      return Object.values(result);
    };

    const ele = getRequiredData1(final);
    const pagi = ele.slice(initalpage, finalpage);

    setData(pagi);
  };

  const change = () => {
    setToggle(!toggle);
    fetchData();
  };

  const oldPlans = async () => {
    setToggle(!toggle);
    const today = moment().toDate().getTime();

    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${userid}`);
    let final = await res.json();

    final = final[0]?.meals;

    const result = final?.sort((a, b) => {
      return new Date(a.start) - new Date(b.start);
    });

    const filtered = result;

    filtered?.forEach((e) => {
      if (new Date(e.start) < new Date(moment(today).format("YYYY-MM-DD"))) {
        e.iatethis = true;
      }
    });

    getRequiredData(filtered);

    setTodays(moment(today).format("YYYY-MM-DD"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ate = async (data) => {
    setAte(!atedish);

    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${userid}`);

    let final = await res.json();
    const mealid = final[0].id;

    final = final[0].meals;

    const result = final.filter((e) => {
      return e.id == data.id;
    });

    result[0].iatethis = "atedish";

    await fetch(`${base_url}${getMealAPIEndpoint}${mealid}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({ meals: final }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    fetchData();
  };

  const headerActions = (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {exportCsvData?.length ? (
        <Button component={CSVLink} data={exportCsvData} variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
          {t("export", "Export CSV")}
        </Button>
      ) : null}
      {toggle ? (
        <Button
          variant="contained"
          startIcon={<HistoryRoundedIcon />}
          onClick={() => {
            oldPlans();
          }}
        >
          {t("view_all_plans", "View all plans")}
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<TodayRoundedIcon />}
          onClick={() => {
            change();
          }}
        >
          {t("todays_plans", "Today's plans")}
        </Button>
      )}
    </Stack>
  );

  return (
    <Container sx={{ pb: { xs: 6, md: 10 } }}>
      <SectionHeading
        overline={t("meal_plans", "Meal plans")}
        title={userData ? `${userData.name}'s meals` : t("your_planned_meals", "Your planned meals")}
        subtitle={
          toggle
            ? t("upcoming_meals_subtitle", "Everything planned from today onwards, grouped by day.")
            : t("all_meals_subtitle", "Every plan, including the meals you've already had.")
        }
        actions={headerActions}
      />

      {data?.length ? (
        <Stack spacing={{ xs: 4, md: 5 }}>
          {data.map((item) => {
            const day = item[0]?.start;
            const isToday = day === todays;
            const isPast = day < todays;
            return (
              <Box key={day} component="section">
                <Reveal>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "rgba(194,65,12,.1)", color: "primary.main" }}>
                      <EventNoteRoundedIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h5" component="h3" className="mealdes-day">
                      {moment(day).format("dddd, MMMM Do YYYY")}
                    </Typography>
                    {isToday && <Chip size="small" color="primary" label={t("today", "Today")} />}
                    {isPast && <Chip size="small" label={t("past", "Past")} />}
                  </Stack>
                </Reveal>

                <Stagger>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {item.map((meal, index) => {
                      const style = MEAL_STYLE[meal.meal] ?? { bg: "#F1ECE6", fg: "#6B5E55" };
                      const eaten = Boolean(meal.iatethis);
                      return (
                        <Grid key={`${meal.meal}-${meal.id ?? index}`} size={{ xs: 12, sm: 6, md: 4 }}>
                          <StaggerItem>
                            <Card
                              className="mealcard"
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                transition: "transform .45s var(--mp-ease), box-shadow .45s",
                                "&:hover": { transform: "translateY(-4px)", boxShadow: "var(--mp-shadow-lg)" },
                                "&:hover img": { transform: "scale(1.05)" },
                              }}
                            >
                              <Box sx={{ position: "relative" }}>
                                <FoodImage
                                  seed={meal.food ?? meal.title}
                                  alt={meal.food ?? ""}
                                  width={640}
                                  ratio="16 / 9"
                                  sx={{ filter: eaten ? "grayscale(.6)" : "none" }}
                                />
                                <Chip
                                  size="small"
                                  label={t(style.key ?? "meal", meal.meal)}
                                  sx={{ position: "absolute", top: 12, left: 12, bgcolor: style.bg, color: style.fg, fontWeight: 700 }}
                                />
                              </Box>

                              <Stack spacing={1} sx={{ p: 2.5, flex: 1 }}>
                                <Typography
                                  variant="h5"
                                  component="h4"
                                  sx={{
                                    textTransform: "capitalize",
                                    textDecoration: eaten ? "line-through" : "none",
                                    color: eaten ? "text.secondary" : "text.primary",
                                  }}
                                >
                                  {meal.food}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {moment(meal.start).format("ddd, D MMM YYYY")}
                                </Typography>
                                <Box sx={{ flex: 1 }} />
                                <Stack
                                  direction="row"
                                  sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, pt: 1, borderTop: "1px solid", borderColor: "divider" }}
                                >
                                  <FormControlLabel
                                    sx={{ mr: 0, "& .MuiFormControlLabel-label": { fontSize: 14, fontWeight: 600 } }}
                                    control={
                                      eaten ? (
                                        <Checkbox disabled checked color="secondary" onChange={() => ate(meal, index)} />
                                      ) : (
                                        <Checkbox color="secondary" onChange={() => ate(meal, index)} />
                                      )
                                    }
                                    label={t("i_ate_this", "I ate this")}
                                  />
                                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                    <Button size="small" endIcon={<ArrowForwardRoundedIcon />} sx={{ minHeight: 34, px: 1.5 }}>
                                      {t("explore_recipe", "Explore recipe")}
                                    </Button>
                                    <Tooltip title={t("delete", "Delete")}>
                                      <IconButton
                                        color="error"
                                        aria-label={t("delete_meal", "Delete meal")}
                                        onClick={() => {
                                          setOpenAlert(true);
                                          setId(meal);
                                        }}
                                      >
                                        <DeleteOutlineRoundedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Card>
                          </StaggerItem>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Stagger>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Reveal>
          <Card sx={{ textAlign: "center", py: { xs: 6, md: 8 }, px: 3 }}>
            <Avatar sx={{ mx: "auto", mb: 2, width: 72, height: 72, bgcolor: "rgba(194,65,12,.1)", color: "primary.main" }}>
              <RestaurantMenuRoundedIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h4" component="h3">
              {t("no_meals_planned", "No meals planned yet")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 440, mx: "auto" }}>
              {t("no_meals_planned_hint", "Head to the planner, pick a day and add breakfast, lunch or dinner. Your plans will show up here.")}
            </Typography>
            {localdata?.role !== "admin" ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<EventNoteRoundedIcon />}
                sx={{ mt: 3 }}
                onClick={() => {
                  nav("/mealplanner");
                }}
              >
                {t("plan_your_meals", "Plan your meals")}
              </Button>
            ) : null}
          </Card>
        </Reveal>
      )}

      {pagelength > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 6 } }}>
          <Pagination count={pagelength} onChange={handleChange} color="primary" shape="rounded" size="large" />
        </Box>
      )}

      <AlertComponent
        text={t("confirm_delete_meal", "Delete this meal?")}
        option1={t("yes", "Yes")}
        option2={t("no", "No")}
        show={openalert}
        setShow={setOpenAlert}
        handeldelete={handeldelete}
        dataid={id}
      />
    </Container>
  );
}

export default Mealdes;
