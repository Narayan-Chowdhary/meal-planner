import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  onValue,
  set,
} from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://meal-planner-390411-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const starCountRef = ref(database, "mealplanner");

const getNotificationData = () => {

 return new Promise((resolve, reject) => {
  onValue(starCountRef, async (snapshot) => {
    resolve(snapshot.val());
  })
 });
};

export { database, getNotificationData };
