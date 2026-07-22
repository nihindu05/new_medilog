document.addEventListener(
"DOMContentLoaded",
()=>{


lucide.createIcons();



const createBtn =
document.getElementById("createUserBtn");


const createPanel =
document.getElementById("createUserPanel");



const roleSelect =
document.getElementById("roleSelect");


const generatedId =
document.getElementById("generatedId");


const licenseBox =
document.getElementById("licenseBox");





/*
=========================
OPEN CREATE USER FORM
=========================
*/


createBtn.addEventListener(
"click",
()=>{


createPanel.classList.toggle(
"hidden"
);


}
);







/*
=========================
GENERATE USER ID
=========================
*/


function generateID(role){


const prefix={


"JMO":"J",

"ASSISTANT_JMO":"AJ",

"DOCTOR":"D",

"LAB":"L",

"CLERK":"C",

"POLICE":"P"


};



if(!prefix[role]){

return "";

}



let number =
Math.floor(
Math.random()*900
)+100;



return prefix[role]+number;



}







/*
=========================
ROLE CHANGE
=========================
*/


roleSelect.addEventListener(
"change",
()=>{


const role =
roleSelect.value;



generatedId.value =
generateID(role);





if(
role==="JMO" ||
role==="ASSISTANT_JMO" ||
role==="DOCTOR" ||
role==="LAB"

){


licenseBox.style.display="flex";


}

else{


licenseBox.style.display="none";


}



}
);






});
