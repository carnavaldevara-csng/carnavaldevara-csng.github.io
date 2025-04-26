import { db } from "/Scripts/Database/DatabaseVariables.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

function PromptPassword(pass)
{
	if (prompt("Parola") !== pass) {
		alert("Parola incorecta. Te intorci la menuil principal.");
		location.href = "index.html";
	}
}

onValue(ref(db, "password"), snapshot => PromptPassword(snapshot.val()));