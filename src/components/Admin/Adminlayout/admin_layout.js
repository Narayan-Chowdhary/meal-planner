import React, { useState, useEffect } from "react";
import { base_url, getLayoutAPIEndpoint } from "../../../config";
import "./admin_layout.css";
import { Typography, Box, Button, Container, Paper } from "@mui/material";
import Notification from "../../../pages/Notification/Notification";
function AdminLayout() {
  const [modules, setModules] = useState([]);
  const [notification, setNotification] = useState({
    open:false,
    text:"",
    status:"error"
  });

  const fetchStyles = async () => {
    const response = await fetch(`${base_url}${getLayoutAPIEndpoint}`);
    let styles = await response.json();
    setModules(styles);
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handelLayoutUpdate = async (id) => {
    const filterData = modules?.find((e) => e.id == id);
    const updateData = await fetch(`${base_url}${getLayoutAPIEndpoint}${id}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(filterData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    let result = await updateData.json();
          setNotification({ ...notification, open: true,text:"Layout Updated",status:"success" });
          setTimeout(()=>{
            window.location.reload()
          },100)

  };

  return (
    <>
      <Box mt={5} sx={{ p: 2 }}>
        <Typography
          sx={{
            fontFamily: "Intern",
            fontSize: "30px",
            fontWeight: 500,
          }}
        >
          Layout
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {modules?.map((v, i) => (
            <Paper
              elevation={12}
              sx={{
                p: 2,
                m: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Intern",
                  fontSize: "22px",
                }}
              >
                {v?.module}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={"column"}
              >
                <Box>
                  {Object.keys(v?.styles)?.map((s, ind) => (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width={300}
                      m={1}
                    >
                      <Typography textTransform={"capitalize"}>{s}</Typography>
                      <Typography>
                        <input
                          type="color"
                          value={v?.styles[s]}
                          onChange={(e) => {
                            const updatedStyles = {
                              ...v.styles,
                              [s]: e.target.value,
                            };
                            const updatedModules = modules.map((m) => {
                              if (m.module === v.module) {
                                return { ...m, styles: updatedStyles };
                              }
                              return m;
                            });
                            setModules(updatedModules);
                          }}
                        />
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handelLayoutUpdate(v?.id);
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
      <Notification
        text={notification?.text}
        status={notification?.status}
        isActive={notification?.open}
        setActive={() => {
          setNotification({ ...notification, open: false });
        }}
      />
    </>
  );
}
export default AdminLayout;