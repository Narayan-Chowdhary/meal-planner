//All API Should be Call Here
import callApi from "./apiCall";
import APIConfig from "./API_Endpoints.js";
import { getUserAPIEndpoint, getProductAPIEndpoint } from "../config";
//GET CALL

/// data of recipe
export const fetchRecipeData = async () => {
  const reqPayload = {
    method: APIConfig.getMethod,
    url: `${APIConfig.base_url}${APIConfig.getFoodAPIEndpoint}`,
  };
  let response = await callApi(reqPayload);
  return response;
};


// data of users
export const fetchUsersData = async () => {
  const reqPayload = {
    method: APIConfig.getMethod,
    url: `${APIConfig.base_url}${getUserAPIEndpoint}`,
  };
  let response = await callApi(reqPayload);
  return response;
};

/// data of products
export const fetchProductsData = async () => {
  const reqPayload = {
    method: APIConfig.getMethod,
    url: `${APIConfig.base_url}${getProductAPIEndpoint}`,
  };
  let response = await callApi(reqPayload);
  return response;
};
 

//POST CALL


//Patch Call



//DELETE CALL