import { useState, useEffect } from "react";

//config
import { base_url, getUserAPIEndpoint, getLayoutAPIEndpoint } from "../../config";

import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { useTranslation } from "react-i18next";
import AddUserData from "./ActionOnUser";
import AlertComponent from "../ui/Alert/Alert";
import Notification from "../../pages/Notification/Notification";
import SectionHeading from "../common/SectionHeading";

const COLUMN_COUNT = 6;

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
  const [snacktext] = useState("Admin added!");
  const [passwordView, setPasswordView] = useState(false);
  const [pageStyles, setpageStyles] = useState("");

  /////functions operations

  const fetchStyles = async () => {
    const response = await fetch(`${base_url}${getLayoutAPIEndpoint}?module=AllButtons`);
    let styles = await response.json();
    setpageStyles(styles[0]?.styles);
  };

  const userDataApi = async () => {
    let responseUserData = await fetch(`${base_url}${getUserAPIEndpoint}`);
    let responseUserDataJson = await responseUserData.json();

    const userLoginsOnly = responseUserDataJson?.filter((e) => {
      return e.role === "user";
    });
    userLoginsOnly.reverse();
    setUserData(userLoginsOnly);
  };

  ///useEffect
  useEffect(() => {
    userDataApi();
    fetchStyles();
  }, []);

  const handleAddUser = () => {
    setOpenAdd(true);
    setUpdation(false);
  };
  const handleEditUser = (row) => {
    setOpenAdd(true);
    setUpdation(true);
    setSendData(row);
  };

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

  const customBg = pageStyles?.bgColor ? { background: `${pageStyles.bgColor} !important` } : null;

  // Press-and-hold to reveal passwords (mouse and touch).
  const revealHandlers = {
    onMouseDown: () => setPasswordView(true),
    onMouseUp: () => setPasswordView(false),
    onMouseLeave: () => setPasswordView(false),
    onTouchStart: () => setPasswordView(true),
    onTouchEnd: () => setPasswordView(false),
  };

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, flex: "1", minWidth: 0 }}>
      <Container maxWidth="xl">
        <SectionHeading
          overline="Admin"
          title={t("users", "Users")}
          subtitle="Everyone with a member account, their contact details and meal plans."
          actions={
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <Button variant="outlined" startIcon={<RestaurantMenuRoundedIcon />} onClick={() => nav("/allmeals")}>
                {t("all_user_meals", "All user meals")}
              </Button>
              <Button variant="contained" startIcon={<PersonAddAlt1RoundedIcon />} sx={customBg} onClick={handleAddUser}>
                {t("add_user", "Add user")}
              </Button>
            </Stack>
          }
        />

        <Paper sx={{ overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          <TableContainer sx={{ borderRadius: 0 }}>
            <Table aria-label={t("users", "Users")} sx={{ minWidth: 820 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 80 }}>{t("image")}</TableCell>
                  <TableCell>{t("Name")}</TableCell>
                  <TableCell>{t("Email")}</TableCell>
                  <TableCell>{t("contact_details")}</TableCell>
                  <TableCell>{t("Password")}</TableCell>
                  <TableCell align="right">{t("action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData === undefined &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell>
                        <Skeleton variant="circular" width={48} height={48} />
                      </TableCell>
                      {Array.from({ length: COLUMN_COUNT - 1 }, (_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {Array.isArray(userData) && userData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} sx={{ py: 8, textAlign: "center", border: 0 }}>
                      <GroupOutlinedIcon sx={{ fontSize: 44, color: "text.secondary", opacity: 0.6 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        No users yet
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Add a member to get started.
                      </Typography>
                      <Button variant="contained" startIcon={<PersonAddAlt1RoundedIcon />} sx={customBg} onClick={handleAddUser}>
                        {t("add_user", "Add user")}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}

                {userData?.map((row, index) => (
                  <TableRow key={row.id ?? index} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell>
                      <Avatar
                        src={row.ProfileImage || undefined}
                        alt={row.name ?? ""}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "rgba(194,65,12,.1)",
                          color: "primary.main",
                          fontWeight: 700,
                          boxShadow: "0 0 0 2px #fff, 0 0 0 3px rgba(194,65,12,.18)",
                        }}
                      >
                        {row.name?.trim()?.[0]?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", wordBreak: "break-all" }}>{row.email}</TableCell>
                    <TableCell sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{row.phone}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <Typography
                          variant="body2"
                          sx={{ width: 120, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}
                        >
                          {passwordView ? row.password : "••••••••••"}
                        </Typography>
                        <Tooltip title="Hold to reveal">
                          <IconButton size="small" aria-label="Hold to reveal password" {...revealHandlers}>
                            {passwordView ? (
                              <RemoveRedEyeOutlinedIcon fontSize="small" />
                            ) : (
                              <VisibilityOffOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
                        <Tooltip title={t("user_plan", "User plan")}>
                          <IconButton
                            size="small"
                            aria-label={`View ${row.name ?? "user"}'s plan`}
                            onClick={() => {
                              nav("/mealdes", { state: { row } });
                            }}
                          >
                            <RemoveRedEyeOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("edit", "Edit")}>
                          <IconButton size="small" aria-label={`Edit ${row.name ?? "user"}`} onClick={() => handleEditUser(row)}>
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("delete", "Delete")}>
                          <IconButton
                            size="small"
                            color="error"
                            aria-label={`Delete ${row.name ?? "user"}`}
                            onClick={() => {
                              setOpenAlert(true);
                              setId(row.id);
                            }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
      <Notification isActive={isActive} setActive={setActive} text={snacktext} />
    </Box>
  );
}

export default UsersData;
