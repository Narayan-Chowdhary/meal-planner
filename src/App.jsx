import "./App.css";
import "react-chatbot-kit/build/main.css";
import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Box, CircularProgress } from "@mui/material";

// Chat bot
import Chatbot from "react-chatbot-kit";
import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";


// Landing page and shared layout load eagerly; every other route is code-split.
import Login from "./pages/Login/Login";
import Layout from "./pages/Layout/Layout";
import RequireAuth from "./components/common/RequireAuth";

const Home = lazy(() => import("./pages/Home/Home"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const About = lazy(() => import("./pages/About/About"));
const Menu = lazy(() => import("./pages/Menu/Menu"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const NoMatch = lazy(() => import("./pages/NoMatch/NoMatch"));
const Calender = lazy(() => import("./pages/calender/Calender"));
const Mealdes = lazy(() => import("./pages/Mealdes/Mealdes"));
const DishPage = lazy(() => import("./components/DishPage/DishPage"));
const RecipeSuggestionPage = lazy(() => import("./components/ui/RecipeSuggestionPage/RecipeSuggestionPage"));
const Settings = lazy(() => import("./components/Settings/Settings"));
const Addrecipe = lazy(() => import("./components/ui/Addrecipe/Addrecipe"));
const UsersData = lazy(() => import("./components/Admin/UsersData"));
const ProductData = lazy(() => import("./components/Admin/ProductData"));
const AddRecipeCSV = lazy(() => import("./components/Admin/addRecipeCSV"));
const RecipeVideiotutorial = lazy(() => import("./pages/RecipeVideoTutorial/RecipeVideiotutorial"));
const Allmeals = lazy(() => import("./components/allMeals/Allmeals"));
const Cart = lazy(() => import("./components/Cart/Cart"));
const Groceries = lazy(() => import("./components/Groceries/Groceries"));
const BuildComp = lazy(() => import("./pages/buildingComponent/buildComp"));
const ActivityBoard = lazy(() => import("./pages/ActivityBoard/ActivityBoard"));
const Ordertable = lazy(() => import("./components/Admin/Ordertable/Ordertable"));
const FitnessReport = lazy(() => import("./components/ui/fitnessReport/FitnessReport"));
const AdminLayout = lazy(() => import("./components/Admin/Adminlayout/admin_layout"));

const PageLoader = () => (
  <Box data-testid="page-loader" sx={{ display: "flex", justifyContent: "center", py: 8 }}>
    <CircularProgress />
  </Box>
);

function App() {
  const [showBot, toggleBot] = useState(false);

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
        type="button"
        className="app-chatbot-button"
        aria-label={showBot ? "Close Mealot assistant" : "Open Mealot assistant"}
        aria-expanded={showBot}
        onClick={() => toggleBot((prev) => !prev)}
      >
        <svg viewBox="0 0 640 512" className="app-chatbot-button-icon">
          <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
        </svg>
        <span>Mealot</span>
      </button>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* StandAlone */}
            <Route index path="/" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route
              path="/home"
              element={<Home toggleBot={toggleBot} showBot={showBot} />}
            ></Route>
            <Route
              path="/recipeSuggestionPage"
              element={<RecipeSuggestionPage />}
            ></Route>

            <Route
              path="/recipevt"
              element={<RecipeVideiotutorial />}
            ></Route>
            <Route path="/" element={<Layout />}>
              {/* Users Routes */}
              <Route path="/mealplanner" element={<RequireAuth><Calender /></RequireAuth>}></Route>
              {/* planned meal description */}
              <Route path="/mealdes" element={<RequireAuth><Mealdes /></RequireAuth>}></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/menu" element={<Menu />}></Route>
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>}></Route>
              <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>}></Route>
              {/* particular single dish page */}
              <Route path="/dishPage" element={<DishPage />}></Route>
              <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>}></Route>
              <Route path="/fitenssreport" element={<RequireAuth><FitnessReport /></RequireAuth>}></Route>

              <Route path="/addrecipe" element={<RequireAuth><Addrecipe /></RequireAuth>}></Route>
              <Route path="/allmeals" element={<Allmeals />}></Route>
              <Route path="/groceries" element={<RequireAuth><Groceries /></RequireAuth>}></Route>
              <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>}></Route>
              <Route path="/ordertable" element={<RequireAuth role="admin"><Ordertable /></RequireAuth>}></Route>
              {/* Admin Routes */}
              <Route
                path="/adminLayout"
                element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}
              ></Route>
              <Route path="/users" element={<RequireAuth role="admin"><UsersData /></RequireAuth>}></Route>
              <Route path="/products" element={<RequireAuth role="admin"><ProductData /></RequireAuth>}></Route>
              <Route
                path="/addrecipe/:id"
                element={<RequireAuth><Addrecipe /></RequireAuth>}
              ></Route>
              <Route
                path="/add-recipe-csv"
                element={<RequireAuth><AddRecipeCSV /></RequireAuth>}
              ></Route>
            </Route>
            <Route path="*" element={<NoMatch />} />
            <Route path="/buildComp" element={<BuildComp />}></Route>
            <Route
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
