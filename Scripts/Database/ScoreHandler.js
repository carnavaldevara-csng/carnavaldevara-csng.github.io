// Import the functions you need from the SDKs you need
import { db } from "/Scripts/Database/DatabaseVariables.js";
import { set, ref, onValue, get, update, increment } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";


// ===== Score add =====
const scoreAdd = document.getElementById("score-add");
function GetScoreAdd(scoreDiv)
{
	if (scoreDiv == undefined) {
		return Number(scoreAdd.value);
	}
	return scoreDiv.hasAttribute("data-fixed-add-value") && scoreDiv != undefined ?
		Number(scoreDiv.getAttribute("data-fixed-add-value")) :
		Number(scoreAdd.value);
}



// ===== Score div =====
function GetLabel(scoreDiv)
{
	const label = scoreDiv.children[0].getAttribute("data-label");
	return label ?? GetKey(scoreDiv);
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



// ===== Participant data =====
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
	scoreForm.style.display = display ? "block" : "none";
}

const submitButton = document.getElementById("verificare");
let unsubscribe = () => { return; };
submitButton.addEventListener("click", () =>
{
	// Verific daca a introdus datele
	if (GetTeamCode() === "")
		return;

	get(ref(db, GetTeamCodeKey())).then((snapshot) =>
	{
		if (!snapshot.exists()) {
			alert("Nu există echipa cu codul " + GetTeamCode() +
				".\nVerifică dacă ai introdus codul corect.\nDacă echipa nu este înscrisă va trebui înscrisă.");
			teamCode.value = "";
			return;
		}

		if (scoreAdd !== null) scoreAdd.value = 1;
		unsubscribe(); // So as to not call the function more times (onValue(ref, callback, {onlyOnce:true}) doesn't work)
		unsubscribe = onValue(ref(db, GetTeamCodeKey()), (snapshot) =>
		{
			UpdateAllScoress();
			// UpdateTaskList(snapshot);
		});

		DislayScoreForm(true);
	});
});

function UpdateAllScoress()
{
	for (let i = 0; i < scores.length; i++) {
		UpdateScore(scores[i]);
	}
}

function UpdateScore(scoreDiv)
{
	get(ref(db, GetFullPath(scoreDiv))).then((snapshot) =>
	{
		let value = snapshot.exists() ? snapshot.val() : 0;
		scoreDiv.children[0].innerText = GetLabel(scoreDiv) + " : " + value;
	});
}




// ===== Setup =====
DislayScoreForm(false);
// All score divs
const scores = document.getElementsByClassName("score");
// Setup all buttons
for (let i = 0; i < scores.length; i++) {
	if (HasNoButtons(scores[i])) {
		continue;
	}

	GetAddButton(scores[i]).addEventListener("click", () =>
	{
		const updates = {};
		updates[GetKey(scores[i])] = increment(GetScoreAdd(scores[i]));
		update(ref(db, GetTeamCodeKey(scores[i]) + '/'), updates);
	});
	GetSubtractButton(scores[i]).addEventListener("click", () =>
	{
		const updates = {};
		updates[GetKey(scores[i])] = increment(-GetScoreAdd(scores[i]));
		update(ref(db, GetTeamCodeKey(scores[i]) + '/'), updates);
	});
}