import { db } from "/DatabaseVariables.js";
import { ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
		if (!snapshot.exists()) {
			alert("Nu există echipa cu codul " + GetTeamCode() +
				".\nVerifică dacă ai introdus codul corect.\nDacă echipa nu este înscrisă va trebui adăugată in Database.");
			return;
		}

		unsubscribe(); // Unsubscribe so as to not add more event listeners to the same path
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
	scoreForm.innerText = "PLACEHOLDER"
}

function ReplaceNull(val)
{
	return val == null ? 0 : val
}





// ===== Setup =====
DislayScoreForm(false);