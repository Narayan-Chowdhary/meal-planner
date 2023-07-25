import "./App.css";
import "react-chatbot-kit/build/main.css";
import React, { useState,lazy, Suspense, useEffect } from "react";
import Login from "./pages/Login/Login";
import {Button} from '@mui/material'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./Store/Slices/Store";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import About from "./pages/About/About";
import Menu from "./pages/Menu/Menu";
import Profile from "./pages/Profile/Profile";
import Wishlist from "./pages/Wishlist/Wishlist";
import Layout from "./pages/Layout/Layout";
import NoMatch from "./pages/NoMatch/NoMatch";
import Calender from "./pages/calender/Calender";
import Mealdes from "./pages/Mealdes/Mealdes";
import DishPage from "./components/DishPage/DishPage";
import RecipeSuggestionPage from "./components/ui/RecipeSuggestionPage/RecipeSuggestionPage";
import Settings from "./components/Settings/Settings";
import Notification from "./pages/Notification/Notification";
import Addrecipe from "./components/ui/Addrecipe/Addrecipe";
import UsersData from "./components/Admin/UsersData";
import ProductData from "./components/Admin/ProductData";
import AddRecipeCSV from "./components/Admin/addRecipeCSV";
import RecipeVideiotutorial from "./pages/RecipeVideoTutorial/RecipeVideiotutorial";
import Rough from "./Rough";
import Allmeals from "./components/allMeals/Allmeals";
import Cart from "./components/Cart/Cart";
import Groceries from "./components/Groceries/Groceries";
import BuildComp from "./pages/buildingComponent/buildComp";
import ActivityBoard from "./pages/ActivityBoard/ActivityBoard";


//Chat Bot

import Chatbot from "react-chatbot-kit";
import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider.js";
import Ordertable from "./components/Admin/Ordertable/Ordertable";

import { base_url, getFoodAPIEndpoint, getLayoutAPIEndpoint } from "./config";
import FitnessReport from "./components/ui/fitnessReport/FitnessReport";


const AdminLayout = React.lazy(() =>
  import("./components/Admin/Adminlayout/admin_layout")
);

function App() {
    const [showBot, toggleBot] = useState(false);


      const [pageStyles, setpageStyles] = useState("");

      const fetchStyles = async () => {
        const response = await fetch(
          `${base_url}${getLayoutAPIEndpoint}`
        );
        let styles = await response.json();
   
        setpageStyles(styles[0]?.styles);
      };

      useEffect(() => {
        fetchStyles();
      }, []);





   
  return (
    <div>
      {showBot && (
        <div className="app-chatbot-container">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
      <button
        style={{
          // background: `${pageStyles?.bgColor} !important`,?
          background: `${pageStyles?.bgColor} `,
          color: `${pageStyles?.TextColor} `,
        }}
        className="app-chatbot-button"
        onClick={() => toggleBot((prev) => !prev)}
      >
        <div>Mealot</div>
        <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
          <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
        </svg>
      </button>
      {/* <Rough/> */}
      <BrowserRouter>
        <Suspense fallback={<p>Loading</p>}>
          <Routes>
            {/* StandAlone */}
            <Route index path="/" element={<Login />}></Route>
            <Route exact path="/signup" element={<SignUp />}></Route>
            <Route
              exact
              path="/home"
              element={<Home toggleBot={toggleBot} showBot={showBot} />}
            ></Route>
            <Route
              exact
              path="/recipeSuggestionPage"
              element={<RecipeSuggestionPage />}
            ></Route>

            <Route
              exact
              path="/recipevt"
              element={<RecipeVideiotutorial />}
            ></Route>
            <Route path="/" element={<Layout />}>
              {/* Users Routes */}
              <Route exact path="/mealplanner" element={<Calender />}></Route>
              {/* planned meal description */}
              <Route exact path="/mealdes" element={<Mealdes />}></Route>
              <Route exact path="/about" element={<About />}></Route>
              <Route exact path="/menu" element={<Menu />}></Route>
              <Route exact path="/profile" element={<Profile />}></Route>
              <Route exact path="/wishlist" element={<Wishlist />}></Route>
              {/* particular single dish page */}
              <Route exact path="/dishPage" element={<DishPage />}></Route>
              <Route exact path="/settings" element={<Settings />}></Route>
              <Route exact path="/fitenssreport" element={<FitnessReport />}></Route>

              <Route exact path="/addrecipe" element={<Addrecipe />}></Route>
              <Route exact path="/allmeals" element={<Allmeals />}></Route>
              <Route exact path="/groceries" element={<Groceries />}></Route>
              <Route exact path="/cart" element={<Cart />}></Route>
              <Route exact path="/ordertable" element={<Ordertable />}></Route>
              {/* Admin Routes */}
              <Route
                exact
                path="/adminLayout"
                element={<AdminLayout />}
              ></Route>
              <Route exact path="/users" element={<UsersData />}></Route>
              <Route exact path="/products" element={<ProductData />}></Route>
              <Route
                exact
                path="/addrecipe/:id"
                element={<Addrecipe />}
              ></Route>
              <Route
                exact
                path="/add-recipe-csv"
                element={<AddRecipeCSV />}
              ></Route>
            </Route>
            <Route path="*" element={<NoMatch />} />
            <Route exact path="/buildComp" element={<BuildComp />}></Route>
            <Route
              exact
              path="/activity"
              element={<ActivityBoard />}
            ></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
