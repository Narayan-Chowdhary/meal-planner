import React, { useState } from "react";
import { Container, Box } from "@mui/material";

const Layout = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedTag = event.dataTransfer.getData("tag");
    const droppedName = event.dataTransfer.getData("name");
    const newDroppedItem = { tag: droppedTag, name: droppedName };
    setDroppedItems((prevItems) => [...prevItems, newDroppedItem]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: "2px dashed #ccc",
          minHeight: 300,
          p: 2,
          mt: 5,
        }}
      >
        {droppedItems.map((item, index) => (
          <Box
            key={index}
            as={item.tag}
            sx={{ backgroundColor: "#4a58a8", color: "#fff", p: 2, mb: 2 }}
          >
            {item.name}
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Layout;
