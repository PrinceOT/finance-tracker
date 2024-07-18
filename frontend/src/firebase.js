// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import{ getFirestore, doc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbyCLksBpW6FeZfgixz039JmbRlNyKhWo",
  authDomain: "finance-tracker-a3c9b.firebaseapp.com",
  projectId: "finance-tracker-a3c9b",
  storageBucket: "finance-tracker-a3c9b.appspot.com",
  messagingSenderId: "279967411511",
  appId: "1:279967411511:web:0b4db90557262834117eb2",
  measurementId: "G-YLTNBS5148"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc };