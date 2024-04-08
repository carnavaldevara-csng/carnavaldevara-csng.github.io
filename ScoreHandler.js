// Import the functions you need from the SDKs you need
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







// ===== Score add =====
const scoreAdd = document.getElementById("score-add");
function GetScoreAdd()
{
	return scoreAdd.value;
}



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

function HasNoButtons(scoreDiv)
{
	return scoreDiv.hasAttribute("data-no-buttons");
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
		unsubscribe = onValue(ref(db, GetTeamCodeKey()), () =>
		{
			UpdateAllScoress();
		});

		DislayScoreForm(true);
	});
});

function UpdateAllScoress()
{
	for (let i = 0; i < scores.length; i++)
	{
		UpdateScore(scores[i]);
	}
}

function UpdateScore(scoreDiv)
{
	// let key = GetFullPath(scoreDiv);
	get(ref(db, GetFullPath(scoreDiv))).then((snapshot) =>
	{
		let value = snapshot.exists() ? snapshot.val() : 0;
		scoreDiv.children[0].innerText = GetLabel(scoreDiv) + " : " + value;
	});
}



// ===== Password =====
function PromptPassword(pass)
{
	const val = prompt("Parola");
	if (val != pass)
	{
		alert("Parola incorecta. Te intorci la menuil principal");
		location.href = "/index.html";
	}
}



// ===== Setup =====
DislayScoreForm(false);
// All score divs
const scores = document.getElementsByClassName("score");
// Setup all buttons
for (let i = 0; i < scores.length; i++)
{
	if (HasNoButtons(scores[i]))
	{
		continue;
	}

	GetAddButton(scores[i]).addEventListener("click", () =>
	{
		get(ref(db, GetFullPath(scores[i]))).then((snapshot) =>
		{
			set(snapshot.ref, Number(snapshot.val()) + Number(GetScoreAdd()));
		});
		UpdateScore(scores[i]);
	});
	GetSubtractButton(scores[i]).addEventListener("click", () =>
	{
		get(ref(db, GetFullPath(scores[i]))).then((snapshot) =>
		{
			set(snapshot.ref, Number(snapshot.val()) - Number(GetScoreAdd()));
		});
		UpdateScore(scores[i]);
	});
}


onValue(ref(db, "password"), (snapshot) => { PromptPassword(snapshot.val()); });