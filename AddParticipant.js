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





function RandomBetween(min, max)
{
	return Math.floor(Math.random() * (max - min) + min)
}


// ===== Participant data =====
const name1 = document.getElementById("nume1");
function GetName1()
{
	return name1.value;
}

const name2 = document.getElementById("nume2");
function GetName2()
{
	return name2.value;
}


const teacher = document.getElementById("prof");
function GetTeacher()
{
	return teacher.value;
}

const school = document.getElementById("scoala");
function GetSchool()
{
	return school.value;
}

let traseu = 0;
function AssignTraseu()
{
	traseu = RandomBetween(1, 4);
	return traseu;
}
function GetTraseu()
{
	return traseu;
}



// ===== Submit button =====
const submitButton = document.getElementById("verificare");
submitButton.addEventListener("click", () =>
{
	// Verific daca a introdus datele
	if (GetName1() == "" || GetName2() == "" || GetSchool() == "" || GetTeacher() == "")
		return;

	// Push to database a team with a 4 digit code
	get(ref(db, "echipe")).then((snapshot) =>
	{
		let teamCode;
		do
		{
			teamCode = RandomBetween(1000, 10000);
		} while (snapshot.child(String(teamCode)).exists());

		// const updates = {};
		// updates[teamCode] = {
		// 	name1: GetName1(),
		// 	name2: GetName2(),
		// 	teacher: GetTeacher(),
		// 	school: GetSchool(),
		// 	traseu: AssignTraseu()
		// };
		// update(ref(db, "echipe"), updates);

		// set(ref(db, "echipe"), teamCode);

		set(ref(db, "echipe/" + String(teamCode)), {
			name1: GetName1(),
			name2: GetName2(),
			teacher: GetTeacher(),
			school: GetSchool(),
			traseu: AssignTraseu()
		});

		DisplayMessage(GetTraseu(), teamCode);
	})
});



// ===== Success/failure message
const message = document.getElementById("message");
message.style.display = "none";
function DisplayMessage(traseu, cod)
{
	message.innerText = "\nElevii " + GetName1() + " si " + GetName2() + " au fost adăugat în Database" +
		"\nL-i s-a atribuit traseul " + TraseuUtilities.TraseuNameFromNumber(traseu) +
		"\nSi codul " + cod +
		"\nNu uita să le dai un bilețel cu codul!";
	message.style.display = "block";
}



// ===== Password =====
function PromptPassword(pass)
{
	const val = prompt("Parola");

	if (val != pass)
	{
		alert("Parola incorecta. Te intorci la menuil principal");
		location.href = "index.html";
	}
}



onValue(ref(db, "password"), (snapshot) => { PromptPassword(snapshot.val()); });