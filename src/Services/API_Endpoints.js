import { base_url, getFoodAPIEndpoint } from "../config";

const APIConfig = {
  base_url,
  getFoodAPIEndpoint,
  getMethod: "GET",
  postMethod: "POST",
  putMethod: "PUT",
  patchMethod: "PATCH",
  DeleteMethod: "DELETE",
};

export default APIConfig;
