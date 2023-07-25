// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFireStore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDB4dpTsHxttPhGGwFdpVRlEIfZ8JJBIS4",
    authDomain: "meal-planner-390411.firebaseapp.com",
    projectId: "meal-planner-390411",
    storageBucket: "meal-planner-390411.appspot.com",
    messagingSenderId: "519144819851",
    appId: "1:519144819851:web:940767779afc3d2579188e",
    measurementId: "G-6EJ5LJFLLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFireStore(app)