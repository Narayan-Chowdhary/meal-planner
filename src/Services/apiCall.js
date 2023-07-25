//API CALL

export default async function callApi({ url, method, data }) {
  try {
    let options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (data) {
      options.data = JSON.stringify(data);
    }
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("API request failed");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}
