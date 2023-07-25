import { Box } from '@mui/material'
import React, { useState } from "react";
import Layout from './Layout'
import Sidebar from './Sidebar'
import HTMLViewer from "./HTMLViewer";


function BuildComp() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Sidebar />
        {/* <Layout /> */}
        <HTMLViewer />
      </Box>
    </Box>
  );
}

export default BuildComp