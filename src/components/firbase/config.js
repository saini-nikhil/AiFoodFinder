import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyDoQ5swBF2znHbiXEAAfkKWrTIH_26Pxoc",
    authDomain: "yoga-95b35.firebaseapp.com",
    projectId: "yoga-95b35",
    storageBucket: "yoga-95b35.firebasestorage.app",
    messagingSenderId: "1007475242863",
    appId: "1:1007475242863:web:62e4b1ab8f189487329a9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };