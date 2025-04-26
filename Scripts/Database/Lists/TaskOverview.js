import { db } from "/Scripts/Database/DatabaseVariables.js";
import { onValue, get, ref, query, limitToLast, orderByChild } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

function UpdatePanelData(panel, task, score)
{
	panel.innerHTML = score + "&emsp;:&emsp;" + task;
}

function CreatePanel(task, score)
{
	const panel = document.createElement("div");
	panel.className = "panel";
	UpdatePanelData(panel, task, score);
	return panel;
}

const panels = [];
const taskBoard = document.getElementById("task-overview");
function CreateBoard()
{
	for (let i = 0; i < Object.keys(taskCounter).length; i++) {
		const task = taskList[i];
		const score = taskCounter[taskList[i]];
		if (panels.length <= i) {
			const newPanel = CreatePanel(task, score);
			panels.push(newPanel);
			taskBoard.appendChild(newPanel);
		}
		else {
			UpdatePanelData(panels[i], task, score);
		}
	}
}

const taskCounter = {}; // JSON cu structura => nume task : contor echipe care fac taskul asta
function CountTasks(echipeSnapshot, lookupAmount = 1, usePo2 = false)
{
	for (let i = 0; i < taskList.length; i++) {
		taskCounter[taskList[i]] = 0;
	}

	const teamCodes = Object.keys(echipeSnapshot);
	for (let i = 0; i < teamCodes.length; i++) {
		const echipa = echipeSnapshot[teamCodes[i]];
		for (let j = 0; j < lookupAmount; j++) {
			if (echipa.currentTask + j >= taskList.length) {
				break;
			}
			taskCounter[echipa.tasks[echipa.currentTask + j]] += usePo2 ? Math.pow(2, lookupAmount - j - 1) : 1;
			// taskCounter[echipa.tasks[echipa.currentTask + j]] += usePo2 ? lookupAmount - j : 1;
		}
	}
}

function UpdateBoard()
{
	CountTasks(lastEchipeSnapshot, lookupAmount, lookupUsePo2);
	CreateBoard();
}



const lookupAmountInput = document.getElementById("lookup-amount");
let lookupAmount = lookupAmountInput.value;
lookupAmountInput.addEventListener("change", () =>
{
	lookupAmount = Number(lookupAmountInput.value);
	UpdateBoard();
});

const lookupUsePo2Input = document.getElementById("lookup-power");
let lookupUsePo2 = lookupUsePo2Input.value;
lookupUsePo2Input.addEventListener("change", (e) =>
{
	lookupUsePo2 = lookupUsePo2Input.checked;
	UpdateBoard();
});

// Load task list
let taskList = [];
onValue(ref(db, "tasks"), snapshot => taskList = snapshot.val().slice());

let lastEchipeSnapshot;
onValue(ref(db, "echipe"), snapshot =>
{
	lastEchipeSnapshot = snapshot.val();
	UpdateBoard();
});
