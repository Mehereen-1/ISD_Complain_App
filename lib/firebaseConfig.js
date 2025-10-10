// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Realtime DB

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQJmEeHYrX46urFEDMCKbHP0u9leSbOuA",
  authDomain: "complaint-app-cdb76.firebaseapp.com",
  databaseURL: "https://complaint-app-cdb76-default-rtdb.firebaseio.com",
  projectId: "complaint-app-cdb76",
  storageBucket: "complaint-app-cdb76.firebasestorage.app",
  messagingSenderId: "526565794049",
  appId: "1:526565794049:web:4e6b32a5185104fd7d3b00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app); // Realtime Database