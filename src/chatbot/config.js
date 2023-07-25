import React,{useEffect, useState} from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import {Chip, Box} from "@mui/material"
import { base_url, getFoodAPIEndpoint, getLayoutAPIEndpoint } from "../config";


 



const WelcomeWidget = () => {

  


  useEffect(() => {
    suggestedFoodApi();
  }, [SuggestMealWidget]);

const suggestedFoodApi = async()=>{
   let response = await fetch(`${base_url}${getFoodAPIEndpoint}`);
    let responseJson = await response.json()
    console.log("output food", responseJson)
  }
  return (
    <Box>
      <p>Hello! Welcome to Meal Planner.</p>
      <p>How can I assist you today?</p>
    </Box>
  );
};

const SuggestMealWidget = () => {
  
  return (
    <Box>
      {console.log("ldjdlskjsl")}
      <p>Sure! I can help you with meal suggestions.</p>
      <p>
        Please provide me with some details about your dietary preferences or
        any specific requirements you have.
      </p>
      {/* Add your meal suggestion logic here */}
       <p> egg </p>
    </Box>
  );
};

const ContactWidget = () => {
  return (
    <Box>
      <p>
        If you would like our team to contact you, please provide your email
        address and phone number.
      </p>
      {/* Add your contact form or logic here */}
    </Box>
  );
};


const config = {
  lang: "no",
  botName: "MealBot",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#04668a",
    },
    chatButton: {
      backgroundColor: "#0f5faf",
    },
  },
  initialMessages: [
    createChatBotMessage("Welcome to Meal Planner!", {
      widget: "welcomeWidget",
    }),
  ],
  state: {},
  widgets: [
    {
      widgetName: "welcomeWidget",
      widgetFunc: (props) => <WelcomeWidget {...props} />,
    },
    {
      widgetName: "suggestMealWidget",
      widgetFunc: (props) => <SuggestMealWidget {...props} />,
    },
    {
      widgetName: "contactWidget",
      widgetFunc: (props) => <ContactWidget {...props} />,
    },
  ],
};

export default config;
