if(localStorage.getItem("hexagonAdmin")!=="true"){
    location.href="admin-login.html";
}

function getUsers(){
    return JSON.parse(localStorage.getItem("hexagonUsers")||"[]");
}

function saveUsers(users){
    localStorage.setItem("hexagonUsers",JSON.stringify(users));
}

function renderUsers(search=""){
    const table=document.getElementById("usersTable");
    if(!table) return;

    const users=getUsers();
    const term=search.toLowerCase();

    const filtered=users.filter(u=>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );

    document.getElementById("totalUsers").textContent=users.length;
    document.getElementById("activeUsers").textContent=
        users.filter(u=>u.status!=="Inactive").length;

    if(filtered.length===0){
        table.innerHTML=`<tr><td colspan="5" class="empty">No users found.</td></tr>`;
        return;
    }

    table.innerHTML=filtered.map(u=>`
        <tr>
            <td>
                <strong>${escapeHtml(u.name)}</strong>
            </td>
            <td>${escapeHtml(u.email)}</td>
            <td>${escapeHtml(u.createdAt||"—")}</td>
            <td>
                <button class="status-btn ${u.status==="Inactive"?"inactive":""}"
                    onclick="toggleStatus('${u.id}')">
                    ${u.status==="Inactive"?"Inactive":"Active"}
                </button>
            </td>
            <td>
                <button class="delete-btn" onclick="deleteUser('${u.id}')">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

function toggleStatus(id){
    const users=getUsers();
    const user=users.find(u=>u.id===id);
    if(!user) return;

    user.status=user.status==="Inactive"?"Active":"Inactive";
    saveUsers(users);
    renderUsers(document.getElementById("userSearch").value);
}

function deleteUser(id){
    const users=getUsers();
    const user=users.find(u=>u.id===id);

    if(!user) return;

    if(!confirm(`Delete ${user.name}?`)) return;

    const updated=users.filter(u=>u.id!==id);
    saveUsers(updated);

    const current=JSON.parse(localStorage.getItem("hexagonUser")||"null");
    if(current && current.id===id){
        localStorage.removeItem("hexagonUser");
        localStorage.removeItem("hexagonLoggedIn");
    }

    renderUsers(document.getElementById("userSearch").value);
}

function escapeHtml(value){
    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function adminLogout(){
    localStorage.removeItem("hexagonAdmin");
    location.href="admin-login.html";
}

document.addEventListener("DOMContentLoaded",()=>{
    renderUsers();

    const search=document.getElementById("userSearch");
    if(search){
        search.addEventListener("input",()=>{
            renderUsers(search.value);
        });
    }
});