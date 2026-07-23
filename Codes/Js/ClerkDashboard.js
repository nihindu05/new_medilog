document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  const session = window.MedLogsAPI.getSession();
  const user = session?.user;
  if (!user) return;

  const roles = user.roles || [user.role].filter(Boolean);
  if (!roles.includes("Administrative Clerk")) {
    window.location.replace("auth.html");
    return;
  }

  document.getElementById("clerkName").textContent = user.name || user.username;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    window.MedLogsAPI.clearSession();
    window.location.href = "auth.html";
  });

  try {
    const [patients, cases] = await Promise.all([
      window.MedLogsAPI.get("/patients"),
      window.MedLogsAPI.get("/cases")
    ]);
    const isCompleted = item =>
      ["completed", "closed"].includes(String(item.status || "").toLowerCase());
    document.getElementById("patientCount").textContent = patients.length;
    document.getElementById("caseCount").textContent = cases.length;
    document.getElementById("pendingCaseCount").textContent =
      cases.filter(item => !isCompleted(item)).length;
    document.getElementById("completedCaseCount").textContent =
      cases.filter(isCompleted).length;
  } catch (error) {
    document.getElementById("dashboardMessage").textContent = error.message;
  }
});
