import React, { useState, useEffect } from "react";

//config
import {
  base_url,
  getUserAPIEndpoint,
  getLayoutAPIEndpoint,
} from "../../config";

import {
  Box,
  Typography,
  TextField,
  Container,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DummyImage from "../../assests/dummyimage.webp";
import AddUserData from "./ActionOnUser";
import AlertComponent from "../ui/Alert/Alert";
import Notification from "../../pages/Notification/Notification";
import { useTranslation, initReactI18next } from "react-i18next";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function UsersData() {
  const { t } = useTranslation();

  const nav = useNavigate();

  ///state managment
  const [userData, setUserData] = useState();
  const [openAdd, setOpenAdd] = useState(false);
  const [updations, setUpdation] = useState();
  const [sendData, setSendData] = useState();
  const [id, setId] = useState(0);
  const [openalert, setOpenAlert] = useState(false);
  const [isActive, setActive] = useState(false);
  const [snacktext, setText] = useState("Admin added!");
  const [passwordView, setPasswordView] = useState(false);
  const [pageStyles, setpageStyles] = useState("");

  ///useEffect

  useEffect(() => {
    userDataApi();
    fetchStyles();
  }, []);

  /////functions operations

  const fetchStyles = async () => {
    const response = await fetch(
      `${base_url}${getLayoutAPIEndpoint}?module=AllButtons`
    );
    let styles = await response.json();
    console.log("color button", styles)
    setpageStyles(styles[0]?.styles);
  };

  const userDataApi = async () => {
    let responseUserData = await fetch(`${base_url}${getUserAPIEndpoint}`);
    let responseUserDataJson = await responseUserData.json();

    const userLoginsOnly = responseUserDataJson?.filter((e, i) => {
      return e.role === "user";
    });
    userLoginsOnly.reverse();
    setUserData(userLoginsOnly);
  };

  const handleAddUser = () => {
    setOpenAdd(true);
    setUpdation(false);
  };
  const handleEditUser = (row) => {
    setOpenAdd(true);
    setUpdation(true);
    setSendData(row);
  };
  // const makeAdmin = async (row) => {
  //   let res = await fetch(`${base_url}${getUserAPIEndpoint}${row.id}`);
  //   let final = await res.json();

  //   if (final.role !== "admin") {
  //     await fetch(`${base_url}${getUserAPIEndpoint}${row.id}`, {
  //       method: "PATCH",
  //       mode: "cors",
  //       body: JSON.stringify({ role: "admin" }),
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8",
  //       },
  //     });
  //   } else {
 
  //     setText("Is already an admin.....");
  //   }

  //   userDataApi();
  //   setActive(true);
  // };

  const handleDeleteUser = async (id) => {
    await fetch(`${base_url}${getUserAPIEndpoint}${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    userDataApi();
  };

  return (
    <>
      <Box sx={{ backgroundColor: "#d4d4d4", py: 5, flex: "1" }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "end" }}>
            <Button
              variant="contained"
              className="all_Buttons_in_Page"
              sx={{
                padding: "10px 20px",
                mb: 3,
                mr: 1,
                background: `${pageStyles?.bgColor} !important`,
              }}
              onClick={() => {
                nav("/allmeals");
              }}
            >
              {t("all_user_meals")}
            </Button>

            <Button
              variant="contained"
              className="all_Buttons_in_Page"
              sx={{
                padding: "10px 20px",
                mb: 3,
                background: `${pageStyles?.bgColor} !important`,
              }}
              onClick={handleAddUser}
            >
              {t("add_user")}
            </Button>
          </Box>
          <Box component={Paper}>
            <Table
              aria-label="simple table"
              bodered
              sx={{
                borderRadius: 8,
              }}
            >
              <TableHead sx={{ backgroundColor: "#4b5563" }}>
                <TableRow>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("image")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("Name")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("Email")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("contact_details")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("Password")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("action")}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ display: "none" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "20px", color: "white" }}
                    >
                      {t("plans")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: "#e5e7eb",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <img
                        src={row.ProfileImage ? row.ProfileImage : DummyImage}
                        srcset=""
                        height="80px"
                        width="80px"
                        style={{ borderRadius: "25%" }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "20px" }}
                    >
                      {row.phone}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontSize: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          // justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            width: 120,
                            maxWidth: 120,
                            overflow: "hidden",
                            // border: "1px solid #000",
                          }}
                        >
                          {passwordView ? row.password : "**************"}
                        </Typography>
                        <Box
                          onMouseDown={() => {
                            setPasswordView(true);
                          }}
                          onMouseUp={() => {
                            setPasswordView(false);
                          }}
                        >
                          {passwordView ? (
                            <RemoveRedEyeOutlinedIcon />
                          ) : (
                            <VisibilityOffOutlinedIcon />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Tooltip title={t("user_plan")}>
                        <IconButton
                          onClick={() => {
                            nav("/mealdes", { state: { row } });
                          }}
                        >
                          <RemoveRedEyeOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("edit")}>
                        <IconButton>
                          <ModeEditIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              handleEditUser(row);
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("delete")}>
                        <IconButton>
                          <DeleteIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              setOpenAlert(true);
                              setId(row.id);
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      {/* <AddIcon sx={{ cursor: "pointer" }} onClick={() =>           { makeAdmin (row)}} /> */}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ display: "none" }}
                    >
                      <IconButton
                        onClick={() => {
                          nav("/mealdes", { state: { row } });
                        }}
                      >
                        <RemoveRedEyeOutlinedIcon />
                      </IconButton>
                      {/* <Button
                        variant="contained"
                        className="all_Buttons_in_Page"
                        sx={{ padding: "10px 20px", mb: 3 }}
                        onClick={() => {
                          nav("/mealdes", { state: { row } });
                        }}
                      >
                        {t("user_plan")}
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>
        <AddUserData
          open={openAdd}
          setOpen={setOpenAdd}
          updations={updations}
          setUpdation={setUpdation}
          sendData={sendData}
          userDataApi={userDataApi}
        />
        <AlertComponent
          text="Are sure you want to delete?"
          option1="Yes"
          option2="No"
          show={openalert}
          setShow={setOpenAlert}
          handeldelete={handleDeleteUser}
          dataid={id}
        />
        <Notification
          isActive={isActive}
          setActive={setActive}
          text={snacktext}
        />
      </Box>
    </>
  );
}

export default UsersData;
