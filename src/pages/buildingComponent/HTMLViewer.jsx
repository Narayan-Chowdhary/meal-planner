import React, { useState } from "react";
import { Container, Box } from "@mui/material";

const HTMLViewer = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (event) => {
    // event.preventDefault();
    const droppedTag = event.dataTransfer.getData("tag");
    const droppedName = event.dataTransfer.getData("name");
    const newDroppedItem = { tag: droppedTag, name: droppedName };
    setDroppedItems((prevItems) => [...prevItems, newDroppedItem]);
  };

  console.log(droppedItems);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const renderHTMLCode = () => {
    const htmlCode = droppedItems.reduce((code, item) => {
      return code + `<${item.tag}></${item.tag}>`;
    }, "");
return htmlCode ;
    // return { __html: htmlCode };
  };

  return (
    <Container>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: "2px dashed #ccc",
          height: 300,
          p: 2,
          mt: 5,
        }}
      >
        <div
          style={{ height: "100%" }}
          // dangerouslySetInnerHTML={renderHTMLCode()}
          contentEditable
        >
          {renderHTMLCode()}
        </div>
      </Box>
    </Container>
  );
};

export default HTMLViewer;
