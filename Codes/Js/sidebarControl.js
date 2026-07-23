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
  const userRoles = new Set(
    [...(user.roles || []), user.role]
      .filter(Boolean)
      .flatMap(role => [role, roleAliases[role] || role])
  );

  if (userRoles.has("CLERK")) {
    document.querySelectorAll('a.nav-item[href="DoctorDashboard.html"]')
      .forEach(item => {
        item.href = "ClerkDashboard.html";
      });
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    const allowedRoles = (item.dataset.roles || "")
      .split(",")
      .map(role => role.trim())
      .filter(Boolean);
    const isAllowed = !allowedRoles.length ||
      allowedRoles.some(role => userRoles.has(role));

    item.style.pointerEvents = isAllowed ? "auto" : "none";
    item.style.opacity = isAllowed ? "1" : "0.45";
    item.style.cursor = isAllowed ? "pointer" : "not-allowed";
    if (isAllowed) {
      item.removeAttribute("title");
    } else {
      item.title = "Access denied";
    }
  });
});
