import { db } from "/Scripts/Database/DatabaseVariables.js";
import { runTransaction, ref } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

const teamCode = document.getElementById("cod");
function GetTeamCode()
{
	return teamCode.value;
}

function RandomBetween(min, max)
{
	return Math.floor(Math.random() * (max - min) + min)
}

const moveButton = document.getElementById("move-task-back");
moveButton.addEventListener("click", () =>
{
	runTransaction(ref(db, "echipe/" + GetTeamCode()), echipa =>
	{
		console.log("runTransaction");
		if (echipa === null) return null;
		console.log("not null");

		let idxNou = echipa.currentTask + RandomBetween(2, 6); // Intre 2 si 5 taskuri muta inapoi

		// Clamt to last task
		idxNou = Math.min(idxNou, echipa.tasks.length - 1);
		console.log(`Move task ${echipa.tasks[echipa.currentTask]} la idx ${idxNou}`);

		// Swap tasks
		const temp = echipa.tasks[echipa.currentTask];
		echipa.tasks[echipa.currentTask] = echipa.tasks[idxNou];
		echipa.tasks[idxNou] = temp;

		return echipa;
	});
});