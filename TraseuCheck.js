import { TraseuUtilities } from "/TraseuUtilities.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, set, ref, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCRzq6h6SA_DzRe90hnpAR-LNnBzfNdXEc",
	authDomain: "carnaval-de-vara-csng-7d795.firebaseapp.com",
	projectId: "carnaval-de-vara-csng-7d795",
	storageBucket: "carnaval-de-vara-csng-7d795.appspot.com",
	messagingSenderId: "8511173079",
	appId: "1:8511173079:web:5a4ccf29bb50c024a9db92",
	databaseURL: "https://carnaval-de-vara-csng-7d795-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);





// ===== Participant data =====
const teamCode = document.getElementById("cod");
function GetTeamCode()
{
	return teamCode.value;
}

function GetTeamCodeKey()
{
	return "echipe/" + GetTeamCode();
}



// ===== Submit button and main check =====
const traseuNum = document.getElementById("score-form").getAttribute("data-traseu-number");
const submitButton = document.getElementById("verificare");
submitButton.addEventListener("click", () =>
{
	// Verific daca a introdus datele
	if (GetTeamCode() == "")
		return;
	// Check for correct traseu
	get(ref(db, GetTeamCodeKey() + "/traseu")).then((snapshot) =>
	{
		console.log(snapshot.val());
		console.log(traseuNum);
		if (snapshot.val() != traseuNum)
			DisplayFailMessage(snapshot.val());
	});
});



// Success/failure message
function DisplayFailMessage(actualTraseu)
{
	alert("Echipa " + GetTeamCode() + " nu este la traseul \"" + TraseuUtilities.TraseuNameFromNumber(traseuNum) +
		"\", ci la traseul \"" + TraseuUtilities.TraseuNameFromNumber(actualTraseu) + ".\"");
	location.reload();
}