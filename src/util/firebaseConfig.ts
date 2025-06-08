import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBTfbSfUVFQskHCykSRg88NsrNBurDkBao",
    authDomain: "ritualplanner-43ef7.firebaseapp.com",
    projectId: "ritualplanner-43ef7",
    storageBucket: "ritualplanner-43ef7.firebasestorage.app",
    messagingSenderId: "238707883729",
    appId: "1:238707883729:web:83a70d9b4879c2b8634ff0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);