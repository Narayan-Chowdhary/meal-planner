import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Box, CircularProgress } from "@mui/material";
import Footer from "../Footer/Footer";
import Header from "../../components/ui/Header/Header";
import { PageTransition } from "../../components/common/Motion";

export default function Layout() {
  const { pathname } = useLocation();

  // Start each page at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, pt: { xs: 3, md: 5 } }}>
        <Suspense
          fallback={
            <Box data-testid="page-loader" sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          }
        >
          <PageTransition key={pathname}>
            <Outlet />
          </PageTransition>
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
}
