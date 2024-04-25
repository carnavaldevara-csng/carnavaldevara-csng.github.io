import { TraseuUtilities } from "/TraseuUtilities.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, set, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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







// ===== Score div =====
function GetLabel(scoreDiv)
{
	const label = scoreDiv.children[0].getAttribute("data-label");
	if (label == null)
		return GetKey(scoreDiv);
	else
		return label;
}

function GetKey(scoreDiv)
{
	return scoreDiv.getAttribute("data-db-key");
}

function GetAddButton(scoreDiv)
{
	return scoreDiv.children[1];
}

function GetSubtractButton(scoreDiv)
{
	return scoreDiv.children[2];
}



// ===== Participant daa=ta =====
function GetFullPath(scoreDiv)
{
	return "echipe/" + GetTeamCode() + "/" + GetKey(scoreDiv);
}

const teamCode = document.getElementById("cod");
function GetTeamCode()
{
	return teamCode.value;
}

function GetTeamCodeKey()
{
	return "echipe/" + GetTeamCode();
}



// ===== Submit button =====
const scoreForm = document.getElementById("score-form");
function DislayScoreForm(display)
{
	scoreForm.style.display = (display ? "block" : "none");
}

const submitButton = document.getElementById("verificare");
let unsubscribe = () => { return; };
submitButton.addEventListener("click", () =>
{
	// Verific daca a introdus datele
	if (GetTeamCode() == "")
		return;

	get(ref(db, GetTeamCodeKey())).then((snapshot) =>
	{
		if (!snapshot.exists())
		{
			alert("Nu există echipa cu codul " + GetTeamCode() +
				".\nVerifică dacă ai introdus codul corect.\nDacă echipa nu este înscrisă va trebui adăugată in Database.");
			return;
		}

		unsubscribe();  // Unsubscribe so as to not add more event listeners to the same path
		unsubscribe = onValue(ref(db, GetTeamCodeKey()), (s) =>
		{
			UpdateAllScoress(
				s.child("name1").val(),
				s.child("name2").val(),
				s.child("teacher").val(),
				s.child("school").val(),
				s.child("traseu").val(),
				s.child("stiinte").val(),
				s.child("sport").val(),
				s.child("arta").val(),
				s.child("pacanele").val()
			);
		});

		DislayScoreForm(true);
	});
});



function UpdateAllScoress(nume1, nume2, prof, scoala, traseu, stiinte, sport, arta, pacanele)
{
	scoreForm.innerText =
		"Nume 1: " + nume1 +
		"\nNume 2: " + nume2 +
		"\nProfesor: " + prof +
		"\nȘcoală: " + scoala +
		"\n\nTraseu: " + TraseuUtilities.TraseuNameFromNumber(traseu) +
		"\n" + TraseuUtilities.ProbaNameFromTraseu(traseu, "stiinte") + ": " + ReplaceNull(stiinte) +
		"\n" + TraseuUtilities.ProbaNameFromTraseu(traseu, "sport") + ": " + ReplaceNull(sport) +
		"\n" + TraseuUtilities.ProbaNameFromTraseu(traseu, "arta") + ": " + ReplaceNull(arta) +
		(pacanele == null ? "" : "\nPunctaj black market: " + pacanele) +
		"\n\nPunctaj total: " + (stiinte + sport + arta + pacanele);
}

function ReplaceNull(val)
{
	return val == null ? 0 : val
}





// ===== Setup =====
DislayScoreForm(false);