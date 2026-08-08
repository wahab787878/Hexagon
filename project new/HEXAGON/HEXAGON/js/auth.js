const form=document.getElementById("authForm");
const msg=document.getElementById("message");
const signup=location.pathname.includes("signup");

if(localStorage.getItem("hexagonLoggedIn")==="true"&&!signup){
    location.href="dashboard.html";
}

form.addEventListener("submit",e=>{
    e.preventDefault();

    const email=document.getElementById("email").value.trim().toLowerCase();
    const password=document.getElementById("password").value;

    if(signup){
        const name=document.getElementById("name").value.trim();
        let users=JSON.parse(localStorage.getItem("hexagonUsers")||"[]");

        if(users.some(u=>u.email===email)){
            msg.textContent="An account with this email already exists.";
            msg.style.display="block";
            return;
        }

        const user={
            id:Date.now().toString(),
            name,
            email,
            password,
            status:"Active",
            createdAt:new Date().toLocaleDateString()
        };

        users.push(user);
        localStorage.setItem("hexagonUsers",JSON.stringify(users));
        localStorage.setItem("hexagonUser",JSON.stringify(user));
        localStorage.setItem("hexagonLoggedIn","true");
        location.href="dashboard.html";

    }else{
        const users=JSON.parse(localStorage.getItem("hexagonUsers")||"[]");
        let user=users.find(u=>u.email===email&&u.password===password);

        // Backward compatibility with the old single-user demo
        if(!user){
            const oldUser=JSON.parse(localStorage.getItem("hexagonUser")||"null");
            if(oldUser&&oldUser.email===email&&oldUser.password===password){
                user=oldUser;
            }
        }

        if(user){
            localStorage.setItem("hexagonUser",JSON.stringify(user));
            localStorage.setItem("hexagonLoggedIn","true");
            location.href="dashboard.html";
        }else{
            msg.textContent="Invalid email or password.";
            msg.style.display="block";
        }
    }
});