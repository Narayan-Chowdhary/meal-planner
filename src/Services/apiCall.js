// Thin wrapper around fetch for the json-server API.

export default async function callApi({ url, method = "GET", data, signal }) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    signal,
  };
  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${method} ${url} -> ${response.status}`);
  }
  // DELETE responses may have an empty body
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
