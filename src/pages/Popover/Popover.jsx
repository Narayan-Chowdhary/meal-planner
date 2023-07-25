import React, { useState, useEffect } from "react";

import { useTranslation, initReactI18next } from "react-i18next";
import { Box, Typography, Grid, Popover, Divider, Button } from "@mui/material";

import Image from "../../assests/cahrt.png";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CircleIcon from "@mui/icons-material/Circle";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";


import moment from "moment";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  onValue,
  set,
  remove,
} from "firebase/database";

//firebase Data
const firebaseConfig = {
  databaseURL: "https://meal-planner-390411-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);

function PopoverNotification(props) {
  const { t } = useTranslation();
  
  const DataFromFireBase = props.DataFromFireBase;
  console.log("check 4", DataFromFireBase);
  const database = props.database;
  const getNotification = props.notification 
  const getProductsDetailsFromFirebase = props.productDetailsFromFirebase;
 const  setAnchorEl = props.setAnchorEl
 const fetchNotifications = props.fetchNotifications

  const handleIsRead = async (users0, users1) => {
    const postData = {
      ...users1,
      is_read: true,
    };
    const updates = {};
    updates["mealplanner/" + users0] = postData;    

    return update(ref(database), updates);
  };

  const handleReadAll = async (users) => {
    if (users.length > 0) {
      let updates = {};
      Object.keys(users).forEach((key) => {
        const value = users[key];
        updates[`mealplanner/${value[0]}/is_read`] = true;
      });
      return update(ref(database), updates);
    }
  };

  const deleteAllNotifications = () => {
    const db = getDatabase();

    const tasksRef = ref(db, "mealplanner");
    remove(tasksRef).then(() => {
      console.log("Notification removed");
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: "350px",
          maxWeight: "360px",
        }}
      >
        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5"> Notifications</Typography>
          <IconButton aria-label="delete">
            <CloseIcon onClick={() => setAnchorEl(false)} />
          </IconButton>
        </Box>
        <Divider />
        {getNotification ? (
          <Box>
            <Box sx={{}}>
              {DataFromFireBase?.map((users, index) => (
                <Box>
                  {console.log("users", users[1].is_read)}
                  <Box
                    key={index}
                    onClick={async() => {await handleIsRead(users[0], users[1]) 
                      fetchNotifications();   
                    }
                  }
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      backgroundColor:
                        users[1].is_read == true ? "white" : "#bfdbfe",
                    }}
                  >
                    <Box sx={{ pr: 2 }}>
                      <img
                        src={
                          users[1].ProfileImage ? users[1].ProfileImage : Image
                        }
                        height="40px"
                        width="40px"
                        style={{ borderRadius: "50%" }}
                      />
                    </Box>
                    <Box>
                      <Typography>
                        {" "}
                        {`${t("new_user")}`} <b>{users[1].name}</b>{" "}
                        {`${t("added")}`}
                      </Typography>
                      {/* {moment(date).fromNow()} */}
                    </Box>
                    <Divider />
                  </Box>
                </Box>
              ))}
            </Box>

            {/* <Box sx={{}}>
              {DataFromFireBase?.map((users, index) => (
                <Box>
                  <Box
                    key={index}
                    onClick={() => handleIsRead(users[0], users[1])}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      backgroundColor:
                        users[1].is_read == true ? "white" : "#bfdbfe",
                    }}
                    >
                    <Box sx={{ pr: 2 }}>
                      <img
                        src={users[1].Image ? users[1].image : Image}
                        height="40px"
                        width="40px"
                        style={{ borderRadius: "50%" }}
                      />
                    </Box>
                    {/* {/* <Box>
                      <Typography>
                        {" "}
                        {`${t("new_Product")}`} <b>{users[1].title}</b>{" "}
                        {`${t("added")}`}
                      </Typography>
                      {/* {moment(date).fromNow()} 
                    </Box> 
                    <Divider /> 
                  </Box>
                </Box>
              ))}
            </Box> */}
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                height: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NotificationsOffIcon sx={{ fontSize: 80 }} color="disabled" />
              <Typography varaint="h6">No New Notification</Typography>
            </Box>
          </Box>
        )}
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Button
              onClick={() => {
                handleReadAll(DataFromFireBase);
              }}
            >
              Mark All Read
            </Button>
          </Box>
          <Box>
            <Button onClick={deleteAllNotifications}>Delete All</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default PopoverNotification;
