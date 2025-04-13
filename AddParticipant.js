import { db } from "/DatabaseVariables.js";
import { set, ref, onValue, get, update, runTransaction } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";


function RandomBetween(min, max)
{
	return Math.floor(Math.random() * (max - min) + min)
}


// ===== Participant data =====
const name = document.getElementById("nume");
function GetName()
{
	return name.value;
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



let taskList;
function GetShuffledTaskList(allTasks)
{
	const result = taskList.slice();
	for (let i = 0; i < result.length; i++) {
		const randIdx = RandomBetween(i, result.length);
		const temp = result[i];
		result[i] = result[randIdx];
		result[randIdx] = temp;
	}
	return result;
}




function ResetForm()
{
	name.value = ""
	teacher.value = ""
	school.value = ""
}



// ===== Submit button =====
const submitButton = document.getElementById("verificare");
submitButton.addEventListener("click", () =>
{
	// Push a team with a 3 digit code to database
	let teamCode;
	runTransaction(ref(db, "echipe"), echipe =>
	{
		if (GetName() === "" || GetTeacher === "" || GetSchool() === "") return; // Error

		const newTeam = {
			name: GetName(),
			teacher: GetTeacher(),
			school: GetSchool(),
			tasks: GetShuffledTaskList(taskList),
			currentTask: 0,
			score: 0
		};

		echipe = echipe ?? {}; // Creaza obiectul daca nu exista

		do {
			teamCode = RandomBetween(100, 1000);
		} while (teamCode in echipe);

		echipe[teamCode] = newTeam;
		return echipe;
	}).then(() =>
	{
		DisplayMessage(teamCode);
		ResetForm();
	}).catch(() => 
	{
		alert("A avut loc o eroare. Mai incearca o data.");
	});
});



// ===== Success/failure message =====
const message = document.getElementById("message");
message.style.display = "none";
function DisplayMessage(cod)
{
	message.innerText =
		`\nEchipa formată din ${GetName()}
de la scoala ${GetSchool()},
cu profesorul ${GetTeacher()}
a fost adăugată în Database.
I s-a atribuit codul ${cod}.
Nu uita de cartonașul cu codul!`;
	message.style.display = "block";
}




// Load task list
onValue(ref(db, "tasks"), snapshot => taskList = snapshot.val().slice());

// ===== Password =====
function PromptPassword(pass)
{
	const val = prompt("Parola");

	if (val != pass) {
		alert("Parola incorecta. Te intorci la menuil principal.");
		location.href = "index.html";
	}
}

// onValue(ref(db, "password"), snapshot => PromptPassword(snapshot.val()));