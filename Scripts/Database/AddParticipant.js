import { db } from "/Scripts/Database/DatabaseVariables.js";
import { ShuffledIndexes, RandomBetween, Swap } from "/Scripts/Utility.js";
import { ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
		if (GetName() === "" || GetTeacher() === "" || GetSchool() === "") return; // Error
		echipe = echipe ?? {}; // Creaza obiectul daca nu exista

		const newTeam = {
			name: GetName(),
			teacher: GetTeacher(),
			school: GetSchool(),
			tasks: ShuffledIndexes(0, taskList.length),
			currentTask: 0,
			score: 0
		};

		// Task-ul cu indice 0 trebuie sa se afle printre primele n taskuri
		const idx0Dist = 6; // Task-ul cu idx 0 se alfa printre primele 6 task-uri
		const idx0 = newTeam.tasks.indexOf(0);
		if (idx0 > idx0Dist) {
			const idxNou = RandomBetween(0, idx0Dist + 1);
			const temp = newTeam.tasks[idx0];
			newTeam.tasks[idx0] = newTeam.tasks[idxNou];
			newTeam.tasks[idxNou] = temp;
		}

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
let taskList = [];
onValue(ref(db, "tasks"), snapshot => taskList = snapshot.val());
