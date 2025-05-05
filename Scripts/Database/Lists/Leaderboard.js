import { db } from "/Scripts/Database/DatabaseVariables.js";
import { onValue, ref, query, limitToLast, orderByChild } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

function UpdatePanelData(panel, name, score)
{
	// panel.innerText = score + " : " + name;
	panel.innerHTML = score + "&emsp;:&emsp;" + name;
}

function CreatePanel(name, score)
{
	const panel = document.createElement("div");
	panel.className = "panel";
	UpdatePanelData(panel, name, score);
	return panel;
}

const maxPanels = 10; // Doar top 10
const panels = [];
const leaderboard = document.getElementById("leaderboard");
function CreateLeaderboard(sortedSnapshot)
{
	for (let i = 0; i < sortedSnapshot.length; i++) {
		const name = sortedSnapshot[i].name;
		const score = sortedSnapshot[i].score;
		if (panels.length <= i) {
			const newPanel = CreatePanel(name, score);
			panels.push(newPanel);
			leaderboard.appendChild(newPanel);
		}
		else {
			UpdatePanelData(panels[i], name, score);
		}
	}
}

const echipeQuery = query(ref(db, "echipe"), orderByChild("score"), limitToLast(maxPanels));
onValue(echipeQuery, snapshot =>
{
	const sorted = Object.entries(snapshot.val())
		.map(([id, entry]) => ({ id, ...entry }))
		.sort((a, b) => b.score - a.score);
	CreateLeaderboard(sorted);
});
