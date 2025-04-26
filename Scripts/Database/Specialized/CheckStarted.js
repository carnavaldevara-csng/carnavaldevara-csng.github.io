import { db } from "/Scripts/Database/DatabaseVariables.js";
import { onValue, ref } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

onValue(ref(db, "runtime"), snapshot =>
{
	if (!snapshot.val().started) {
		alert("Carnavalul de vară nu a început încă. Revino după ce a fost dat startul.");
		location.href = "index.html";
	}
	if (snapshot.val().ended) {
		alert("Carnavalul de vară s-a terminat. Sperăm ca te-ai distrat. Așteaptă să se afișeze rezultatele.");
	}
});