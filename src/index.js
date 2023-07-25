import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assests/fonts/Pacifico/Pacifico-Regular.ttf';


import { StyledEngineProvider, } from '@mui/material';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Store from './Store/Slices/Store'
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// import ada from "../src/assests/locales"
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi) // passes i18n down to react-i18next
  .init({

    // resources: {
    //   en: {
    //     translation: {
    //       "Welcome to React": "Welcome to React and react-i18next"
    //     }
    //   },
    //   es: {
    //     translation: {
    //       "Welcome to React": "rfth"
    //     }
    //   },
    // },
  fallbackLng: "es",
 
    detection: {
      order: ['localStorage', 'sessionStorage', 'path', 'subdomain'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },

  });



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="519144819851-rtb5nr0kc4ro9kuptoj2ivjc3em0fca3.apps.googleusercontent.com">

    <React.StrictMode>
      <Provider store={Store}>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
