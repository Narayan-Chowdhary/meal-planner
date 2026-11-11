import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { MotionConfig } from "motion/react";

import "./i18n";
import "./index.css";
import "./components/MajorCSS/majorCss.css";
import App from "./App";
import Store from "./Store/Slices/Store";
import theme from "./theme/theme";
import { googleClientId } from "./config";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={Store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Animations automatically tone down for users with "reduce motion" enabled */}
            <MotionConfig reducedMotion="user">
              <App />
            </MotionConfig>
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
