import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import HTMLViewer from "./HTMLViewer";

const Sidebar = () => {
  const data = [
    { name: "Div", tag: "div" },
    { name: "Image", tag: "img" },
    { name: "Navbar", tag: "nav" },
    { name: "H1", tag: "h1" },
    { name: "H2", tag: "h2" },
    { name: "H3", tag: "h3" },
    { name: "H4", tag: "h4" },
    { name: "H5", tag: "h5" },
    { name: "H6", tag: "h6" },
  ];

  const handleDragStart = (event, name, tag) => {
    event.dataTransfer.setData("name", name);
    event.dataTransfer.setData("tag", tag);
  };

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: "#4a58a8",
        height: "100vh",
        maxHeight: "100vh",
        overflow: "auto",
      }}
    >
      <Box
        display={"flex"}
        alignItems="center"
        sx={{ height: "100px", p: 1, justifyContent: "center" }}
      >
        <Box>
          <Avatar sx={{ mx: "auto" }} />
          <Typography>Jon Doe</Typography>
        </Box>
      </Box>
      {data.map((item, index) => (
        <Box
          key={index}
          draggable
          onDragStart={(event) => handleDragStart(event, item.name, item.tag)}
          sx={{
            m: 1,
            p: 4,
            cursor: "grab",
            border: "1px solid #FFF",
          }}
        >
          <Typography color="#FFF" fontWeight="800" fontFamily="Inter">
            {item.name}
          </Typography>
        </Box>
      ))}

    </Box>
  );
};

export default Sidebar;
