// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Firebase configuration
export const firebaseConfig = {
	apiKey: "AIzaSyCRzq6h6SA_DzRe90hnpAR-LNnBzfNdXEc",
	authDomain: "carnaval-de-vara-csng-7d795.firebaseapp.com",
	projectId: "carnaval-de-vara-csng-7d795",
	storageBucket: "carnaval-de-vara-csng-7d795.appspot.com",
	messagingSenderId: "8511173079",
	appId: "1:8511173079:web:5a4ccf29bb50c024a9db92",
	databaseURL: "https://carnaval-de-vara-csng-7d795-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);