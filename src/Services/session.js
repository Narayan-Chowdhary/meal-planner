// Logged-in user is stored in localStorage under "items" (legacy key).
// Guests have nothing stored, so fall back to a guest profile instead of crashing.

const GUEST = Object.freeze({ role: "guest", name: "Guest" });

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("items"));
    return user && typeof user === "object" ? user : GUEST;
  } catch {
    return GUEST;
  }
}

export function logout() {
  localStorage.removeItem("items");
}
