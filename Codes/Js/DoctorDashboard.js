document.addEventListener(

    "DOMContentLoaded",

    () => {





        lucide.createIcons();





        // ============================

        // CURRENT USER

        // ============================





        const user =

            JSON.parse(

                sessionStorage.getItem("currentUser")

            );





        const roleAliases = {
            "System Administrator": "ADMIN",
            "Consultant JMO": "JMO",
            "Medical Officer Medico-Legal": "DOCTOR",
            "Assistant JMO": "ASSISTANT_JMO",
            "Administrative Clerk": "CLERK",
            "Laboratory Staff": "LAB",
            "Police Liaison": "POLICE"
        };
        const currentRole = roleAliases[user?.role] || user?.role;
        const doctorRoles = ["DOCTOR", "ASSISTANT_JMO", "JMO"];

        if (!user || !doctorRoles.includes(currentRole)) {



            alert("Unauthorized access");

        

            window.location.href = "auth.html";

        

            return;

        }







        document.getElementById("userName")

            .textContent = user.name;







        document.getElementById("userRole")

            .textContent = user.role;







        document.getElementById("welcomeName")

            .textContent = user.name;







        document.getElementById("userAvatar")

            .textContent =

            user.name

                .charAt(0)

                .toUpperCase();

        // ============================

// The sidebar remains navigable for authenticated medical staff.
// API authorization is enforced by the backend for protected data.
document.querySelectorAll(".nav-item").forEach(item => {
    item.style.pointerEvents = "auto";
    item.style.opacity = "1";
    item.style.cursor = "pointer";
    item.removeAttribute("title");
});
        



        // ============================

        // TEMPORARY DATABASE

        // ============================





        let cases =

            JSON.parse(

                localStorage.getItem("doctorCases")

            )

            ||

            [



                {

                    id:"CL-2026-001",

                    patient:"Kamal Perera",

                    type:"Clinical",

                    status:"Pending Examination"

                },





                {

                    id:"PM-2026-004",

                    patient:"Unknown",

                    type:"Autopsy",

                    status:"Completed"

                }



            ];







        let examinations =

            JSON.parse(

                localStorage.getItem("doctorExams")

            )

            ||

            [



                {

                    case:"CL-2026-001",

                    exam:"Injury Assessment",

                    priority:"High",

                    status:"Pending"

                },





                {

                    case:"PM-2026-004",

                    exam:"Autopsy Examination",

                    priority:"Normal",

                    status:"Completed"

                }



            ];







        let reports =

            JSON.parse(

                localStorage.getItem("doctorReports")

            )

            ||

            [



                {

                    id:"RPT-001",

                    case:"CL-2026-001",

                    status:"Draft"

                },





                {

                    id:"RPT-002",

                    case:"PM-2026-004",

                    status:"Submitted"

                }



            ];









        function saveData(){





            localStorage.setItem(

                "doctorCases",

                JSON.stringify(cases)

            );





            localStorage.setItem(

                "doctorExams",

                JSON.stringify(examinations)

            );





            localStorage.setItem(

                "doctorReports",

                JSON.stringify(reports)

            );





        }











        // ============================

        // UPDATE STATISTICS

        // ============================





        function updateStats(){





            const cards =

                document.querySelectorAll(

                    ".stat-card h3"

                );





            cards[0].textContent =

                cases.length;







            cards[1].textContent =

                examinations.filter(

                    e=>e.status==="Pending"

                ).length;







            cards[2].textContent =

                reports.filter(

                    r=>r.status==="Draft"

                ).length;







            cards[3].textContent =

                cases.filter(

                    c=>c.status==="Completed"

                ).length;





        }













        // ============================

        // LOAD CASE TABLE

        // ============================





        function loadCases(){





            const table =

                document.getElementById(

                    "caseTable"

                );





            table.innerHTML="";







            cases.forEach(

                item=>{





                table.innerHTML += `





                <tr>



                <td>${item.id}</td>



                <td>${item.patient}</td>



                <td>${item.type}</td>





                <td>



                <span class="${

                    item.status==="Completed"

                    ?

                    "status-complete"

                    :

                    "status-pending"

                }">



                ${item.status}



                </span>



                </td>





                <td>



                <button 

                class="table-action open-case"

                data-id="${item.id}">



                Open



                </button>





                </td>





                </tr>





                `;





            });





            document

            .querySelectorAll(".open-case")

            .forEach(btn=>{





                btn.onclick=()=>{





                    openCase(

                        btn.dataset.id

                    );





                };





            });





        }

function openCase(caseId){
    window.location.href =
        `CaseManagement.html?caseId=${encodeURIComponent(caseId)}`;
}

updateStats();
loadCases();
    }
);
