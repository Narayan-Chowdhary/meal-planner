import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import Mealdialog from "../../components/ui/Mealdialog/Mealdialog";
import SectionHeading from "../../components/common/SectionHeading";
import { Reveal } from "../../components/common/Motion";
import { base_url, getMealAPIEndpoint } from "../../config";
import "./calendar.css";

// Stored event colours -> meal-type chip classes (see calendar.css).
// Mealdialog saves Breakfast as "blue", Lunch as "green", Dinner as "red"; past meals are "white".
const EVENT_CLASS = {
  blue: "mp-event mp-event--breakfast",
  green: "mp-event mp-event--lunch",
  red: "mp-event mp-event--dinner",
  white: "mp-event mp-event--past",
};

const LEGEND = [
  { key: "breakfast", label: "Breakfast", color: "#E0A100" },
  { key: "lunch", label: "Lunch", color: "#2F6B4F" },
  { key: "dinner", label: "Dinner", color: "#C2410C" },
];

/** Month-view date number: muted for past days, emphasised for today (via .rbc-now). */
function DateHeader({ label, date, drilldownView, onDrillDown }) {
  const className = moment(date).isBefore(moment(), "day") ? "mp-date mp-date--past" : "mp-date";
  if (!drilldownView) return <span className={className}>{label}</span>;
  return (
    <button type="button" className={`rbc-button-link ${className}`} onClick={onDrillDown}>
      {label}
    </button>
  );
}

const CALENDAR_COMPONENTS = { month: { dateHeader: DateHeader } };

function Calender() {
  let localdata = localStorage.getItem("items");
  localdata = JSON.parse(localdata);

  const nav = useNavigate();
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const locala = momentLocalizer(moment);
  const [mealData, setMealData] = useState();
  const [startD, startSet] = useState("");
  const [endD, endSet] = useState("");
  const [mark, setMark] = useState();
  const [todayd, setToday] = useState();

  const handleSelect = ({ start, end }) => {
    startSet(start);
    endSet(end);
    setMark("");

    if (moment(start).format("YYYY-MM-DD") >= todayd) {
      setShow(true);
    }
  };

  const fetchData = async () => {
    const uid = localdata?.id;
    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${uid}`);
    let final = await res.json();
    if (final.length !== 0) {
      final = final[0]?.meals;

      const today = moment().toDate().getTime();

      const filtered = final?.filter((e) => {
        return new Date(e.start) < new Date(moment(today).format("YYYY-MM-DD"));
      });

      filtered.forEach((e) => {
        e.color = "white";
      });
      setMealData(final);
    }
  };

  const showData = async (mealData) => {
    startSet(mealData.start);
    endSet(mealData.end);
    setMark(mealData);
    setShow(true);
  };

  useEffect(() => {
    fetchData();
    const today = new Date();
    setToday(moment(today).format("YYYY-MM-DD"));
  }, [show]);

  return (
    <Container sx={{ pb: { xs: 6, md: 10 } }}>
      <SectionHeading
        overline={t("plan_ahead", "Plan ahead")}
        title={t("meal_planner", "Meal planner")}
        subtitle={t(
          "meal_planner_subtitle",
          "Pick a day to plan breakfast, lunch or dinner. Tap a planned meal to edit it."
        )}
        actions={
          <Button
            variant="contained"
            startIcon={<ListAltRoundedIcon />}
            onClick={() => {
              nav("/mealdes");
            }}
          >
            {t("meal_details", "Meal details")}
          </Button>
        }
      />

      <Reveal>
        <Card sx={{ p: { xs: 1.5, sm: 2.5, md: 3 } }}>
          <Stack
            direction="row"
            sx={{ flexWrap: "wrap", gap: { xs: 1.5, sm: 2.5 }, mb: 2, px: 0.5 }}
            aria-label="Meal colour legend"
          >
            {LEGEND.map((item) => (
              <Stack key={item.key} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  {t(item.key, item.label)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Box className="mp-calendar" sx={{ height: { xs: "68vh", md: "75vh" }, minHeight: { xs: 480, md: 600 } }}>
            <Calendar
              views={["agenda", "month"]}
              selectable
              localizer={locala}
              defaultDate={new Date()}
              events={mealData}
              defaultView="month"
              style={{ height: "100%" }}
              components={CALENDAR_COMPONENTS}
              onSelectEvent={(mealData) => {
                showData(mealData);
              }} //planned event data;
              onSelectSlot={handleSelect} //date block
              dayPropGetter={(start) => {
                if (moment(start).format("YYYY-MM-DD") < todayd) {
                  return { className: "mp-past-day" };
                }
              }}
              eventPropGetter={(mealData) => {
                const className = EVENT_CLASS[mealData.color];
                if (className) return { className };
              }}
            />
          </Box>
        </Card>
      </Reveal>

      <Mealdialog
        data={setShow}
        data2={show}
        start={startD}
        end={endD}
        mark1={mark}
      />
    </Container>
  );
}

export default Calender;
