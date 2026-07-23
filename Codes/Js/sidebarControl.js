document.addEventListener("DOMContentLoaded", () => {
  const user = window.MedLogsAPI?.getSession()?.user ||
    JSON.parse(sessionStorage.getItem("currentUser") || "null");
  if (!user) return;

  const roleAliases = {
    "System Administrator": "ADMIN",
    "Consultant JMO": "JMO",
    "Medical Officer Medico-Legal": "DOCTOR",
    "Assistant JMO": "ASSISTANT_JMO",
    "Administrative Clerk": "CLERK",
    "Laboratory Staff": "LAB",
    "Police Liaison": "POLICE",
    "Read-Only User": "READ_ONLY"
  };
  const roles = [...(user.roles || []), user.role]
    .filter(Boolean)
    .map(role => roleAliases[role] || role);

  const dashboardByRole = {
    ADMIN: "AdminDashboard.html",
    JMO: "JMODashboard.html",
    ASSISTANT_JMO: "AssistantJMODashboard.html",
    DOCTOR: "DoctorDashboard.html",
    CLERK: "ClerkDashboard.html",
    LAB: "LabDashboard.html"
  };
  const dashboard = roles
    .map(role => dashboardByRole[role])
    .find(Boolean);

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.style.pointerEvents = "auto";
    item.style.opacity = "1";
    item.style.cursor = "pointer";
    item.removeAttribute("title");
  });

  if (dashboard) {
    navItems.forEach(item => {
      const label = item.textContent.trim().toLowerCase();
      if (label === "dashboard" || /Dashboard\.html$/i.test(item.getAttribute("href") || "")) {
        item.href = dashboard;
      }
    });
  }
});
