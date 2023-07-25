import { Box, Button, Container } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import image from "../../assests/meal.jpg";
import Mealdialog from "../../components/ui/Mealdialog/Mealdialog";
import { base_url, getMealAPIEndpoint } from "../../config";
import "./calendar.css";

function Calender() {
  let localdata = localStorage.getItem("items");
  localdata = JSON.parse(localdata);

  const nav = useNavigate();

  const [show, setShow] = useState(false);
  const locala = momentLocalizer(moment);
  const [mealData, setMealData] = useState();
  const [startD, startSet] = useState("");
  const [endD, endSet] = useState("");
  const [mark, setMark] = useState();
  const [todayd, setToday] = useState();

  let uid;
  const handleSelect = ({ start, end }) => {
    startSet(start);
    endSet(end);
    setMark("");

    if (moment(start).format("YYYY-MM-DD") >= todayd) {
      setShow(true);
    }
  };

  const fetchData = async () => {
    uid = localdata?.id;
    const res = await fetch(`${base_url}${getMealAPIEndpoint}?userid=${uid}`);
    let final = await res.json();
    if (final.length !== 0) {
      final = final[0]?.meals;

      const today = moment().toDate().getTime();

      const filtered = final?.filter((e) => {
        return new Date(e.start) < new Date(moment(today).format("YYYY-MM-DD"));
      });

      filtered.map((e) => {
        e.color = "white";
      });
      setMealData(final);
    } else {
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
    <>
      <Box
        sx={{
          backgroundImage: `url(${image})`,
          p: 2,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Container maxWidth="xl" sx={{ backgroundColor: "white" }}>
          <Calendar
            views={["agenda", "month"]}
            selectable
            localizer={locala}
            defaultDate={new Date()}
            events={mealData}
            defaultView="month"
            style={{ height: "100vh" }}
            onSelectEvent={(mealData) => {
              showData(mealData);
            }} //planned event data;
            onSelectSlot={handleSelect} //date block
            dayPropGetter={(start) => {
              if (moment(start).format("YYYY-MM-DD") < todayd) {
                return {
                  style: {
                    backgroundColor: "#efe8e8",
                  },
                };
              }
            }}
            eventPropGetter={(mealData) => {
              if (mealData.color === "green") {
                const backgroundColor = "#86efac";
                return { style: { color: "black", backgroundColor } };
              } else if (mealData.color === "red") {
                const backgroundColor = "#bef264";
                return { style: { color: "black", backgroundColor } };
              } else if (mealData.color === "blue") {
                const backgroundColor = "#93c5fd";
                return { style: { color: "black", backgroundColor } };
              } else if (mealData.color === "white") {
                const backgroundColor = "white";
                return { style: { color: "black", backgroundColor } };
              }
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, p: 1 }}>
            <Button
              variant="contained"
              className="all_Buttons_in_Page"
              sx={{ padding: "10px 20px" }}
              onClick={() => {
                nav("/mealdes");
              }}
            >
              Meal details
            </Button>
          </Box>
        </Container>

        <Mealdialog
          data={setShow}
          data2={show}
          start={startD}
          end={endD}
          mark1={mark}
        />
      </Box>
    </>
  );
}

export default Calender;
