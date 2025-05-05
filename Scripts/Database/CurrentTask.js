import { get, ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { db } from "/Scripts/Database/DatabaseVariables.js"

const teamCode = document.getElementById("cod");
function GetTeamCode()
{
	return teamCode.value;
}

function GetTeamCodeKey()
{
	return "echipe/" + GetTeamCode();
}



const taskListElement = document.getElementById("current-task");
let unsubscribe = () => { return; };
function UpdateTaskList()
{
	// Verific daca a introdus datele
	if (GetTeamCode() === "")
		return;

	get(ref(db, GetTeamCodeKey())).then((snapshot) =>
	{
		if (!snapshot.exists()) {
			return;
		}

		unsubscribe(); // Unsubscribe so as to not add more event listeners to the same path
		unsubscribe = onValue(ref(db, GetTeamCodeKey()), (snapshot) =>
		{
			let taskIdx = snapshot.child("currentTask").val();
			const taskIdxMax = snapshot.child("tasks").val().length;
			let finishedAllTasks = false;
			if (taskIdx >= taskIdxMax) {
				taskIdx = taskIdxMax;
				finishedAllTasks = true;
			}

			let text = "<s>";
			for (let i = 0; i <= taskIdx - 1; i++) {
				text += taskList[snapshot.child("tasks/" + i).val()] + "<br>";
			}
			if (finishedAllTasks) {
				text += "</s><br><b>Ai terminat toate task-urile!</b>";
			}
			else {
				text += "</s>" + taskList[snapshot.child("tasks/" + taskIdx).val()];
			}

			taskListElement.innerHTML = text;
		});
	});
}

document.getElementById("verificare").addEventListener("click", UpdateTaskList);

// Load task list
let taskList = [];
onValue(ref(db, "tasks"), snapshot =>
{
	taskList = snapshot.val();
	UpdateTaskList();
});