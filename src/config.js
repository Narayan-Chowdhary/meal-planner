// Central app configuration. Values come from Vite env variables (see .env.example).
const env = import.meta.env;

export const base_url = env.VITE_API_BASE_URL ?? "http://localhost:8000/";
export const cloudinaryUploadImage_url = env.VITE_CLOUDINARY_UPLOAD_URL ?? "";
export const firebaseDatabaseURL = env.VITE_FIREBASE_DATABASE_URL ?? "";
export const googleClientId = env.VITE_GOOGLE_CLIENT_ID ?? "";
export const razorpayKeyId = env.VITE_RAZORPAY_KEY_ID ?? "";

export const getFoodAPIEndpoint = "Food/";
export const getUserAPIEndpoint = "users/";
export const getProductAPIEndpoint = "Products/";
export const getMealAPIEndpoint = "meals/";
export const getIngredientAPIEndpoint = "Ingredient/";
export const getLayoutAPIEndpoint = "layout/";
export const getCartAPIEndpoint = "cart/";
export const getOrderAPIEndpoint = "orders/";
