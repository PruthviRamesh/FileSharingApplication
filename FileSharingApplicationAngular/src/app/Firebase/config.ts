// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0C_9ePCE2cYT3qADnfD-HVw6Bg3Vua5s",
  authDomain: "filesharing-cbab7.firebaseapp.com",
  projectId: "filesharing-cbab7",
  storageBucket: "filesharing-cbab7.appspot.com",
  messagingSenderId: "40804319449",
  appId: "1:40804319449:web:e4917856e082e1c01a7ec8",
  measurementId: "G-QMXVYQFC22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth=getAuth(app);