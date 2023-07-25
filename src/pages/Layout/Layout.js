import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { Box, Typography } from '@mui/material';
import { Container } from '@mui/material';
import Footer from '../Footer/Footer';
import Header from '../../components/ui/Header/Header';

export default function Layout() {
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {/* <Navbar /> */}
        <Header />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        <Footer />
      </div>
    </>
  );
}
