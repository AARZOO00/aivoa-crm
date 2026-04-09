import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtN2BxPlwjfi4aJ1JzNcsK0wxOf1wp9AQ",
  authDomain: "aivoa-crm.firebaseapp.com",
  projectId: "aivoa-crm",
  storageBucket: "aivoa-crm.appspot.com",
  messagingSenderId: "340798446030",
  appId: "1:340798446030:web:0f593496ebb3a95899f39f",
  measurementId: "G-GG4QMKZ403"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
