if(localStorage.getItem("hexagonLoggedIn")!=="true"){
    location.href="login.html";
}

const totalSets=document.querySelectorAll(".set-row").length;
let completedSets=0;

function updateProgress(){
    const percent=Math.round((completedSets/totalSets)*100);
    document.getElementById("percent").textContent=percent+"%";
    document.getElementById("progressText").textContent=completedSets+" / "+totalSets+" sets";
    document.getElementById("progressBar").style.width=percent+"%";

    if(completedSets===totalSets){
        document.getElementById("finishBtn").disabled=false;
        document.getElementById("finishBtn").textContent="Complete Workout ✓";
    }
}

function completeSet(button){
    const row=button.closest(".set-row");

    if(row.classList.contains("completed")) return;

    row.classList.add("completed");
    button.textContent="✓ Done";
    completedSets++;
    updateProgress();
}

function completeWorkout(){
    if(completedSets<totalSets){
        alert("Complete all "+totalSets+" sets before finishing your workout.");
        return;
    }

    const history=JSON.parse(localStorage.getItem("hexagonWorkoutHistory")||"[]");

    history.unshift({
        date:new Date().toLocaleDateString(),
        workout:"Upper Body Power",
        sets:completedSets,
        duration:"45 min"
    });

    localStorage.setItem("hexagonWorkoutHistory",JSON.stringify(history.slice(0,20)));
    localStorage.setItem("hexagonLastWorkout",new Date().toISOString());

    document.getElementById("exerciseList").style.display="none";
    document.querySelector(".complete-box").style.display="none";
    document.getElementById("success").style.display="block";
}

function logout(){
    localStorage.removeItem("hexagonLoggedIn");
    location.href="login.html";
}

updateProgress();