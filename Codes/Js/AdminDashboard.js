document.addEventListener("DOMContentLoaded",()=>{


lucide.createIcons();



let users=[

{
id:1,
name:"System Administrator",
role:"ADMIN",
status:"Active"
},


{
id:2,
name:"Dr Silva",
role:"JMO",
status:"Active"
},


{
id:3,
name:"Amal Perera",
role:"Clerk",
status:"Active"
}



];





let logs=[

{
user:"Admin",
action:"Created JMO account",
date:"21/07/2026"
},


{
user:"Admin",
action:"System login",
date:"21/07/2026"
}


];





displayUsers();

displayLogs();


document.getElementById("totalUsers").innerHTML =
users.length;


document.getElementById("activeUsers").innerHTML =
users.filter(
u=>u.status==="Active"
).length;



});





function displayUsers(){


let table=document.getElementById("userTable");


table.innerHTML="";



users.forEach(user=>{


table.innerHTML += `


<tr>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.role}</td>

<td>${user.status}</td>


<td>

<button onclick="disableUser(${user.id})">
Disable
</button>

</td>


</tr>


`;


});


}







function createUser(){


let name=
prompt("Enter user name");


let role=
prompt(
"Enter role (DOCTOR/JMO/CLERK/LAB)"
);



if(name && role){


users.push({

id:users.length+1,

name:name,

role:role,

status:"Active"


});



displayUsers();



alert(
"User created successfully"
);


}


}







function disableUser(id){


let user=
users.find(
u=>u.id===id
);


if(user){

user.status="Disabled";

displayUsers();

}


}








function displayLogs(){


let table=
document.getElementById("auditTable");


logs.forEach(log=>{


table.innerHTML +=`

<tr>

<td>${log.user}</td>

<td>${log.action}</td>

<td>${log.date}</td>

</tr>


`;


});


}
