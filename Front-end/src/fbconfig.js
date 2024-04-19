// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbt5vpfC7vEcfUduwPD4QzcfrcrXmUtNU",
  authDomain: "nwmsu-assessmentviewer.firebaseapp.com",
  databaseURL: "https://nwmsu-assessmentviewer-default-rtdb.firebaseio.com",
  projectId: "nwmsu-assessmentviewer",
  storageBucket: "nwmsu-assessmentviewer.appspot.com",
  messagingSenderId: "573083720395",
  appId: "1:573083720395:web:282e87bbc08294dbc3194e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const firestore = getFirestore();
const storage = getStorage(app);


export {auth, firestore, storage};
